"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { placeOrder } from "@/actions/order";
import type { OrderResult } from "@/actions/order";
import {
  X,
  QrCode,
  Building2,
  Truck,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  AlertCircle,
  FileText,
  PhoneCall,
  MapPin,
  User,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLocale } from "@/lib/locale";

export function CheckoutModal() {
  const isLao = useLocale() === "lo";
  const {
    items,
    isCheckoutOpen,
    closeCheckout,
    clearCart,
    totalUSD,
    totalLAK,
  } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [province, setProvince] = useState("ນະຄອນຫຼວງວຽງຈັນ");
  const [paymentMethod, setPaymentMethod] = useState<"BCEL_ONE_QR" | "BANK_TRANSFER" | "CASH_ON_DELIVERY" | "B2B_PO">("BCEL_ONE_QR");
  const [notes, setNotes] = useState("");
  
  // B2B Tax Invoice fields
  const [taxCompanyName, setTaxCompanyName] = useState("");
  const [taxId, setTaxId] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Restore saved customer info from localStorage for maximum convenience
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("lud_customer_info");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name) setCustomerName(parsed.name);
        if (parsed.phone) setPhoneNumber(parsed.phone);
        if (parsed.address) setDeliveryAddress(parsed.address);
        if (parsed.province) setProvince(parsed.province);
        if (parsed.taxCompany) setTaxCompanyName(parsed.taxCompany);
        if (parsed.taxId) setTaxId(parsed.taxId);
      }
    } catch (e) {
      console.warn("Failed to restore customer info", e);
    }
  }, []);

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phoneNumber || !deliveryAddress) {
      alert(isLao ? "ກະລຸນາປ້ອນຂໍ້ມູນ: ຊື່, ເບີໂທ ແລະ ທີ່ຢູ່ຈັດສົ່ງໃຫ້ຄົບຖ້ວນ" : "Please enter your name, phone number, and delivery address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await placeOrder({
        customer_name: customerName,
        phone_number: phoneNumber,
        delivery_address: deliveryAddress,
        province: province,
        notes: notes,
        items: items.map((i) => ({
          sku_id: i.sku_id,
          sku_code: i.sku_code,
          part_name: i.part_name,
          unit_price: i.unit_price,
          quantity: i.quantity,
          subtotal: i.unit_price * i.quantity,
        })),
        total_usd: totalUSD,
        total_lak: totalLAK,
        tax_company_name: taxCompanyName,
        tax_id: taxId,
      });

      if (result.success) {
        setOrderResult(result);
        clearCart();
        try {
          localStorage.setItem("lud_customer_info", JSON.stringify({
            name: customerName,
            phone: phoneNumber,
            address: deliveryAddress,
            province: province,
            taxCompany: taxCompanyName,
            taxId: taxId,
          }));
        } catch (e) {
          console.warn("Failed to persist customer info", e);
        }
      } else {
        alert(result.message || (isLao ? "ເກີດຂໍ້ຜິດພາດໃນການສົ່ງຄຳຮ້ອງຂໍ" : "There was a problem submitting your request."));
      }
    } catch (err: any) {
      alert(err?.message || (isLao ? "ບໍ່ສາມາດສົ່ງຄຳຮ້ອງຂໍໄດ້" : "Unable to submit your request."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (orderResult) {
      setOrderResult(null);
      setCustomerName("");
      setPhoneNumber("");
      setDeliveryAddress("");
      setNotes("");
    }
    closeCheckout();
  };

  if (!isCheckoutOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-3xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 text-slate-100 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/80">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              {orderResult ? (isLao ? "ຮັບຄຳຮ້ອງຂໍແລ້ວ" : "Request received") : (isLao ? "ສົ່ງຄຳຂໍລາຄາ" : "Submit order request")}
            </h2>
            <p className="text-xs text-slate-400">
              {orderResult
                ? (isLao ? "CRM ໄດ້ຮັບຄຳຮ້ອງຂໍແລ້ວ" : "CRM has received your request")
                : (isLao ? "ສົ່ງຄຳຂໍໃຫ້ທີມງານຢືນຢັນລາຄາ ແລະ ສະຕັອກ" : "Send your request for price and stock confirmation")}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {orderResult ? (
            /* Order Success View */
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-white">{isLao ? "ຄຳຮ້ອງຂໍຂອງທ່ານຖືກບັນທຶກແລ້ວ" : "Your request has been recorded"}</h3>
                <p className="text-sm text-slate-300 mt-1 max-w-md mx-auto">
                  {isLao ? "ຄຳຮ້ອງຂໍຖືກບັນທຶກໃນ CRM ແລ້ວ. ທີມງານຈະກວດສອບລາຄາ, ສະຕັອກ ແລະ ເງື່ອນໄຂຈັດສົ່ງກ່ອນຢືນຢັນຄຳສັ່ງ." : "Your request has been saved in CRM. Our team will review pricing, stock, and delivery terms before confirming the order."}
                </p>
              </div>

              {/* Order Slip Card */}
              <div className="bg-slate-950/70 border border-emerald-500/30 rounded-xl p-5 text-left max-w-lg mx-auto space-y-3 font-mono text-xs">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-slate-400">{isLao ? "ເລກອ້າງອີງ CRM:" : "CRM reference:"}</span>
                  <span className="font-bold text-emerald-400 text-sm">{orderResult.order_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{isLao ? "ລູກຄ້າ:" : "Customer:"}</span>
                  <span className="text-slate-200">{orderResult.data?.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{isLao ? "ເບີໂທຕິດຕໍ່:" : "Phone:"}</span>
                  <span className="text-slate-200">{orderResult.data?.phone}</span>
                </div>
                <div className="border-t border-white/10 pt-2 flex justify-between items-baseline">
                  <span className="text-slate-400">{isLao ? "ຍອດປະເມີນ (LAK):" : "Estimated total (LAK):"}</span>
                  <div className="text-right">
                    <span className="text-base font-bold text-emerald-400">
                      {orderResult.data?.totalLAK?.toLocaleString()} ₭
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-2.5 justify-center max-w-xl mx-auto pt-2">
                <Button
                  onClick={handleClose}
                  variant="outline"
                  className="border-white/10 hover:bg-white/10 text-slate-200 rounded-xl px-5"
                >
                  {isLao ? "ສຳເລັດ" : "Done"}
                </Button>
              </div>
            </div>
          ) : (
            /* Checkout Form View */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Top Summary Bar */}
              <div className="flex flex-wrap items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-white/10 gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">{isLao ? `ລາຍການທັງໝົດ (${items.length})` : `Order items (${items.length})`}</div>
                    <div className="text-lg font-black text-emerald-400">
                      {totalLAK.toLocaleString()} ₭
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      {isLao ? "*ລາຄາລວມເປັນຄ່າອ້າງອີງ ແລະ ອາດມີຄ່າດຳເນີນການ" : "*The displayed total is an estimate and may include processing costs."}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" /> {isLao ? "ຮັບປະກັນສິນຄ້າແທ້ 100%" : "100% genuine products"}
                </div>
              </div>

              {/* Pre-Order Delivery Notice Banner */}
              <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200 flex items-center gap-2.5">
                <Truck className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <div>
                  <span className="font-bold text-white">{isLao ? "ໝາຍເຫດສິນຄ້າສັ່ງລ່ວງໜ້າ: " : "Pre-order notice: "}</span>
                  <span>{isLao ? "ທີມງານຈະກວດສອບລາຄາ ແລະ ສະຕັອກກ່ອນຢືນຢັນໄລຍະນຳເຂົ້າ ແລະ ການຈັດສົ່ງ." : "Our team will confirm pricing and stock before confirming import and delivery timelines."}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {/* Left Column: Customer Information */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-400" /> {isLao ? "1. ຂໍ້ມູນຜູ້ຮັບ ແລະ ສະຖານທີ່ຈັດສົ່ງ" : "1. Customer and delivery details"}
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        {isLao ? "ຊື່ ແລະ ນາມສະກຸນ *" : "Customer name *"}
                      </label>
                      <Input
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder={isLao ? "ເຊັ່ນ: ທ້າວ ສົມສັກ ວົງໄຊ" : "e.g. Som Xay"}
                        className="bg-slate-950/60 border-white/10 text-white placeholder:text-slate-500 focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        {isLao ? "ເບີໂທລະສັບ / WhatsApp *" : "Phone number / WhatsApp *"}
                      </label>
                      <Input
                        required
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder={isLao ? "ເຊັ່ນ: 020 5555 9999" : "e.g. +856 20 5555 9999"}
                        className="bg-slate-950/60 border-white/10 text-white placeholder:text-slate-500 focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        {isLao ? "ແຂວງ" : "Province"}
                      </label>
                      <select
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        className="w-full h-9 rounded-md bg-slate-950/60 border border-white/10 px-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                      >
                        <option value="ນະຄອນຫຼວງວຽງຈັນ">{isLao ? "ນະຄອນຫຼວງວຽງຈັນ" : "Vientiane Capital"}</option>
                        <option value="ແຂວງວຽງຈັນ">{isLao ? "ແຂວງວຽງຈັນ" : "Vientiane Province"}</option>
                        <option value="ແຂວງຫຼວງພະບາງ">{isLao ? "ແຂວງຫຼວງພະບາງ" : "Luang Prabang"}</option>
                        <option value="ແຂວງສະຫວັນນະເຂດ">{isLao ? "ແຂວງສະຫວັນນະເຂດ" : "Savannakhet"}</option>
                        <option value="ແຂວງຈຳປາສັກ">{isLao ? "ແຂວງຈຳປາສັກ" : "Champasak"}</option>
                        <option value="ແຂວງຄຳມ່ວນ">{isLao ? "ແຂວງຄຳມ່ວນ" : "Khammouane"}</option>
                        <option value="ແຂວງບໍລິຄຳໄຊ">{isLao ? "ແຂວງບໍລິຄຳໄຊ" : "Bolikhamxai"}</option>
                        <option value="ແຂວງອື່ນໆ">{isLao ? "ແຂວງອື່ນໆ" : "Other province"}</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        {isLao ? "ທີ່ຢູ່ຈັດສົ່ງລະອຽດ (ບ້ານ, ເມືອງ, ຈຸດສັງເກດ) *" : "Full delivery address (village, district, landmark) *"}
                      </label>
                      <Textarea
                        required
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder={isLao ? "ເຊັ່ນ: ບ້ານດົງປ່າລານ, ເມືອງສີສັດຕະນາກ..." : "Street, district, city, and nearby landmark"}
                        rows={2}
                        className="bg-slate-950/60 border-white/10 text-white placeholder:text-slate-500 focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        {isLao ? "ໝາຍເຫດເພີ່ມເຕີມ (ບໍ່ບັງຄັບ)" : "Additional notes (optional)"}
                      </label>
                      <Input
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder={isLao ? "ເຊັ່ນ: ຕ້ອງການໃບກຳກັບພາສີ, ສົ່ງດ່ວນຕອນເຊົ້າ" : "e.g. Tax invoice needed, morning delivery preferred"}
                        className="bg-slate-950/60 border-white/10 text-white placeholder:text-slate-500 focus:border-emerald-500"
                      />
                    </div>

                    {/* B2B Tax Invoice Fields */}
                    <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2 mt-4">
                      <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" /> {isLao ? "ໃບກຳກັບພາສີ (ທາງເລືອກສຳລັບ B2B)" : "VAT invoice (optional for B2B)"}
                      </div>
                      <Input
                        value={taxCompanyName}
                        onChange={(e) => setTaxCompanyName(e.target.value)}
                        placeholder={isLao ? "ຊື່ບໍລິສັດ / ຫ້ອງການ" : "Company name"}
                        className="bg-slate-950/60 border-amber-500/20 text-white placeholder:text-slate-500 focus:border-amber-400 text-xs h-9"
                      />
                      <Input
                        value={taxId}
                        onChange={(e) => setTaxId(e.target.value)}
                        placeholder={isLao ? "ເລກປະຈຳຕົວຜູ້ເສຍພາສີ" : "Tax ID"}
                        className="bg-slate-950/60 border-amber-500/20 text-white placeholder:text-slate-500 focus:border-amber-400 text-xs h-9"
                      />
                    </div>
                  </div>
                </div>

                <div role="note" className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm leading-relaxed text-amber-100">
                  <strong className="block text-amber-300">{isSubmitting ? (isLao ? "ກຳລັງສົ່ງຄຳຂໍ" : "Sending request") : (isLao ? "ນີ້ແມ່ນຄຳຂໍລາຄາ, ຍັງບໍ່ແມ່ນຄຳສັ່ງຊື້ທີ່ຢືນຢັນ ແລະ ບໍ່ມີການຊຳລະເງິນ" : "This is a quote request, not a confirmed order. No payment will be taken now.")}</strong>
                  <span className="mt-1 block">{isLao ? "ລາຄາທີ່ສະແດງເປັນຄ່າອ້າງອີງ. ທີມງານຈະກວດສະຕັອກ ແລະ ຢືນຢັນລາຄາກ່ອນສ້າງ Order ໃນ CRM." : "Displayed prices are estimates. Our team will check stock and confirm pricing before creating an order in CRM."}</span>
                </div>

                {/* Payment details stay hidden until CRM payment processing is connected. */}
                <div className="hidden" aria-hidden="true">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-400" /> 2. ເລືອກວິທີຊຳລະທີ່ຕ້ອງການ
                  </h3>

                  {/* Payment Tabs */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("BCEL_ONE_QR")}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-semibold ${
                        paymentMethod === "BCEL_ONE_QR"
                          ? "border-emerald-500 bg-emerald-500/15 text-emerald-400 shadow-md shadow-emerald-500/10"
                          : "border-white/10 bg-slate-950/40 text-slate-400 hover:text-white"
                      }`}
                    >
                      <QrCode className="w-5 h-5" />
                      <span>BCEL One QR</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("BANK_TRANSFER")}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-semibold ${
                        paymentMethod === "BANK_TRANSFER"
                          ? "border-emerald-500 bg-emerald-500/15 text-emerald-400 shadow-md shadow-emerald-500/10"
                          : "border-white/10 bg-slate-950/40 text-slate-400 hover:text-white"
                      }`}
                    >
                      <Building2 className="w-5 h-5" />
                      <span>ໂອນຜ່ານບັນຊີ</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("CASH_ON_DELIVERY")}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-semibold ${
                        paymentMethod === "CASH_ON_DELIVERY"
                          ? "border-emerald-500 bg-emerald-500/15 text-emerald-400 shadow-md shadow-emerald-500/10"
                          : "border-white/10 bg-slate-950/40 text-slate-400 hover:text-white"
                      }`}
                    >
                      <Truck className="w-5 h-5" />
                      <span>ເກັບເງິນປາຍທາງ</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("B2B_PO")}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-semibold ${
                        paymentMethod === "B2B_PO"
                          ? "border-emerald-500 bg-emerald-500/15 text-emerald-400 shadow-md shadow-emerald-500/10"
                          : "border-white/10 bg-slate-950/40 text-slate-400 hover:text-white"
                      }`}
                    >
                      <FileText className="w-5 h-5" />
                      <span className="text-center leading-tight">ຂໍໃບສະເໜີລາຄາ<br/>(B2B PO)</span>
                    </button>
                  </div>

                  <p role="note" className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs leading-relaxed text-amber-200">
                    ນີ້ແມ່ນການເລືອກວິທີຊຳລະເບື້ອງຕົ້ນເທົ່ານັ້ນ. ກະລຸນາຢ່າຊຳລະເງິນກ່ອນທີມງານຢືນຢັນລາຄາ, ສະຕັອກ ແລະຄຳຮ້ອງຂໍ.
                  </p>

                  {/* Payment Details Container */}
                  <div className="hidden">
                    {paymentMethod === "BCEL_ONE_QR" && (
                        <div className="space-y-3">
                          {/* BCEL One QR Panel */}
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-200">BCEL One QuickPay (QR Code)</span>
                            <span className="text-xs font-mono font-bold text-amber-400">{totalLAK.toLocaleString()} ₭</span>
                          </div>

                          {/* QR Placeholder box */}
                          <div className="p-4 bg-white rounded-xl flex flex-col items-center justify-center shadow-inner">
                            <div className="w-40 h-40 bg-slate-100 border-2 border-dashed border-red-400 rounded-lg flex flex-col items-center justify-center p-2 relative">
                              <div className="absolute top-2 left-2 text-[10px] font-black text-red-600">BCEL One</div>
                              <QrCode className="w-24 h-24 text-slate-800" />
                              <div className="text-[9px] font-bold text-slate-600 mt-1 text-center">LUD TRADING CO., LTD</div>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-2 font-medium">
                              ສະແກນ QR ຜ່ານ BCEL One App — ຊຳລະ {totalLAK.toLocaleString()} ₭
                            </p>
                          </div>

                          {/* Account copy info */}
                          <div className="p-2.5 rounded-lg bg-slate-900 border border-red-500/20 text-xs space-y-1">
                            <div className="text-slate-400 font-semibold">ຊື່ບັນຊີ (QR TargetAccount):</div>
                            <div className="flex justify-between items-center">
                              <span className="font-mono text-emerald-400">
                                {/* [UPDATE BEFORE LAUNCH: insert real BCEL QR merchant ID here] */}
                                DK LAO TRADING CO., LTD
                              </span>
                              <button type="button" onClick={() => handleCopy("DK LAO TRADING CO., LTD", "bcel_qr_name")} className="text-slate-400 hover:text-white">
                                {copiedField === "bcel_qr_name" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>
                          </div>

                        </div>
                    )}

                    {paymentMethod === "BANK_TRANSFER" && (
                      <div className="space-y-3 text-xs">
                        <div className="font-bold text-slate-200 border-b border-white/10 pb-1.5">
                          ບັນຊີທະນາຄານທາງການ (Official Bank Accounts):
                        </div>

                        {/* BCEL Account */}
                        <div className="p-3 rounded-lg bg-slate-900 border border-red-500/20 space-y-1.5">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-red-400">🏦 BCEL — ທະນາຄານການຄ້າຕ່າງປະເທດລາວ</span>
                            <button type="button" onClick={() => handleCopy("[UPDATE BEFORE LAUNCH: BCEL LAK Account No]", "bcel_lak")} className="flex items-center gap-1 text-slate-400 hover:text-white">
                              {copiedField === "bcel_lak" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />} Copy
                            </button>
                          </div>
                          <div className="text-slate-300">ຊື່ບັນຊີ: <span className="font-semibold text-white">DK LAO TRADING &amp; LUD CO., LTD</span></div>
                          <div className="font-mono text-emerald-400">ເລກ (LAK): [UPDATE BEFORE LAUNCH: BCEL LAK Account No]</div>
                          <div className="font-mono text-sky-400">ເລກ (USD): [UPDATE BEFORE LAUNCH: BCEL USD Account No]</div>
                        </div>

                        {/* LDB Account */}
                        <div className="p-3 rounded-lg bg-slate-900 border border-blue-500/20 space-y-1.5">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-blue-400">🏦 LDB — ທະນາຄານພັດທະນາລາວ</span>
                            <button type="button" onClick={() => handleCopy("[UPDATE BEFORE LAUNCH: LDB Account No]", "ldb_lak")} className="flex items-center gap-1 text-slate-400 hover:text-white">
                              {copiedField === "ldb_lak" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />} Copy
                            </button>
                          </div>
                          <div className="text-slate-300">ຊື່ບັນຊີ: <span className="font-semibold text-white">DK LAO TRADING &amp; LUD CO., LTD</span></div>
                          <div className="font-mono text-emerald-400">ເລກ (LAK): [UPDATE BEFORE LAUNCH: LDB Account No]</div>
                        </div>

                        <div className="text-[11px] text-slate-500 border-t border-white/5 pt-2">
                          ⚠️ ກະລຸນາອັປໂຫຼດ Slip ຫຼື Screenshot ຼໍງການໂອນທະນາຄານຫຼັງຈາກກົດແກ່ Submit ເພື່ອຍືນຍັນການຊຳລະໃຫ້ເພີ່ມປະສິດທິພາບ
                        </div>
                      </div>
                    )}

                    {paymentMethod === "CASH_ON_DELIVERY" && (
                      <div className="space-y-3 text-xs text-slate-300">
                        <div className="flex items-center gap-2 text-emerald-400 font-bold">
                          <Truck className="w-4 h-4" /> ບໍລິການເກັບເງິນປາຍທາງ (COD)
                        </div>
                        <p className="text-slate-400">
                          ທ່ານສາມາດກວດສອບສິນຄ້າເມື່ອເຄື່ອງຈັດສົ່ງຮອດ ແລະ ຊຳລະເງິນສົດ ຫຼື ໂອນເງິນຜ່ານ QR ກັບພະນັກງານສົ່ງເຄື່ອງໄດ້ທັນທີ.
                        </p>
                        <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <span>ສະເພາະເຂດນະຄອນຫຼວງວຽງຈັນ ແລະ ຕົວເມືອງໃຫຍ່</span>
                        </div>
                        
                        {/* Call to confirm COD order */}
                        <a
                          href="tel:+8562058929299"
                          className="flex items-center justify-center gap-2 w-full py-2.5 mt-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-400 font-bold text-xs transition-colors"
                        >
                          <PhoneCall className="w-4 h-4" /> ໂທຢືນຢັນເງື່ອນໄຂ COD ກັບທີມຂາຍ
                        </a>
                      </div>
                    )}

                    {paymentMethod === "B2B_PO" && (
                      <div className="space-y-3 text-xs text-slate-300">
                        <div className="flex items-center gap-2 text-emerald-400 font-bold">
                          <FileText className="w-4 h-4" /> ຂໍໃບສະເໜີລາຄາສຳລັບອົງກອນ (B2B PO / Quotation)
                        </div>
                        <p className="text-slate-400 leading-relaxed">
                          ລະບົບຈະບໍ່ເກັບເງິນທ່ານໃນຕອນນີ້. ແທນທີ່ຈະເປັນການສັ່ງຊື້, ເຮົາຈະອອກ <span className="text-white font-bold">ໃບສະເໜີລາຄາ (Quotation)</span> ແລະ ສົ່ງໃຫ້ພະແນກຈັດຊື້ຂອງທ່ານພາຍໃນ 15 ນາທີ ເພື່ອດຳເນີນການອອກ PO ຕາມລະບຽບການຂອງບໍລິສັດ.
                        </p>
                        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                          <span>ຮອງຮັບເຄຣດິດເທອມ (Credit Term 30-90 ວັນ) ສຳລັບລູກຄ້າສັນຍາປະຈຳ</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleClose}
                  className="text-slate-400 hover:text-white"
                >
                  {isLao ? "ຍົກເລີກ" : "Cancel"}
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 px-8 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/25 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <span>{isLao ? "ກຳລັງສົ່ງຄຳຂໍ..." : "Submitting request..."}</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{isLao ? "ສົ່ງຄຳຮ້ອງຂໍໃຫ້ CRM" : "Send request to CRM"}</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </motion.div>

    </div>
  );
}
