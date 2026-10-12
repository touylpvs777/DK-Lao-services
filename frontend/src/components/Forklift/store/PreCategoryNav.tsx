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
    <div className="w-full bg-white dark:bg-slate-900/90 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm backdrop-blur-xl mb-5">
      {/* Top Header Label */}
      <div className="flex items-center justify-between px-1 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            {isLao ? "ສາຍງານທຸລະກິດ (Business Divisions)" : "Business Divisions"}
          </span>
        </div>
        <span className="text-[11px] font-medium text-slate-400">
          {isLao ? "ເລືອກເພື່ອຈັດໝວດໝູ່ດ່ວນ" : "Quick filter by division"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {navItems.map((item) => {
          const isSelected = selectedPreCategory === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onSelectPreCategory(item.id)}
              className={`group relative min-w-0 flex items-center justify-between p-3 rounded-xl transition-all duration-200 text-left cursor-pointer border ${
                isSelected
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-md shadow-blue-600/20 ring-2 ring-blue-500/30"
                  : "bg-slate-50/70 hover:bg-white dark:bg-slate-800/50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200/70 dark:border-slate-700/60 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Icon Bubble */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                    isSelected
                      ? "bg-white/20 text-white shadow-inner"
                      : "bg-white dark:bg-slate-700/80 text-blue-600 dark:text-blue-400 border border-slate-200/80 dark:border-slate-600 shadow-xs"
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                </div>

                {/* Title */}
                <div className="flex flex-col min-w-0">
                  <span className={`text-xs font-bold truncate leading-tight ${isSelected ? "text-white" : "text-slate-800 dark:text-slate-100"}`}>
                    {item.name}
                  </span>
                  <span className={`text-[10px] mt-0.5 truncate ${isSelected ? "text-blue-100" : "text-slate-400 dark:text-slate-400"}`}>
                    {item.badge}
                  </span>
                </div>
              </div>

              {/* Count Badge */}
              <div className="shrink-0 pl-2">
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-slate-200/70 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-600 dark:group-hover:bg-blue-900/30 dark:group-hover:text-blue-300"
                  }`}
                >
                  {item.count}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

