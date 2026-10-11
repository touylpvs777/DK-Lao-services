import React from "react";
import { Truck, Archive, SprayCan, Settings, Pickaxe, Layers } from "lucide-react";
import { PRE_CATEGORIES, STORE_CATEGORIES } from "@/data/categories";
import { useTranslation } from "react-i18next";

interface PreCategoryNavProps {
  selectedPreCategory: string;
  onSelectPreCategory: (id: string) => void;
  items?: Array<{ category?: string; pre_category_id?: string }>;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Truck,
  Archive,
  SprayCan,
  Settings,
  Pickaxe,
};

export function PreCategoryNav({
  selectedPreCategory = "all",
  onSelectPreCategory,
  items = [],
}: PreCategoryNavProps) {
  const { i18n } = useTranslation();
  const locale = i18n.language || "lo";
  const isLao = locale === "lo";
  // Compute product counts dynamically per pre-category
  const counts = React.useMemo(() => {
    const map: Record<string, number> = { all: items.length };

    // Build a category -> pre_category_id dictionary
    const catToPreCat: Record<string, string> = {};
    STORE_CATEGORIES.forEach((cat) => {
      catToPreCat[cat.name.toLowerCase()] = cat.pre_category_id;
    });

    items.forEach((item) => {
      let preCatId = item.pre_category_id;
      if (!preCatId && item.category) {
        preCatId = catToPreCat[item.category.toLowerCase()];
      }
      if (preCatId) {
        map[preCatId] = (map[preCatId] || 0) + 1;
      }
    });

    return map;
  }, [items]);

  const navItems = [
    {
      id: "all",
      name: isLao ? "✨ ທຸກສາຍງານ (All Divisions)" : "✨ All Divisions",
      name_lo: "✨ ທຸກສາຍງານ (All Divisions)",
      icon: Layers,
      count: counts["all"] || items.length,
      badge: isLao ? "ລວມສິນຄ້າທັງໝົດ" : "Full Catalog",
      accent: "from-slate-700 to-slate-900 dark:from-slate-600 dark:to-slate-800",
    },
    ...PRE_CATEGORIES.map((p) => ({
      id: p.id,
      name: isLao ? p.name_lo : p.name,
      name_lo: p.name_lo,
      icon: ICON_MAP[p.iconName] || Layers,
      count: counts[p.id] || 0,
      badge: isLao ? p.badge_lo : p.badge_en,
      accent: p.accentColor,
    })),
  ];

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-lg p-3 border border-slate-200 dark:border-slate-700 mb-4">
      {/* Top Header Label */}
      <div className="flex items-center justify-between px-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-600" />
          <span className="text-xs font-bold text-slate-800 dark:text-white">
            {isLao ? "ສາຍງານ" : "Business division"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
        {navItems.map((item) => {
          const isSelected = selectedPreCategory === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onSelectPreCategory(item.id)}
              className={`group min-w-0 flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-left cursor-pointer ${
                isSelected
                  ? "bg-blue-50 text-blue-800 dark:bg-blue-500/10 dark:text-blue-300 border border-blue-300 dark:border-blue-700"
                  : "bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              }`}
            >
              {/* Icon Bubble */}
              <div
                className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${
                  isSelected
                    ? "bg-white/20 text-white"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700"
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              {/* Title & Badge */}
              <div className="flex flex-col pr-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold truncate">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                      isSelected
                        ? "bg-white/20 text-blue-100"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {item.count} {isLao ? "ລາຍການ" : "items"}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

