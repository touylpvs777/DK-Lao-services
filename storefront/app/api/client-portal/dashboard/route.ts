import { NextRequest, NextResponse } from "next/server";
import { getCRMApiBaseUrl } from "@/lib/crm-inquiries";

const COOKIE_NAME = "dk_customer_portal";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ message: "Please sign in." }, { status: 401 });

  const apiBaseUrl = getCRMApiBaseUrl();
  if (!apiBaseUrl) {
    return NextResponse.json({ message: "Customer portal is not configured." }, { status: 503 });
  }

  try {
    const crmResponse = await fetch(`${apiBaseUrl}/portal/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
    const responseBody = await crmResponse.json().catch(() => ({ message: "CRM returned an invalid response." }));
    const response = NextResponse.json(responseBody, { status: crmResponse.status });
    if (crmResponse.status === 401) {
      response.cookies.set(COOKIE_NAME, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/api/client-portal",
        maxAge: 0,
      });
    }
    return response;
  } catch {
    return NextResponse.json({ message: "CRM is unavailable. Please try again shortly." }, { status: 503 });
  }
}
