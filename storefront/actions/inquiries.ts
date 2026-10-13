"use server";

import { sendWebsiteInquiry } from "@/lib/crm-inquiries";
import type { WebsiteInquiryInput } from "@/lib/crm-inquiries";

export async function submitWebsiteInquiry(input: WebsiteInquiryInput) {
  return sendWebsiteInquiry(input);
}
