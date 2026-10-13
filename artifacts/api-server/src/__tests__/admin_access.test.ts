import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import type { Server } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import app from "../app.js";
import { isEmailAdmin, getAdminEmails } from "../middlewares/admin.js";
import { inMemoryStore } from "../data/inMemoryStore.js";

let server: Server;
let baseUrl: string;

before(async () => {
  await new Promise<void>((resolve) => {
    server = app.listen(0, "127.0.0.1", () => {
      const addr = server.address();
      if (addr && typeof addr === "object") {
        baseUrl = `http://127.0.0.1:${addr.port}`;
      }
      resolve();
    });
  });
});

after(async () => {
  await new Promise<void>((resolve) => {
    server.close(() => resolve());
  });
});

async function getValidCsrf(context = "anon") {
  const res = await fetch(`${baseUrl}/api/csrf-token`, {
    headers: { Accept: "application/json" },
  });
  const data = (await res.json()) as any;
  const cookieHeader = res.headers.get("set-cookie") || "";
  const cookiePart = cookieHeader.split(";")[0];
  return {
    csrfToken: data.csrfToken,
    cookie: cookiePart,
  };
}

describe("Admin Security & User Isolation Suite", () => {
  test("1. Admin emails are dynamically loaded from environment variables without hardcoded emails", () => {
    const adminEmails = getAdminEmails();
    assert.ok(Array.isArray(adminEmails), "Should return array of admin emails");
    assert.ok(adminEmails.length > 0, "Should have loaded admin emails from .env");
    
    // Check known email in .env
    const testAdmin = adminEmails[0];
    assert.equal(isEmailAdmin(testAdmin), true, "Configured email should be admin");
    assert.equal(isEmailAdmin(testAdmin.toUpperCase()), true, "Case-insensitive check should match");
    assert.equal(isEmailAdmin("regular.user@example.com"), false, "Non-admin email must return false");
    assert.equal(isEmailAdmin(null), false);
    assert.equal(isEmailAdmin(undefined), false);
  });

  test("2. Unauthorized or regular user cannot mutate products (POST, PUT, DELETE)", async () => {
    const { csrfToken, cookie } = await getValidCsrf();

    // POST /api/products
    const postRes = await fetch(`${baseUrl}/api/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
        Cookie: cookie,
        "x-user-email": "normal.customer@gmail.com",
        "x-user-id": "cust_123",
      },
      body: JSON.stringify({ name: "Malicious Product", price: 100 }),
    });
    assert.equal(postRes.status, 403, "Regular user must be blocked with 403");
    const postData = (await postRes.json()) as any;
    assert.equal(postData.code, "FORBIDDEN_ADMIN_ONLY");

    // PUT /api/products/:id
    const putRes = await fetch(`${baseUrl}/api/products/prod_123`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
        Cookie: cookie,
        "x-user-email": "normal.customer@gmail.com",
      },
      body: JSON.stringify({ price: 1 }),
    });
    assert.equal(putRes.status, 403, "PUT product must be blocked with 403");

    // DELETE /api/products/:id
    const delRes = await fetch(`${baseUrl}/api/products/prod_123`, {
      method: "DELETE",
      headers: {
        "X-CSRF-Token": csrfToken,
        Cookie: cookie,
      },
    });
    assert.equal(delRes.status, 403, "DELETE product must be blocked with 403");
  });

  test("3. Unauthorized user cannot mutate blogs or tutorials", async () => {
    const { csrfToken, cookie } = await getValidCsrf();

    const blogRes = await fetch(`${baseUrl}/api/blogs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
        Cookie: cookie,
        "x-user-email": "attacker@gmail.com",
      },
      body: JSON.stringify({ title: "Spam Post" }),
    });
    assert.equal(blogRes.status, 403, "Blog creation must require admin privileges");

    const tutRes = await fetch(`${baseUrl}/api/tutorials`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
        Cookie: cookie,
      },
      body: JSON.stringify({ title: "Spam Tutorial" }),
    });
    assert.equal(tutRes.status, 403, "Tutorial creation must require admin privileges");
  });

  test("4. User isolation on orders: user only receives their own orders", async () => {
    // Seed two orders for two different users into inMemoryStore
    inMemoryStore.addOrder({
      id: "ord_user_a",
      trackingId: "SYN-USRA-123",
      userId: "user_a_id",
      customer: { email: "usera@example.com", name: "User Alpha" },
      total: 1500,
      status: "Processing",
      items: [{ productId: "p1", name: "Item A", price: 1500, quantity: 1 }],
    });
    inMemoryStore.addOrder({
      id: "ord_user_b",
      trackingId: "SYN-USRB-456",
      userId: "user_b_id",
      customer: { email: "userb@example.com", name: "User Beta" },
      total: 3000,
      status: "Delivered",
      items: [{ productId: "p2", name: "Item B", price: 3000, quantity: 1 }],
    });

    // 1. Unauthenticated guest querying /api/orders receives empty list
    const anonRes = await fetch(`${baseUrl}/api/orders`);
    const anonData = (await anonRes.json()) as any;
    assert.equal(anonRes.status, 200);
    assert.deepEqual(anonData.orders, [], "Anonymous visitor must not see all orders");

    // 2. User A authenticated via x-user-id only gets user A orders
    const userARes = await fetch(`${baseUrl}/api/orders`, {
      headers: {
        "x-user-id": "user_a_id",
        "x-user-email": "usera@example.com",
      },
    });
    const userAData = (await userARes.json()) as any;
    assert.equal(userARes.status, 200);
    assert.ok(userAData.orders.length > 0);
    assert.ok(userAData.orders.every((o: any) => o.userId === "user_a_id" || o.customer?.email === "usera@example.com"));
    assert.ok(!userAData.orders.some((o: any) => o.userId === "user_b_id"), "User A must NOT see User B orders");

    // 3. User A attempting broken access control by adding query param ?userId=user_b_id is constrained to User A
    const spoofRes = await fetch(`${baseUrl}/api/orders?userId=user_b_id`, {
      headers: {
        "x-user-id": "user_a_id",
        "x-user-email": "usera@example.com",
      },
    });
    const spoofData = (await spoofRes.json()) as any;
    assert.ok(!spoofData.orders.some((o: any) => o.userId === "user_b_id"), "Cannot view another user's orders via query parameter");

    // 4. Admin querying /api/orders can view ledger
    const adminEmails = getAdminEmails();
    const adminRes = await fetch(`${baseUrl}/api/orders`, {
      headers: {
        "x-user-email": adminEmails[0],
      },
    });
    const adminData = (await adminRes.json()) as any;
    assert.ok(adminData.orders.length >= 2, "Admin can view orders across users");
  });

  test("5. User isolation on addresses: user cannot access other user's addresses", async () => {
    // User A trying to access User B's addresses
    const res = await fetch(`${baseUrl}/api/addresses/user_b_id`, {
      headers: {
        "x-user-id": "user_a_id",
        "x-user-email": "usera@example.com",
      },
    });
    assert.equal(res.status, 403, "Access to another user's addresses must be blocked with 403");
  });
});
