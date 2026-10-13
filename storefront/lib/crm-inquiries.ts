import "server-only";

export type WebsiteInquiryInput = {
  inquiry_type: "service" | "store_order";
  category: "sale_inquiry" | "rental_b2b" | "standard" | "spare_parts" | "store_order";
  customer_name: string;
  phone_number: string;
  company_name?: string;
  province?: string;
  district?: string;
  delivery_address?: string;
  brand?: string;
  details?: string;
  payment_method?: "BCEL_ONE_QR" | "BANK_TRANSFER" | "CASH_ON_DELIVERY" | "B2B_PO";
  total_usd?: number;
  total_lak?: number;
  slip_reference?: string;
  tax_company_name?: string;
  tax_id?: string;
  notes?: string;
  items?: Array<{
    sku_code: string;
    part_name: string;
    unit_price: number;
    quantity: number;
  }>;
};

export type WebsiteInquiryResult =
  | { success: true; reference_number: string }
  | { success: false; message: string };

export function getCRMApiBaseUrl() {
  const configuredUrl = process.env.CRM_API_URL || process.env.NEXT_PUBLIC_API_URL;
  if (!configuredUrl && process.env.NODE_ENV === "production") return null;

  const baseUrl = (configuredUrl || "http://localhost:8000").replace(/\/+$/, "");
  return baseUrl.endsWith("/api/v1") ? baseUrl : `${baseUrl}/api/v1`;
}

export async function sendWebsiteInquiry(
  input: WebsiteInquiryInput,
): Promise<WebsiteInquiryResult> {
  const apiBaseUrl = getCRMApiBaseUrl();
  const integrationToken = process.env.CRM_STOREFRONT_TOKEN;
  if (!apiBaseUrl || !integrationToken) {
    return { success: false, message: "CRM storefront integration is not configured." };
  }

  try {
    const response = await fetch(`${apiBaseUrl}/leads/website-inquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Storefront-Token": integrationToken,
      },
      body: JSON.stringify(input),
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });

    if (!response.ok) {
      return {
        success: false,
        message: "Could not save your request to CRM. Please try again.",
      };
    }

    const data = (await response.json()) as { reference_number?: string };
    if (!data.reference_number) {
      return { success: false, message: "CRM returned an incomplete confirmation." };
    }
    return { success: true, reference_number: data.reference_number };
  } catch {
    return {
      success: false,
      message: "CRM is unavailable right now. Please try again in a moment.",
    };
  }
}
