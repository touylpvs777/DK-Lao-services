import { INITIAL_CATALOG } from '@/data/catalog'
import { STORE_CATEGORIES, type StoreCategory } from '@/data/categories'

const normalize = (value: string) => value.trim().toLocaleLowerCase().replace(/\s+/g, ' ')

const categoryByName = new Map(
  STORE_CATEGORIES.map((category) => [normalize(category.name), category]),
)

const catalogCategoryBySku = new Map(
  INITIAL_CATALOG
    .filter((item) => item.sku_code && item.category)
    .map((item) => [normalize(item.sku_code), item.category]),
)

export function resolveStoreCategory(item: { sku_code?: string; category?: string }): StoreCategory | undefined {
  if (item.category) {
    const directMatch = categoryByName.get(normalize(item.category))
    if (directMatch) return directMatch
  }

  const catalogCategory = item.sku_code ? catalogCategoryBySku.get(normalize(item.sku_code)) : undefined
  return catalogCategory ? categoryByName.get(normalize(catalogCategory)) : undefined
}