import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import type { Server } from "node:http";
import app from "../app.js";
import {
  generateCsrfToken,
  validateCsrfToken,
  CSRF_COOKIE_NAME,
  CSRF_HEADER_NAME,
  getCsrfSecret,
} from "../lib/csrf.js";

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

function parseSetCookie(header: string | null): { name: string; value: string; flags: string[] } | null {
  if (!header) return null;
  const parts = header.split(";").map((p) => p.trim());
  const [first, ...flags] = parts;
  const idx = first.indexOf("=");
  if (idx === -1) return null;
  return {
    name: first.slice(0, idx).trim(),
    value: first.slice(idx + 1).trim(),
    flags,
  };
}

describe("CSRF Protection Security Suite", () => {
  test("1. Token endpoint returns a valid token and sets HttpOnly cookie", async () => {
    const res = await fetch(`${baseUrl}/api/csrf-token`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    assert.equal(res.status, 200, "Token endpoint should return HTTP 200");
    const data = (await res.json()) as any;
    assert.equal(data.success, true);
    assert.ok(typeof data.csrfToken === "string" && data.csrfToken.length === 64, "Token should be 64-hex char random string");

    const setCookie = res.headers.get("set-cookie");
    assert.ok(setCookie, "Response must include Set-Cookie header");
    const cookieParsed = parseSetCookie(setCookie);
    assert.ok(cookieParsed, "Cookie must parse successfully");
    assert.equal(cookieParsed.name, CSRF_COOKIE_NAME);
    assert.ok(
      cookieParsed.flags.some((f) => f.toLowerCase() === "httponly"),
      "CSRF cookie must have HttpOnly flag"
    );
    assert.ok(
      cookieParsed.flags.some((f) => f.toLowerCase().startsWith("samesite")),
      "CSRF cookie must specify SameSite"
    );
  });

  test("2. Protected state-changing request without a token is rejected with 403", async () => {
    const res = await fetch(`${baseUrl}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [] }),
    });

    assert.equal(res.status, 403, "Request without token should return HTTP 403");
    const data = (await res.json()) as any;
    assert.equal(data.error, "Invalid CSRF token");
    assert.equal(data.code, "MISSING_HEADER");
  });

  test("3. Protected request with an invalid/tampered token is rejected with 403", async () => {
    // Acquire a legitimate cookie
    const tokenRes = await fetch(`${baseUrl}/api/csrf-token`);
    const setCookie = tokenRes.headers.get("set-cookie");
    const cookieParsed = parseSetCookie(setCookie);
    assert.ok(cookieParsed);

    // Send request with mismatched/bogus token
    const res = await fetch(`${baseUrl}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        [CSRF_HEADER_NAME]: "0000000000000000000000000000000000000000000000000000000000000000",
        Cookie: `${CSRF_COOKIE_NAME}=${cookieParsed.value}`,
      },
      body: JSON.stringify({ items: [] }),
    });

    assert.equal(res.status, 403, "Request with invalid token must return HTTP 403");
    const data = (await res.json()) as any;
    assert.equal(data.error, "Invalid CSRF token");
    assert.equal(data.code, "TOKEN_MISMATCH");
  });

  test("4. Protected request with a valid token and cookie succeeds or passes CSRF", async () => {
    // 1. Obtain token & cookie
    const tokenRes = await fetch(`${baseUrl}/api/csrf-token`);
    const { csrfToken } = (await tokenRes.json()) as any;
    const setCookie = tokenRes.headers.get("set-cookie");
    const cookieParsed = parseSetCookie(setCookie);
    assert.ok(cookieParsed);

    // 2. Send state-changing POST request
    const res = await fetch(`${baseUrl}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        [CSRF_HEADER_NAME]: csrfToken,
        Cookie: `${CSRF_COOKIE_NAME}=${cookieParsed.value}`,
      },
      body: JSON.stringify({
        customerName: "Test Buyer",
        email: "test-buyer@synergy.com",
        items: [],
      }),
    });

    // It should pass CSRF validation (status is either 201 Created or normal business logic response, but NOT 403 CSRF rejection)
    assert.notEqual(res.status, 403, "Valid CSRF token must not be rejected with 403");
  });

  test("5. Token with mismatched session/user context is rejected with 403", async () => {
    // Generate a token explicitly bound to "user_alice"
    const { rawToken, cookieValue } = generateCsrfToken("user_alice");

    // Attempt to make a request acting as "user_bob"
    const res = await fetch(`${baseUrl}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        [CSRF_HEADER_NAME]: rawToken,
        Cookie: `${CSRF_COOKIE_NAME}=${cookieValue}`,
        "x-user-id": "user_bob",
      },
      body: JSON.stringify({ items: [] }),
    });

    assert.equal(res.status, 403, "Context mismatch must return HTTP 403");
    const data = (await res.json()) as any;
    assert.equal(data.code, "CONTEXT_MISMATCH");
  });

  test("6. Sign in and logout lifecycle works with CSRF tokens", async () => {
    // 1. Get initial token
    const tokenRes = await fetch(`${baseUrl}/api/csrf-token`);
    const { csrfToken } = (await tokenRes.json()) as any;
    const setCookie = tokenRes.headers.get("set-cookie");
    const cookieParsed = parseSetCookie(setCookie);
    assert.ok(cookieParsed);

    // 2. Sign in with standard demo credentials
    const signinRes = await fetch(`${baseUrl}/api/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        [CSRF_HEADER_NAME]: csrfToken,
        Cookie: `${CSRF_COOKIE_NAME}=${cookieParsed.value}`,
      },
      body: JSON.stringify({
        email: "demo@synergy.com",
        password: "Password123",
      }),
    });

    assert.equal(signinRes.status, 200, "Sign in should succeed");
    const signinData = (await signinRes.json()) as any;
    assert.equal(signinData.success, true);
    assert.ok(signinData.csrfToken, "Sign in should issue a fresh user-bound CSRF token");

    const signinCookie = signinRes.headers.get("set-cookie");
    assert.ok(signinCookie, "Sign in should update the CSRF cookie");
    const signinCookieParsed = parseSetCookie(signinCookie);
    assert.ok(signinCookieParsed);

    // 3. Logout with the user's token
    const logoutRes = await fetch(`${baseUrl}/api/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        [CSRF_HEADER_NAME]: signinData.csrfToken,
        Cookie: `${CSRF_COOKIE_NAME}=${signinCookieParsed.value}`,
      },
    });

    assert.equal(logoutRes.status, 200, "Logout should succeed");
    const logoutData = (await logoutRes.json()) as any;
    assert.equal(logoutData.success, true);
    assert.ok(logoutData.csrfToken, "Logout should provide a fresh anonymous token");
  });

  test("7. Expired CSRF token is rejected with HTTP 403", async () => {
    // Generate a token timestamped 48 hours in the past
    const fortyEightHoursAgo = Date.now() - 48 * 60 * 60 * 1000;
    const { rawToken, cookieValue } = generateCsrfToken("anon", fortyEightHoursAgo);

    const res = await fetch(`${baseUrl}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        [CSRF_HEADER_NAME]: rawToken,
        Cookie: `${CSRF_COOKIE_NAME}=${cookieValue}`,
      },
      body: JSON.stringify({ items: [] }),
    });

    assert.equal(res.status, 403, "Expired token must return HTTP 403");
    const data = (await res.json()) as any;
    assert.equal(data.code, "EXPIRED");
  });

  test("8. Allowed frontend origins succeed", async () => {
    const tokenRes = await fetch(`${baseUrl}/api/csrf-token`);
    const { csrfToken } = (await tokenRes.json()) as any;
    const setCookie = tokenRes.headers.get("set-cookie");
    const cookieParsed = parseSetCookie(setCookie);
    assert.ok(cookieParsed);

    // Send with allowed Origin: http://localhost:5173
    const res = await fetch(`${baseUrl}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "http://localhost:5173",
        [CSRF_HEADER_NAME]: csrfToken,
        Cookie: `${CSRF_COOKIE_NAME}=${cookieParsed.value}`,
      },
      body: JSON.stringify({ items: [] }),
    });

    assert.notEqual(res.status, 403, "Allowed origin must not be rejected with 403");
  });

  test("9. Untrusted origin is rejected according to configured policy", async () => {
    const tokenRes = await fetch(`${baseUrl}/api/csrf-token`);
    const { csrfToken } = (await tokenRes.json()) as any;
    const setCookie = tokenRes.headers.get("set-cookie");
    const cookieParsed = parseSetCookie(setCookie);
    assert.ok(cookieParsed);

    // Send with hostile origin
    const res = await fetch(`${baseUrl}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://attacker-malicious-site.com",
        [CSRF_HEADER_NAME]: csrfToken,
        Cookie: `${CSRF_COOKIE_NAME}=${cookieParsed.value}`,
      },
      body: JSON.stringify({ items: [] }),
    });

    assert.equal(res.status, 403, "Untrusted origin must return HTTP 403");
    const data = (await res.json()) as any;
    assert.equal(data.code, "UNTRUSTED_ORIGIN");
  });

  test("10. Safe read-only methods (GET, HEAD, OPTIONS) pass without token", async () => {
    const getRes = await fetch(`${baseUrl}/api/products`);
    assert.notEqual(getRes.status, 403, "GET requests should never require CSRF token");

    const headRes = await fetch(`${baseUrl}/api/products`, { method: "HEAD" });
    assert.notEqual(headRes.status, 403, "HEAD requests should never require CSRF token");

    const optionsRes = await fetch(`${baseUrl}/api/orders`, { method: "OPTIONS" });
    assert.notEqual(optionsRes.status, 403, "OPTIONS preflight should not require CSRF token");
  });

  test("11. Programmatic / unit validateCsrfToken handles edge cases safely", () => {
    // Missing inputs
    assert.equal(validateCsrfToken("", "").valid, false);
    assert.equal(validateCsrfToken("token", "").valid, false);
    assert.equal(validateCsrfToken("", "cookie").valid, false);

    // Malformed cookie (not 4 parts)
    assert.equal(validateCsrfToken("token", "part1.part2").valid, false);

    // Tampered signature
    const { rawToken, cookieValue } = generateCsrfToken();
    const tamperedCookie = cookieValue.slice(0, -5) + "abcde";
    assert.equal(validateCsrfToken(rawToken, tamperedCookie).valid, false);
  });

  test("12. No CSRF secret or sensitive session keys are leaked in responses", async () => {
    const serverSecret = getCsrfSecret();
    assert.ok(serverSecret.length >= 16);

    const res = await fetch(`${baseUrl}/api/csrf-token`);
    const text = await res.text();

    assert.ok(!text.includes(serverSecret), "Response must NEVER contain the server CSRF secret");
    assert.ok(!text.includes("signature"), "Response must not leak cryptographic signature keys");
  });
});
