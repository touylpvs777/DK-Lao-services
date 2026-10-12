import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchInventory, fetchRentals } from "@/actions/store";
import type { InventoryItem } from "@/actions/store";
import { StoreClient } from "@/components/Forklift/store/StoreClient";
import { CartProvider } from "@/context/CartContext";
import { Sparkles, Package, Wrench, ShieldCheck } from "lucide-react";

export default function ForkliftStorePage() {
  const { i18n } = useTranslation();
  const isLao = (i18n.language || "lo") === "lo";
  
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [rentals, setRentals] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchInventory(), fetchRentals()])
      .then(([inv, ren]) => {
        setInventory(inv);
        setRentals(ren);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-8 text-white shadow-xl animate-pulse">
          <div className="h-7 w-64 bg-white/20 rounded-lg mb-2" />
          <div className="h-4 w-96 bg-white/10 rounded-md" />
        </div>
        <div className="py-24 text-center text-slate-400 font-medium">
          {isLao ? "ກຳລັງໂຫຼດຂໍ້ມູນສິນຄ້າ ແລະ ອຸປະກອນ..." : "Loading catalog and parts..."}
        </div>
      </div>
    );
  }

  return (
    <CartProvider>
      <div className="p-4 md:p-6 max-w-[1440px] mx-auto min-w-0 space-y-5">
        {/* Modern Executive Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#072042] via-[#0b2f61] to-[#04152e] p-6 sm:p-7 text-white shadow-xl shadow-blue-950/20 border border-blue-500/20">
          {/* Subtle Ambient Glow */}
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />
          <div className="absolute right-1/3 -bottom-20 w-64 h-64 rounded-full bg-cyan-400/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-400/10 border border-blue-400/25 text-blue-300 text-xs font-semibold backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>DK Lao Industrial Equipment & Spare Parts Ecosystem</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
                {isLao ? "ລາຍການອາໄຫຼ່ ແລະ ອຸປະກອນອຸດສາຫະກຳ" : "Parts & Industrial Equipment Catalog"}
              </h1>
              <p className="text-sm text-blue-100/80 leading-relaxed font-normal">
                {isLao
                  ? "ສູນລວມລາຍການອາໄຫຼ່ແທ້, ລົດຍົກ, ອຸປະກອນສາງ ແລະ ບໍລິການເຊົ່າ-ສ້ອມແປງຄົບວົງຈອນ ພ້ອມຈັດສົ່ງດ່ວນທົ່ວປະເທດ"
                  : "Comprehensive enterprise catalog for genuine OEM parts, forklift fleet sales, rentals, and certified workshop maintenance."}
              </p>
            </div>

            {/* Quick Stats Badges */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="w-9 h-9 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-300">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-blue-200/70 font-medium">{isLao ? "ສິນຄ້າທັງໝົດ" : "Total Items"}</div>
                  <div className="text-lg font-extrabold text-white">{inventory.length + rentals.length}+</div>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-300">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-cyan-200/70 font-medium">{isLao ? "ມາດຕະຖານແທ້" : "Genuine Parts"}</div>
                  <div className="text-lg font-extrabold text-white">100% OEM</div>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="w-9 h-9 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-300">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-amber-200/70 font-medium">{isLao ? "ຊ່າງ PM ບໍລິການ" : "Mobile Support"}</div>
                  <div className="text-lg font-extrabold text-white">24h Response</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Catalog Store Client */}
        <div className="min-w-0">
          <StoreClient initialItems={inventory} rentalItems={rentals} />
        </div>
      </div>
    </CartProvider>
  );
}

