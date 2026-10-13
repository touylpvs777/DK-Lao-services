import React from "react";
import { Layers, RotateCcw, ChevronRight } from "lucide-react";
import { useCurrentLocale } from "@/i18n/useCurrentLocale";
import { STORE_CATEGORIES, PRE_CATEGORIES } from "@/data/categories";
import { resolveStoreCategory } from "./categoryResolver";

interface StoreSidebarProps {
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
  selectedPreCategory?: string;
  onResetFilters?: () => void;
  hasActiveFilters?: boolean;
  items?: Array<{ category?: string; pre_category_id?: string; sku_code?: string }>;
}

export function StoreSidebar({
  selectedCategory = "All",
  onSelectCategory = () => {},
  selectedPreCategory = "all",
  onResetFilters = () => {},
  hasActiveFilters = false,
  items = [],
}: StoreSidebarProps) {
  const locale = useCurrentLocale();
  const isLao = locale.toLowerCase().startsWith("lo");

  const activePreCat = React.useMemo(() => {
    return PRE_CATEGORIES.find((p) => p.id === selectedPreCategory);
  }, [selectedPreCategory]);

  // Compute product counts for each category
  const categoryCounts = React.useMemo(() => {
    const counts: Record<number, number> = {};
    items.forEach((item) => {
      const category = resolveStoreCategory(item);
      if (category) counts[category.id] = (counts[category.id] || 0) + 1;
    });
    return counts;
  }, [items]);

  // Filter categories according to selectedPreCategory
  const visibleCategories = React.useMemo(() => {
    let list = STORE_CATEGORIES;
    if (selectedPreCategory && selectedPreCategory !== "all") {
      list = STORE_CATEGORIES.filter((c) => c.pre_category_id === selectedPreCategory);
    }
    return list;
  }, [selectedPreCategory]);

  return (
    <aside className="w-full lg:w-64 shrink-0 flex flex-col bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
      {/* 1. Category Header with Division Badge */}
      <div className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-800/80 dark:to-slate-900 px-4 py-3.5 flex flex-col gap-1.5 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>{isLao ? "ໝວດໝູ່ສິນຄ້າ" : "Categories"}</span>
          </h2>
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="text-[11px] font-bold text-rose-500 hover:text-rose-600 dark:text-rose-400 flex items-center gap-1 transition-colors cursor-pointer px-2 py-0.5 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/40"
              title={isLao ? "ລ້າງຕົວກັ່ນຕອງທັງໝົດ" : "Reset all filters"}
            >
              <RotateCcw className="w-3 h-3" />
              <span>{isLao ? "ລ້າງ" : "Reset"}</span>
            </button>
          )}
        </div>
        {activePreCat && (
          <div className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 truncate bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md border border-blue-100 dark:border-blue-800/50">
            {isLao ? activePreCat.name_lo : activePreCat.name}
          </div>
        )}
      </div>

      {/* 2. Main Categories List */}
      <div className="flex flex-col max-h-[560px] overflow-y-auto scrollbar-thin p-1.5 space-y-0.5">
        {/* 'All' Option */}
        <button
          onClick={() => onSelectCategory("All")}
          className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
            selectedCategory === "All"
              ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20"
              : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400"
          }`}
        >
          <div className="flex items-center gap-2.5 truncate">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
              selectedCategory === "All"
                ? "bg-white/20 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200/80 dark:border-slate-700"
            }`}>
              <Layers className="w-3.5 h-3.5" />
            </div>
            <span className="truncate">{isLao ? "ທຸກໝວດໝູ່ (All Categories)" : "All Categories"}</span>
          </div>
          <ChevronRight className={`h-3.5 w-3.5 shrink-0 transition-transform ${selectedCategory === "All" ? "text-white translate-x-0.5" : "text-slate-300 dark:text-slate-600 group-hover:text-blue-500"}`} />
        </button>

        {/* Dynamic Categories */}
        {visibleCategories.map((cat) => {
          const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
          const count = categoryCounts[cat.id] || 0;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.name)}
              className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                isSelected
                  ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              <div className="flex items-center gap-2.5 truncate min-w-0">
                <div className={`w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center shrink-0 border ${
                  isSelected
                    ? "bg-white border-white/40"
                    : "bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700 shadow-2xs"
                }`}>
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-contain p-0.5"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-xs font-semibold leading-tight">{isLao ? cat.name_lo : cat.name}</span>
                  {cat.brand && (
                    <span className={`text-[10px] truncate leading-tight ${isSelected ? "text-blue-100" : "text-slate-400"}`}>{cat.brand}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 pl-1.5">
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isSelected
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                }`}>
                  {count}
                </span>
                <ChevronRight className={`h-3.5 w-3.5 transition-transform ${isSelected ? "text-white translate-x-0.5" : "text-slate-300 dark:text-slate-600 group-hover:text-blue-500"}`} />
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

