"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCart, getApplicablePrice, calculateLAKPrice } from "@/context/CartContext";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useLocale } from "@/lib/locale";

function formatCurrency(amount: number, currency: "THB" | "USD" | "LAK" = "THB") {
  const symbol = currency === "USD" ? "$" : currency === "LAK" ? "₭" : "฿";
  const digits = currency === "LAK" ? 0 : 2;
  return `${symbol}${amount.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
}

export function CartDrawer() {
  const isLao = useLocale() === "lo";
  const {
    items,
    isOpen,
    closeCart,
    openCheckout,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalLAK,
    exchangeRates,
  } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-slate-900/95 text-slate-100 border-l border-white/10 shadow-2xl backdrop-blur-2xl flex flex-col justify-between"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-slate-950/40">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                      {isLao ? "ກະຕ່າສິນຄ້າ" : "Shopping cart"} <span className="text-xs font-normal text-slate-400">({totalItems} {isLao ? "ລາຍການ" : "items"})</span>
                    </h2>
                    <p className="text-xs text-slate-400">{isLao ? "ກະຕ່າສິນຄ້າ ແລະ ສະຫຼຸບຄຳສັ່ງ" : "Shopping cart and order summary"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {items.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="text-xs text-slate-400 hover:text-rose-400 transition-colors px-2 py-1 rounded"
                      title={isLao ? "ລ້າງກະຕ່າທັງໝົດ" : "Clear cart"}
                    >
                      {isLao ? "ລ້າງກະຕ່າ" : "Clear"}
                    </button>
                  )}
                  <button
                    onClick={closeCart}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-slate-800/80 border border-white/10 flex items-center justify-center text-slate-500 mb-4">
                      <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-200">{isLao ? "ກະຕ່າຂອງທ່ານຍັງວ່າງເປົ່າ" : "Your cart is empty"}</h3>
                    <p className="text-sm text-slate-400 mt-1 max-w-xs">
                      {isLao ? "ເລືອກສິນຄ້າອຸດສາຫະກຳ ແລະ ອາໄຫຼ່ເຄື່ອງຈັກໜັກໃສ່ກະຕ່າ ເພື່ອສັ່ງຊື້ໄດ້ທັນທີ" : "Add industrial equipment and heavy machinery parts to your cart to start an order request."}
                    </p>
                    <Button
                      onClick={closeCart}
                      className="mt-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full px-6"
                    >
                      {isLao ? "ເລືອກຊົມສິນຄ້າ" : "Browse catalog"}
                    </Button>
                  </div>
                ) : (
                  <>
                    {items.map((item) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={item.sku_id}
                      className="p-4 rounded-xl bg-slate-800/60 border border-white/10 flex gap-4 items-center hover:border-emerald-500/30 transition-all"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-16 h-16 rounded-lg bg-slate-900/80 border border-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={isLao ? (item.part_name_lo || item.part_name) : item.part_name}
                            fill
                            className="object-cover"
                            sizes="64px"
                            unoptimized={item.crm_catalog_item}
                          />
                        ) : (
                          <ShoppingBag className="w-6 h-6 text-slate-600" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                            {item.sku_code}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.sku_id)}
                            className="text-slate-400 hover:text-rose-400 transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <h4 className="text-sm font-semibold text-slate-100 truncate mt-1">
                          {isLao ? (item.part_name_lo || item.part_name) : item.part_name}
                        </h4>
                        
                        <div className="text-[10px] font-medium text-emerald-400 mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {item.lead_time || (isLao ? "ຢືນຢັນເວລາຈັດສົ່ງກັບ CRM" : "Delivery time confirmed by CRM")}
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div>
                            <div className="text-sm font-bold text-emerald-400">
                              {formatCurrency(getApplicablePrice(item) * item.quantity, item.currency)}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              ≈ {(calculateLAKPrice(getApplicablePrice(item), item.currency, item.category, exchangeRates, !item.crm_catalog_item) * item.quantity).toLocaleString()} ₭
                            </div>
                            {getApplicablePrice(item) < item.unit_price && (
                              <div className="text-[10px] text-amber-400 bg-amber-950/40 px-1 py-0.5 rounded mt-0.5 inline-block">
                                {isLao ? "ໄດ້ລາຄາສົ່ງ" : "Bulk discount"}
                              </div>
                            )}
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-1.5 bg-slate-900/80 border border-white/10 rounded-lg p-1">
                            <button
                              onClick={() => updateQuantity(item.sku_id, item.quantity - 1)}
                              className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold text-white px-2 min-w-[20px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.sku_id, item.quantity + 1)}
                              className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  </>
                )}
              </div>

              {/* Footer / Summary */}
              {items.length > 0 && (
                <div className="p-6 border-t border-white/10 bg-slate-950/60 space-y-4">
                  {/* Total Calculations */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>{isLao ? "ຈຳນວນລວມ:" : "Total items:"}</span>
                      <span className="font-semibold text-slate-200">{totalItems} {isLao ? "ຊິ້ນ" : "items"}</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-sm font-medium text-slate-300">{isLao ? "ຍອດລວມ (LAK):" : "Total (LAK):"}</span>
                      <span className="text-xl font-black text-emerald-400">{totalLAK.toLocaleString()} ₭</span>
                    </div>
                    <div className="rounded-lg bg-slate-900/70 px-3 py-2 text-[11px] text-slate-400">
                      {isLao ? "ນີ້ແມ່ນຄຳຂໍສັ່ງຊື້. CRM ຈະຢືນຢັນລາຄາ, ສະຕັອກ ແລະ ຄ່າຈັດສົ່ງກ່ອນຮັບຄຳສັ່ງ." : "This is an order request. CRM will confirm pricing, stock, and delivery costs before accepting it."}
                    </div>
                  </div>

                  {/* Checkout Buttons */}
                  <div className="space-y-2 pt-1">
                    <Button
                      onClick={openCheckout}
                      className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 group transition-all cursor-pointer"
                    >
                      <span>{isLao ? "ສົ່ງຄຳຂໍໃຫ້ CRM ຢືນຢັນລາຍການ" : "Send request to CRM for confirmation"}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
