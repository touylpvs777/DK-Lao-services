import React, { useState, useEffect } from "react";
import { useCurrentLocale } from "@/i18n/useCurrentLocale";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  KeySquare,
  Wrench,
  Settings,
  PackageSearch,
  ArrowRight,
  Globe2,
  Layers,
  LayoutDashboard,
  BookOpen,
  Award,
  Phone,
} from "lucide-react";

import { BookingProvider } from "@/components/Forklift/services/BookingContext";
import { InternalModeProvider } from "@/components/internal/InternalModeContext";
import { ServiceHero } from "@/components/Forklift/services/ServiceHero";
import { ServiceSalePillar } from "@/components/Forklift/services/ServiceSalePillar";
import { ServiceRentalPillar } from "@/components/Forklift/services/ServiceRentalPillar";
import { ServicePMPillar } from "@/components/Forklift/services/ServicePMPillar";
import { ServicePartsPillar } from "@/components/Forklift/services/ServicePartsPillar";
import { ServiceEcosystem } from "@/components/Forklift/services/ServiceEcosystem";
import { ServiceBookingForm } from "@/components/Forklift/services/ServiceBookingForm";
import { ServiceContact } from "@/components/Forklift/services/ServiceContact";
import { ServiceChecklistModal } from "@/components/Forklift/services/ServiceChecklistModal";
import { ServiceCredibilityShowcase } from "@/components/Forklift/services/ServiceCredibilityShowcase";
import { ServiceWorkshopShowcase } from "@/components/Forklift/services/ServiceWorkshopShowcase";
import { FieldStoriesShowcase } from "@/components/Forklift/services/FieldStoriesShowcase";

import { EnterpriseCustomerShowcase } from "@/components/customers/EnterpriseCustomerShowcase";
import { WarehouseAutomationShowcase } from "@/components/Forklift/services/WarehouseAutomationShowcase";
import { MitsubishiForkliftShowcase } from "@/components/Forklift/services/MitsubishiForkliftShowcase";
import { JungheinrichEFGShowcase } from "@/components/Forklift/services/JungheinrichEFGShowcase";
import { RackingAndStorageShowcase } from "@/components/Forklift/services/RackingAndStorageShowcase";
import { NilfiskCleaningShowcase } from "@/components/Forklift/services/NilfiskCleaningShowcase";
import { SERVICES_GOTO_EVENT } from "@/components/Forklift/services/sectionNav";
import { getForkliftText } from "@/i18n/forkliftLocale";

type PillarId = "sale" | "rental" | "service" | "parts" | "ecosystem";
type TabId = "overview" | PillarId | "stories" | "trust" | "partners" | "contact";

// Maps URL hashes (deep links from the homepage / navigation) to a tab.
const HASH_TO_TAB: Record<string, TabId> = {
  "#overview": "overview",
  "#sale": "sale",
  "#rental": "rental",
  "#service": "service",
  "#parts": "parts",
  "#spare-parts": "parts",
  "#ecosystem": "ecosystem",
  "#automation": "ecosystem",
  "#stories": "stories",
  "#trust": "trust",
  "#partners": "partners",
  "#booking-form": "contact",
  "#contact": "contact",
};

export default function ForkliftServicesHubPage() {
  const locale = useCurrentLocale();
  const isLo = locale.toLowerCase().startsWith("lo");
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const pillars = [
    {
      id: "sale",
      label: getForkliftText("1. ຂາຍລົດ (Sale)", "1. Sales"),
      short: getForkliftText("ຂາຍລົດ", "Sales"),
      icon: ShoppingCart,
      desc: getForkliftText("ລົດຟອກລີບໃໝ່ & ມືສອງຍີ່ປຸ່ນ 1.5t – 10t ຮັບປະກັນສູນແທ້", "New & Japan-Reconditioned Forklifts 1.5t - 10t with Warranty"),
      color: "bg-blue-600",
      textColor: "text-blue-600 dark:text-blue-400",
      lightBg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      id: "rental",
      label: getForkliftText("2. ເຊົ່າກອງລົດ (Rental)", "2. Fleet Rental"),
      short: getForkliftText("ເຊົ່າກອງລົດ", "Rental"),
      icon: KeySquare,
      desc: getForkliftText("ເຊົ່າ B2B 1-5 ປີ 0-CAPEX, ຟຣີຊ່າງ PM, ລົດສຳຮອງປ່ຽນທັນທີ", "0-CAPEX 1-5 Year Operating Lease + Free Routine PM & Standby Units"),
      color: "bg-indigo-600",
      textColor: "text-indigo-600 dark:text-indigo-400",
      lightBg: "bg-indigo-50 dark:bg-indigo-900/20",
    },
    {
      id: "service",
      label: getForkliftText("3. ສູນສ້ອມແປງ (Service)", "3. Technical Service"),
      short: getForkliftText("ສູນສ້ອມແປງ", "Service"),
      icon: Wrench,
      desc: getForkliftText("DKwick Mobile 2-4h ລົງໄຊທ໌ດ່ວນ, ກວດເຊັກ 24 ຈຸດ, ສູນ Overhaul ໃຫຍ່", "DKwick 2-4h Mobile Response, Certified 24-Point PM, Central Overhaul Workshop"),
      color: "bg-emerald-600",
      textColor: "text-emerald-600 dark:text-emerald-400",
      lightBg: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
      id: "parts",
      label: getForkliftText("4. ອາໄຫຼ່ OEM (Parts)", "4. OEM Spare Parts"),
      short: getForkliftText("ອາໄຫຼ່ OEM", "Parts"),
      icon: Settings,
      desc: getForkliftText("ສາງສູນກາງ 16,000+ ລາຍການ, ຢາງຕັນ, ແບັດ Li-Ion, ນ້ຳມັນ NSF H1", "16,000+ Genuine OEM Items, Solid Tires, Li-Ion Cells, NSF H1 Food Oils"),
      color: "bg-amber-600",
      textColor: "text-amber-600 dark:text-amber-400",
      lightBg: "bg-amber-50 dark:bg-amber-900/20",
    },
    {
      id: "ecosystem",
      label: getForkliftText("5. ລະບົບສາງ (Intralogistics)", "5. Intralogistics & Racking"),
      short: getForkliftText("ລະບົບສາງ", "Intralogistics"),
      icon: PackageSearch,
      desc: getForkliftText("ຊັ້ນວາງ Racking LPI, ອຸປະກອນອະນາໄມ Nilfisk, ລົດກະເຊົ້າ JLG, 3D CAD", "Heavy-Duty Racking, Nilfisk Scrubbers, JLG MEWPs & Free 3D CAD Layouts"),
      color: "bg-purple-600",
      textColor: "text-purple-600 dark:text-purple-400",
      lightBg: "bg-purple-50 dark:bg-purple-900/20",
    },
  ] as const;

  // Top navigation: one entry per module, only the selected one is rendered.
  const navTabs: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: getForkliftText("ພາບລວມ", "Overview"), icon: LayoutDashboard },
    ...pillars.map((p) => ({ id: p.id as TabId, label: p.short, icon: p.icon })),
    { id: "stories", label: getForkliftText("ເລື່ອງລາວໜ້າງານ", "Field Stories"), icon: BookOpen },
    { id: "trust", label: getForkliftText("ຄວາມໄວ້ວາງໃຈ", "Trust"), icon: Award },
    { id: "partners", label: getForkliftText("ຄູ່ຮ່ວມ", "Partners"), icon: Globe2 },
    { id: "contact", label: getForkliftText("ຈອງ/ຕິດຕໍ່", "Booking"), icon: Phone },
  ];

  const selectTab = (id: TabId) => {
    setActiveTab(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleHash = () => {
      const tab = HASH_TO_TAB[window.location.hash.toLowerCase()];
      if (tab) setActiveTab(tab);
    };
    // In-page CTAs ask for a section by element id; open the tab that owns it.
    const handleGoto = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      const tab = id === "detailed-solutions" ? "sale" : HASH_TO_TAB[`#${id}`];
      if (tab) setActiveTab(tab);
    };
    // Plain <a href="#booking-form"> links: switch tab instead of jumping to a missing anchor.
    const handleAnchorClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.('a[href^="#"]');
      const tab = a && HASH_TO_TAB[a.getAttribute("href")!.toLowerCase()];
      if (tab) {
        e.preventDefault();
        setActiveTab(tab);
        window.setTimeout(() => {
          const id = a.getAttribute("href")!.slice(1);
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 120);
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    window.addEventListener(SERVICES_GOTO_EVENT, handleGoto);
    document.addEventListener("click", handleAnchorClick);
    return () => {
      window.removeEventListener("hashchange", handleHash);
      window.removeEventListener(SERVICES_GOTO_EVENT, handleGoto);
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);

  return (
    <InternalModeProvider><BookingProvider>
      <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors pb-20 overflow-x-clip">
        {/* TOP MODULE NAVIGATION */}
        <div className="sticky top-[var(--topbar-height)] z-30 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-full px-2 sm:px-4">
            <div className="flex overflow-x-auto hide-scrollbar" role="tablist">
              <div className="flex w-full justify-between xl:justify-evenly min-w-max xl:min-w-0">
                {navTabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => selectTab(tab.id)}
                      className={`flex items-center gap-1.5 px-3 py-3.5 text-[13px] font-semibold whitespace-nowrap border-b-[3px] -mb-px transition-colors duration-150 ${
                        isActive
                          ? "text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400"
                          : "text-slate-600 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full min-h-[60vh]"
          >
            {activeTab === "overview" && (
              <>
                <ServiceHero isLo={isLo} />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                  <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/30 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-4">
                      <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>THE 4S HUB ECOSYSTEM</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">
                      {getForkliftText("ລະບົບນິເວດອຸດສາຫະກຳ ແລະ ສາງສິນຄ້າຄົບວົງຈອນ", "Complete Industrial & Warehouse Ecosystem")}
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                      {getForkliftText("ຈາກການຂາຍ-ເຊົ່າລົດຟອກລີບ ໄປຈົນເຖິງການອອກແບບສາງສິນຄ້າອັດຕະໂນມັດ ດີເຄ ລາວ ຄືຜູ້ໃຫ້ບໍລິການ One-Stop B2B Solution ອັນດັບ 1 ໃນ ສປປ ລາວ", "From forklift sales and 0-CAPEX leasing to automated warehouse racking and Nilfisk cleaning, DK LAO is the #1 One-Stop B2B Partner in Lao PDR.")}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pillars.map((tab, idx) => {
                      const Icon = tab.icon;
                      return (
                        <div
                          key={tab.id}
                          onClick={() => selectTab(tab.id)}
                          className={`cursor-pointer group relative overflow-hidden rounded-3xl p-8 bg-slate-50/70 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-blue-500/50 hover:-translate-y-1 transition-all duration-300 ${
                            idx === 4 ? "lg:col-span-2" : ""
                          }`}
                        >
                          <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full ${tab.lightBg} opacity-60 group-hover:scale-125 transition-transform duration-500`}></div>
                          <div className="relative z-10 flex flex-col h-full">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg ${tab.color} group-hover:-translate-y-1 transition-transform`}>
                              <Icon className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {tab.label}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-6 flex-grow text-sm leading-relaxed">
                              {tab.desc}
                            </p>
                            <div className={`inline-flex items-center gap-2 font-black text-sm ${tab.textColor} group-hover:gap-3 transition-all mt-auto`}>
                              <span>{getForkliftText("ສຳຫຼວດລາຍລະອຽດ", "Explore Pillar")}</span>
                              <ArrowRight className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {activeTab === "sale" && <div className="pt-8"><ServiceSalePillar isLo={isLo} /></div>}
            {activeTab === "rental" && <div className="pt-8"><ServiceRentalPillar isLo={isLo} /></div>}
            {activeTab === "service" && <div className="pt-8"><ServicePMPillar isLo={isLo} /></div>}
            {activeTab === "parts" && <div className="pt-8"><ServicePartsPillar isLo={isLo} /></div>}
            {activeTab === "ecosystem" && <div className="pt-8"><ServiceEcosystem isLo={isLo} /></div>}

            {activeTab === "stories" && <FieldStoriesShowcase isLo={isLo} />}

            {activeTab === "trust" && (
              <div className="bg-slate-100/70 dark:bg-slate-900/60 min-h-[60vh]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
                  <ServiceWorkshopShowcase />
                </div>
                <EnterpriseCustomerShowcase />
                <ServiceCredibilityShowcase isLo={isLo} />
              </div>
            )}

            {activeTab === "partners" && (
              <div className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-semibold mb-4 text-xs tracking-wider">
                      <Globe2 className="w-4 h-4" />
                      <span>AUTHORIZED GLOBAL BRAND PRINCIPALS</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">
                      {getForkliftText("ກົນຈັກ ແລະ ອຸປະກອນມາດຕະຖານລະດັບໂລກ", "World-Class Industrial Equipment")}
                    </h2>
                    <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                      {getForkliftText("ດີເຄ ລາວ ເປັນຕົວແທນຈຳໜ່າຍ ແລະ ສູນບໍລິການຫຼັງການຂາຍຢ່າງເປັນທາງການ ມາດຕະຖານດຽວກັບໂຮງງານແມ່ຕ່າງປະເທດ", "DK LAO is the certified partner and official after-sales service provider operating strictly to international factory benchmarks.")}
                    </p>
                  </div>
                  <div className="space-y-12">
                    <MitsubishiForkliftShowcase />
                    <JungheinrichEFGShowcase />
                    <WarehouseAutomationShowcase />
                    <RackingAndStorageShowcase />
                    <NilfiskCleaningShowcase />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "contact" && (
              <>
                <ServiceBookingForm isLo={isLo} />
                <div className="mt-12"><ServiceContact isLo={isLo} /></div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* MODALS */}
        <ServiceChecklistModal isLo={isLo} />
      </div>

      {/* Hide Scrollbar for Tabs Container */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `,
        }}
      />
    </BookingProvider></InternalModeProvider>
  );
}
