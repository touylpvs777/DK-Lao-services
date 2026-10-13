"use server";

import type { InventoryItem } from "@/data/catalog";
import { getCRMApiBaseUrl } from "@/lib/crm-inquiries";
export type { InventoryItem };

export type CatalogFetchResult = {
  items: InventoryItem[];
  connected: boolean;
};

type CRMSparePart = {
  sku_code: string;
  name: string;
  description?: string | null;
  category: string;
  brand?: string | null;
  unit: string;
  unit_price: number;
  currency: string;
  image_url?: string | null;
  available_to_order: boolean;
  lead_time_days: number;
};

type CRMSparePartPage = {
  items: CRMSparePart[];
  total: number;
  skip: number;
  limit: number;
};

const PAGE_SIZE = 500;
const SUPPORTED_CURRENCIES = new Set(["LAK", "THB", "USD"]);

function toInventoryItem(item: CRMSparePart, crmBaseUrl: string): InventoryItem | null {
  if (!SUPPORTED_CURRENCIES.has(item.currency) || !item.sku_code) return null;
  let imageUrl = item.image_url || undefined;
  if (imageUrl?.startsWith("/")) {
    const origin = new URL(crmBaseUrl).origin;
    imageUrl = `${origin}${imageUrl}`;
  }
  return {
    sku_id: `crm-${item.sku_code}`,
    sku_code: item.sku_code,
    barcode: null,
    part_name: item.name,
    category: item.category,
    description: item.description || undefined,
    image_url: imageUrl,
    // Requests are verified by CRM staff; exact warehouse quantities stay private.
    qty_on_hand: 0,
    max_order_quantity: 99,
    unit_price: Number(item.unit_price),
    currency: item.currency as InventoryItem["currency"],
    lead_time: item.lead_time_days > 0 ? `${item.lead_time_days} days` : "Contact for availability",
    pre_category_id: "spare-parts-consumables",
    brand: item.brand || undefined,
    crm_catalog_item: true,
    available_to_order: item.available_to_order,
  };
}

export async function fetchInventory(
  skip = 0,
  limit = PAGE_SIZE,
): Promise<CatalogFetchResult> {
  const apiBaseUrl = getCRMApiBaseUrl();
  const integrationToken = process.env.CRM_STOREFRONT_TOKEN;
  if (!apiBaseUrl || !integrationToken) return { items: [], connected: false };

  try {
    const items: InventoryItem[] = [];
    let pageSkip = skip;
    const requestedLimit = Math.min(Math.max(limit, 1), PAGE_SIZE);
    let total = Number.POSITIVE_INFINITY;
    const stopAt = skip === 0 ? Number.POSITIVE_INFINITY : skip + limit;

    while (pageSkip < total) {
      const response = await fetch(
        `${apiBaseUrl}/storefront/catalog?skip=${pageSkip}&limit=${requestedLimit}`,
        {
          headers: { "X-Storefront-Token": integrationToken },
          cache: "no-store",
          signal: AbortSignal.timeout(15_000),
        },
      );
      if (!response.ok) return { items: [], connected: false };

      const page = (await response.json()) as CRMSparePartPage;
      if (!Array.isArray(page.items)) return { items: [], connected: false };
      total = Number(page.total) || 0;
      items.push(
        ...page.items
          .map((item) => toInventoryItem(item, apiBaseUrl))
          .filter((item): item is InventoryItem => item !== null),
      );
      pageSkip += page.items.length;
      if (page.items.length === 0 || pageSkip >= stopAt) break;
    }

    return { items, connected: true };
  } catch {
    return { items: [], connected: false };
  }
}

export async function fetchRentals(): Promise<InventoryItem[]> {
  // Rental prices and bookable availability are managed through CRM contracts,
  // not the spare-parts stock catalog. Clients request a rental quote instead.
  return [];
}
