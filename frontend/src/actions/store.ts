import { getProducts } from "@/api/catalog";
import { INITIAL_CATALOG, RENTAL_CATALOG } from "@/data/catalog";
import type { InventoryItem } from "@/data/catalog";
import type { Product, ProductListParams } from "@/types/catalog";

export type { InventoryItem };

const PAGE_SIZE = 100;
const PAGE_BATCH_SIZE = 4;

const normalizeSku = (sku: string) => sku.trim().toLocaleLowerCase();

const INITIAL_CATALOG_BY_SKU = new Map(
  INITIAL_CATALOG.map((item) => [normalizeSku(item.sku_code), item]),
);

const RENTAL_CATALOG_BY_SKU = new Map(
  RENTAL_CATALOG.map((item) => [normalizeSku(item.sku_code), item]),
);

async function fetchAllProducts(filters: Omit<ProductListParams, "page" | "page_size">): Promise<Product[]> {
  const firstPage = await getProducts({ ...filters, page: 1, page_size: PAGE_SIZE });
  const products = [...firstPage.data.items];

  for (let firstPageInBatch = 2; firstPageInBatch <= firstPage.data.pages; firstPageInBatch += PAGE_BATCH_SIZE) {
    const lastPageInBatch = Math.min(firstPageInBatch + PAGE_BATCH_SIZE - 1, firstPage.data.pages);
    const pageNumbers = Array.from(
      { length: lastPageInBatch - firstPageInBatch + 1 },
      (_, index) => firstPageInBatch + index,
    );
    const pageResponses = await Promise.all(
      pageNumbers.map((page) => getProducts({ ...filters, page, page_size: PAGE_SIZE })),
    );
    pageResponses.forEach((response) => products.push(...response.data.items));
  }

  return products;
}

function mapProductToInventoryItem(
  product: Product,
  catalogItem: InventoryItem | undefined,
  defaultQuantity: number,
  defaultPrice: number,
): InventoryItem {
  const apiCategory = product.category?.name_en;

  return {
    ...catalogItem,
    sku_id: product.id.toString(),
    sku_code: product.sku,
    barcode: catalogItem?.barcode ?? null,
    part_name: product.name_en,
    part_name_lo: product.name_lo || catalogItem?.part_name_lo || product.name_en,
    category: apiCategory && apiCategory !== "General" ? apiCategory : catalogItem?.category || "General",
    description: catalogItem?.description || "Premium industrial equipment from DK Lao Trading",
    description_lo: catalogItem?.description_lo,
    qty_on_hand: catalogItem?.qty_on_hand ?? defaultQuantity,
    unit_price: catalogItem?.unit_price || defaultPrice,
    image_url: product.primary_image_url || catalogItem?.image_url,
    currency: catalogItem?.currency || "LAK",
    brand: product.brand?.name || catalogItem?.brand,
    pre_category_id: catalogItem?.pre_category_id,
    sub_category: catalogItem?.sub_category,
  };
}

export async function fetchInventory(): Promise<InventoryItem[]> {
  try {
    const products = await fetchAllProducts({ is_active: true });
    if (products.length > 0) {
      return products.map((product) => mapProductToInventoryItem(
        product,
        INITIAL_CATALOG_BY_SKU.get(normalizeSku(product.sku)),
        5,
        15000000,
      ));
    }
  } catch (error) {
    console.error("Failed to fetch complete product catalog, falling back to mock:", error);
  }
  return INITIAL_CATALOG;
}

export async function fetchRentals(): Promise<InventoryItem[]> {
  try {
    const products = await fetchAllProducts({ is_rental: true, is_active: true });
    if (products.length > 0) {
      return products.map((product) => mapProductToInventoryItem(
        product,
        RENTAL_CATALOG_BY_SKU.get(normalizeSku(product.sku)),
        2,
        5000000,
      ));
    }
  } catch (error) {
    console.error("Failed to fetch complete rental catalog, falling back to mock:", error);
  }
  return RENTAL_CATALOG;
}
