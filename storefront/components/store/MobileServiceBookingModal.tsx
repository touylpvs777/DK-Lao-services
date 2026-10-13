"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Wrench, CheckCircle2, ShieldCheck, MapPin, Calendar, Smartphone, ArrowRight, Sparkles, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/locale";

interface MobileServiceBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CHECKLIST_24_POINTS = [
  { group: "1. ເຄື່ອງຈັກ & ລະບົບຂັບເຄື່ອນ", items: ["ລະດັບນ້ຳມັນເຄື່ອງ & ຄວາມໜຽວ", "ລະບົບນ້ຳຫຼໍ່ເຢັນ & ໝໍ້ນ້ຳ", "ສາຍພານໜ້າເຄື່ອງ & ລູກຮອກ", "ລະບົບສາຍໄຟ & ໄດຊາດ/ໄດສະຕາດ"] },
  { group: "2. ລະບົບໄຮໂດຣລິກ & ຍົກສິນຄ້າ", items: ["ລະດັບນ້ຳມັນໄຮໂດຣລິກ & ຊີລກະບອກ", "ສາຍໄຮໂດຣລິກ & ຂໍ້ຕໍ່ກັນຮົ່ວ", "ໂສ້ຍົກ & ລູກປືນເສົາ Mast", "ວາວຄວບຄຸມ Control Valve"] },
  { group: "3. ລະບົບເບຣກ & ຊ່ວງລາງ", items: ["ຄວາມໜາຜ້າເບຣກ & ແມ່ປັ້ມເບຣກ", "ນ້ຳມັນເບຣກ & ສາຍອ່ອນເບຣກ", "ດຸມລໍ້ & ລູກປືນຄອມ້າຫຼັງ", "ສະພາບດອກຢາງຕັນ & ຮອຍແຕກ"] },
  { group: "4. ລະບົບຄວາມປອດໄພ & ໄຟສັນຍານ", items: ["ໄຟໜ້າ, ໄຟຫຼັງ, ໄຟລ້ຽວ, ໄຟກະພິບ", "ສຽງແກ & ສຽງຖອຍຫຼັງ", "ສາຍຮັດນິລະໄພ & ສະວິດເກົ້າອີ້", "ລະບົບຕັດໄຟສຸກເສີນ Emergency Cut-off"] }
];

const CHECKLIST_24_POINTS_EN = [
  { group: "1. Engine and drivetrain", items: ["Engine oil level and viscosity", "Coolant system and radiator", "Drive belts and pulleys", "Wiring, alternator, and starter"] },
  { group: "2. Hydraulics and lifting", items: ["Hydraulic oil level and cylinder seals", "Hydraulic hoses and leak-free fittings", "Lift chains and mast bearings", "Control valve"] },
  { group: "3. Brakes and running gear", items: ["Brake pad thickness and master cylinder", "Brake fluid and flexible brake hoses", "Wheel hubs and rear axle bearings", "Solid tire tread and cracks"] },
  { group: "4. Safety and warning lights", items: ["Headlights, tail lights, turn signals, and beacons", "Horn and reverse alarm", "Seat belt and seat switch", "Emergency power cut-off"] },
];

const PROVINCES = [
  { lo: "ນະຄອນຫຼວງວຽງຈັນ", en: "Vientiane Capital" },
  { lo: "ແຂວງວຽງຈັນ", en: "Vientiane Province" },
  { lo: "ສະຫວັນນະເຂດ", en: "Savannakhet" },
  { lo: "ຈຳປາສັກ", en: "Champasak / Pakse" },
  { lo: "ຄຳມ່ວນ", en: "Khammouane / Thakhek" },
  { lo: "ຫຼວງພະບາງ", en: "Luang Prabang" },
  { lo: "ບໍລິຄຳໄຊ", en: "Bolikhamxay" },
  { lo: "ໄຊຍະບູລີ", en: "Xayaburi" },
  { lo: "ອື່ນໆ", en: "Other province" }
];

export function MobileServiceBookingModal({ isOpen, onClose }: MobileServiceBookingModalProps) {
  const isLao = useLocale() === "lo";
  const [vehicleType, setVehicleType] = useState<string>("forklift_diesel");
  const [province, setProvince] = useState<string>(PROVINCES[0].lo);
  const [factoryName, setFactoryName] = useState<string>("");
  const [contactPhone, setContactPhone] = useState<string>("");
  const [urgency, setUrgency] = useState<"standard_pm" | "emergency_breakdown">("standard_pm");
  const [notes, setNotes] = useState<string>("");

  const handleBookViaWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();

    const vehicleLabel =
      vehicleType === "forklift_diesel" ? (isLao ? "ລົດຍົກດີເຊວ" : "Diesel forklift") :
      vehicleType === "forklift_electric" ? (isLao ? "ລົດຍົກໄຟຟ້າ / Reach Truck" : "Electric forklift / reach truck") :
      vehicleType === "light_ev" ? (isLao ? "ລົດກະບະ / ລົດໄຟຟ້າ EV" : "Pickup / electric vehicle") : (isLao ? "ເຄື່ອງຈັກໜັກ" : "Heavy machinery");

    const urgencyLabel = urgency === "emergency_breakdown"
      ? (isLao ? "🚨 ສຸກເສີນ ລົດເສຍຢຸດແລ່ນ" : "🚨 Emergency breakdown")
      : (isLao ? "🛠️ ກວດເຊັກ PM 24 ຈຸດຕາມກຳນົດ" : "🛠️ Scheduled 24-point PM");

    const message = isLao
      ? `ສະບາຍດີ DK Lao / LUD! ຂ້ອຍຕ້ອງການນັດໝາຍທີມຊ່າງ Mobile Service ໄປກວດເຊັກທີ່ໂຮງງານ:\n\n📌 ປະເພດການຮຽກຮ້ອງ: ${urgencyLabel}\n🚜 ປະເພດລົດ: ${vehicleLabel}\n🏢 ຊື່ໂຮງງານ/ບໍລິສັດ: ${factoryName || "ບໍ່ໄດ້ລະບຸ"}\n📍 ສະຖານທີ່/ແຂວງ: ${province}\n📞 ເບີໂທຕິດຕໍ່: ${contactPhone || "ກະລຸນາຕິດຕໍ່ກັບຜ່ານເບີນີ້"}\n📝 ລາຍລະອຽດ: ${notes || "ກວດເຊັກທົ່ວໄປ 24 ຈຸດ"}`
      : `Hello DK Lao / LUD, I would like to book an on-site mobile service visit.\n\n📌 Request type: ${urgencyLabel}\n🚜 Vehicle: ${vehicleLabel}\n🏢 Factory/company: ${factoryName || "Not provided"}\n📍 Location/province: ${PROVINCES.find((item) => item.lo === province)?.en || province}\n📞 Contact phone: ${contactPhone || "Please call me at this number"}\n📝 Details: ${notes || "General 24-point inspection"}`;

    window.open(`https://wa.me/8562058929299?text=${encodeURIComponent(message)}`, "_blank");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden z-10 my-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-white/10 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-lg shadow-inner">
                  🛠️
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{isLao ? "ບໍລິການກວດເຊັກ 24 ຈຸດ & ຊ່າງເຄື່ອນທີ່ເຖິງໂຮງງານ" : "24-point inspection and on-site mobile service"}</span>
                    <span className="text-[10px] uppercase tracking-wider bg-amber-500 text-white font-bold px-2 py-0.5 rounded-full">
                      {isLao ? "ບໍລິການໜ້າງານ" : "On-site service"}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isLao ? "ທີມວິສະວະກອນພ້ອມລົດເຄື່ອນທີ່ ບໍລິການກວດເຊັກ, ປ່ຽນອາໄຫຼ່ ແລະ PM ທົ່ວປະເທດລາວ" : "Our mobile engineering team provides inspections, parts replacement, and preventive maintenance across Laos."}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleBookViaWhatsApp} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto scrollbar-thin">
              {/* 24-Points Checklist Overview Box */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>{isLao ? "ລາຍການກວດເຊັກ OEM 24 ຈຸດ" : "24-point OEM inspection checklist"}</span>
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    {isLao ? "ຟຣີໃບລາຍງານສະພາບລົດ" : "Free vehicle health report"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {CHECKLIST_24_POINTS.map((group, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-white/5 space-y-1.5">
                      <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                        {isLao ? group.group : CHECKLIST_24_POINTS_EN[idx].group}
                      </div>
                      <ul className="space-y-0.5">
                        {group.items.map((item, i) => (
                          <li key={i} className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                            <span>{isLao ? item : CHECKLIST_24_POINTS_EN[idx].items[i]}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Booking Fields */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Urgency Type */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {isLao ? "ປະເພດການຮຽກຮ້ອງ:" : "Request type:"}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setUrgency("standard_pm")}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                          urgency === "standard_pm"
                            ? "bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400 shadow-sm"
                            : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/5"
                        }`}
                      >
                        {isLao ? "🛠️ ກວດເຊັກ PM ຕາມຮອບ" : "🛠️ Scheduled PM inspection"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setUrgency("emergency_breakdown")}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                          urgency === "emergency_breakdown"
                            ? "bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400 shadow-sm"
                            : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/5"
                        }`}
                      >
                        {isLao ? "🚨 ສຸກເສີນ ລົດເສຍ" : "🚨 Emergency breakdown"}
                      </button>
                    </div>
                  </div>

                  {/* Vehicle Type */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {isLao ? "ປະເພດລົດ / ເຄື່ອງຈັກ:" : "Vehicle / equipment type:"}
                    </label>
                    <select
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="forklift_diesel">{isLao ? "ລົດຍົກດີເຊວ (1.5 - 5.0 ໂຕນ)" : "Diesel forklift (1.5 - 5.0 ton)"}</option>
                      <option value="forklift_electric">{isLao ? "ລົດຍົກໄຟຟ້າ / Reach Truck" : "Electric forklift / reach truck"}</option>
                      <option value="light_ev">{isLao ? "ລົດກະບະ / ລົດໄຟຟ້າ EV" : "Pickup / electric vehicle"}</option>
                      <option value="heavy_machinery">{isLao ? "ເຄື່ອງຈັກໜັກ / ລົດຕັກ / ລົດຂຸດ" : "Heavy machinery / loader / excavator"}</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Factory / Company Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {isLao ? "ຊື່ໂຮງງານ / ບໍລິສັດ:" : "Factory / company name:"}
                    </label>
                    <input
                      type="text"
                      value={factoryName}
                      onChange={(e) => setFactoryName(e.target.value)}
                      placeholder={isLao ? "ຕົວຢ່າງ: ໂຮງງານເບຍລາວ, ບໍ່ແຮ່ພູເບ້ຍ..." : "e.g. Lao Brewery, Phu Bia Mining"}
                      className="w-full h-10 px-3.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Province */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {isLao ? "ສະຖານທີ່ / ແຂວງ:" : "Location / province:"}
                    </label>
                    <select
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    >
                      {PROVINCES.map((p) => (
                        <option key={p.lo} value={p.lo}>{isLao ? p.lo : p.en}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {isLao ? "ອາການຜິດປົກກະຕິ ຫຼື ອາໄຫຼ່ທີ່ຕ້ອງການໃຫ້ກຽມມານຳ:" : "Issues or parts to prepare:"}
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={isLao ? "ຕົວຢ່າງ: ລົດຍົກສະຕາດຕິດຍາກ, ປ້ຳໄຮໂດຣລິກມີສຽງດັງ..." : "e.g. Hard starting, noisy hydraulic pump, prepare 2.5-ton solid tires"}
                    className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/10">
                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{isLao ? "ຕອບກັບ ແລະ ຈັດຄິວຊ່າງພາຍໃນ 15 ນາທີ" : "We respond and schedule a technician within 15 minutes"}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="rounded-xl h-10 text-xs font-bold"
                  >
                    {isLao ? "ຍົກເລີກ" : "Cancel"}
                  </Button>
                  <Button
                    type="submit"
                    className="rounded-xl h-10 text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-500/25 flex items-center gap-2"
                  >
                    <span>{isLao ? "ນັດໝາຍຊ່າງຜ່ານ WhatsApp" : "Book a technician via WhatsApp"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
