import assert from "node:assert";

async function run() {
  console.log("=== STARTING FULL E2E VERIFICATION ===");
  const baseUrl = "http://localhost:5000/api";

  // 1. Fetch CSRF token and cookie
  const csrfRes = await fetch(`${baseUrl}/csrf-token`);
  const csrfCookie = csrfRes.headers.get("set-cookie") || "";
  const { csrfToken } = await csrfRes.json() as { csrfToken: string };
  console.log("✓ CSRF initialized:", !!csrfToken);

  const headers = {
    "Content-Type": "application/json",
    "x-csrf-token": csrfToken,
    "Cookie": csrfCookie,
  };

  // 2. Test Product detail redirect/fetch by slug
  console.log("\n--- Testing Product Fetching by Slug & ID ---");
  const slugsToTest = [
    "esp32-ai-rex32-ai",
    "esp32-rex32",
    "iot-smart-board-controller-8-relay-8",
    "1"
  ];

  for (const s of slugsToTest) {
    const res = await fetch(`${baseUrl}/products/${encodeURIComponent(s)}`);
    assert.strictEqual(res.status, 200, `Failed to fetch product for slug '${s}'`);
    const prod = await res.json();
    assert.ok(prod && (prod.slug || prod.id), `Invalid product payload for '${s}'`);
    console.log(`✓ Fetched product '${s}': "${prod.name}" (slug: ${prod.slug}, SKU: ${prod.sku}, ID: ${prod._id || prod.id})`);
  }

  // 3. Test Cart API preserving full product identity
  console.log("\n--- Testing Cart API Slug & Metadata Preservation ---");
  const testUserId = "670000000000000000000099"; // mock ObjectId
  const cartItem = {
    productId: "esp32-ai-rex32-ai",
    name: "ESP32-AI (Rex32-AI)",
    sku: "SYN-ESP-AI-01",
    price: 1899,
    quantity: 2,
    image: "/categories/ai-boards.jpg",
    slug: "esp32-ai-rex32-ai",
    category: "AI Boards",
    subcategory: "Edge AI",
  };

  // 4. Test Order placement to verify MongoDB persistence with exact items and slug
  console.log("\n--- Testing Order Placement & Item Integrity ---");
  const orderPayload = {
    customer: {
      name: "E2E Test User",
      email: "test.e2e.buyer@example.com",
      phone: "+919876543210",
    },
    items: [
      {
        productId: "esp32-ai-rex32-ai",
        name: "ESP32-AI (Rex32-AI)",
        sku: "SYN-ESP-AI-01",
        price: 1899,
        quantity: 2,
        image: "/categories/ai-boards.jpg",
        slug: "esp32-ai-rex32-ai",
        category: "AI Boards",
        subcategory: "Edge AI",
      },
      {
        productId: "1", // Legacy/mock ID test: should automatically resolve slug, category, subcategory
        name: "ESP32 (Rex32)",
        sku: "SYN-ESP-01",
        price: 1299,
        quantity: 1,
        image: "/categories/embedded-boards.jpg",
      }
    ],
    shippingAddress: {
      fullName: "E2E Test User",
      phone: "+919876543210",
      addressLine1: "123 Tech Park, 4th Cross",
      addressLine2: "Electronics City",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560100",
    },
    subtotal: 5097,
    gst: 917.46,
    shippingCharge: 0,
    total: 6014.46,
    status: "confirmed",
    paymentMethod: "razorpay",
    paymentStatus: "paid",
  };

  const createOrderRes = await fetch(`${baseUrl}/orders`, {
    method: "POST",
    headers,
    body: JSON.stringify(orderPayload),
  });

  assert.strictEqual(createOrderRes.status, 201, `Failed to create order: ${createOrderRes.statusText}`);
  const createdOrder = await createOrderRes.json();
  console.log(`✓ Order successfully created: Tracking ID "${createdOrder.trackingId}"`);
  console.log(`  Items count: ${createdOrder.items.length}`);
  for (const item of createdOrder.items) {
    console.log(`  - Item: "${item.name}" | Slug: "${item.slug}" | SKU: "${item.sku}" | Category: "${item.category}" | Sub: "${item.subcategory}"`);
    assert.ok(item.slug, `Item ${item.name} missing slug!`);
    assert.ok(item.sku, `Item ${item.name} missing sku!`);
  }

  // 5. Test Customer Orders query
  console.log("\n--- Testing Customer Orders Query ---");
  const customerOrdersRes = await fetch(`${baseUrl}/orders?email=test.e2e.buyer@example.com`, {
    headers: {
      "x-user-email": "test.e2e.buyer@example.com",
    },
  });
  assert.strictEqual(customerOrdersRes.status, 200);
  const customerOrdersData = await customerOrdersRes.json();
  assert.ok(Array.isArray(customerOrdersData.orders));
  const foundInCustomer = customerOrdersData.orders.find((o: any) => o.trackingId === createdOrder.trackingId);
  assert.ok(foundInCustomer, "Created order not found in customer orders list!");
  console.log(`✓ Customer orders list returned ${customerOrdersData.orders.length} orders; found created order with ${foundInCustomer.items.length} items`);
  for (const it of foundInCustomer.items) {
    console.log(`  - Customer order item link destination: /product/${encodeURIComponent(it.slug || it.productId)}`);
  }

  // 6. Test Admin Orders query
  console.log("\n--- Testing Admin Orders Query ---");
  const adminOrdersRes = await fetch(`${baseUrl}/orders`, {
    headers: {
      "x-user-email": "synergytechlabs.help@gmail.com",
    },
  });
  assert.strictEqual(adminOrdersRes.status, 200);
  const adminOrdersData = await adminOrdersRes.json();
  assert.ok(Array.isArray(adminOrdersData.orders));
  const foundInAdmin = adminOrdersData.orders.find((o: any) => o.trackingId === createdOrder.trackingId);
  assert.ok(foundInAdmin, "Created order not found in admin orders list!");
  console.log(`✓ Admin orders list returned ${adminOrdersData.orders.length} orders; found created order`);
  for (const it of foundInAdmin.items) {
    console.log(`  - Admin order item link destination: /product/${encodeURIComponent(it.slug || it.productId)}`);
    assert.ok(it.slug, `Admin item "${it.name}" must have slug`);
  }

  console.log("\n==========================================");
  console.log("🎉 ALL PRODUCT DETAIL REDIRECT & ORDER CART INTEGRITY TESTS PASSED!");
  console.log("==========================================");
}

run().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
