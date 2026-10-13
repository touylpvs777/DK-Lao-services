import { NextRequest, NextResponse } from "next/server";
import { getCRMApiBaseUrl } from "@/lib/crm-inquiries";

const COOKIE_NAME = "dk_customer_portal";
const MAX_SESSION_SECONDS = 30 * 60;

export async function POST(request: NextRequest) {
  const apiBaseUrl = getCRMApiBaseUrl();
  if (!apiBaseUrl) {
    return NextResponse.json({ message: "Customer login is not configured." }, { status: 503 });
  }

  let body: { username?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Enter your username and password." }, { status: 400 });
  }
  if (
    typeof body.username !== "string" ||
    typeof body.password !== "string" ||
    body.username.length < 3 ||
    body.password.length < 1
  ) {
    return NextResponse.json({ message: "Enter your username and password." }, { status: 400 });
  }

  try {
    const crmResponse = await fetch(`${apiBaseUrl}/portal/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: body.username, password: body.password }),
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
    if (!crmResponse.ok) {
      const message = crmResponse.status === 401
        ? "Invalid username or password."
        : "Customer login is temporarily unavailable.";
      return NextResponse.json({ message }, { status: crmResponse.status === 401 ? 401 : 503 });
    }

    const result = await crmResponse.json() as { access_token?: string; expires_in?: number };
    if (!result.access_token) {
      return NextResponse.json({ message: "CRM returned an incomplete login response." }, { status: 502 });
    }
    const maxAge = Math.max(1, Math.min(result.expires_in || MAX_SESSION_SECONDS, MAX_SESSION_SECONDS));
    const response = NextResponse.json({ success: true });
    response.cookies.set(COOKIE_NAME, result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/client-portal",
      maxAge,
    });
    return response;
  } catch {
    return NextResponse.json({ message: "CRM is unavailable. Please try again shortly." }, { status: 503 });
  }
}
