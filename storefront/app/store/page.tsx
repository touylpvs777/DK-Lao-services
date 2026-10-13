import { Suspense } from "react";
import { fetchInventory, fetchRentals } from "@/actions/store";
import { StoreClient } from "@/components/store/StoreClient";
import { HeroCarousel } from "@/components/store/HeroCarousel";
import { TrustedPartners } from "@/components/store/TrustedPartners";
import { ServiceHighlights } from "@/components/store/ServiceHighlights";
import { PromoBanner } from "@/components/store/PromoBanner";
import { EnterpriseGuarantees } from "@/components/store/EnterpriseGuarantees";
import { ExchangeRateTicker } from "@/components/store/ExchangeRateTicker";
import { CatalogLoading } from "@/components/store/CatalogLoading";

export const metadata = {
  title: "B2B & Industrial Store | DK Lao Trading & LUD",
  description: "Browse industrial equipment and submit product requests. DK LAO confirms pricing and availability before accepting orders.",
};

export default async function StorePage() {
  const catalog = await fetchInventory();
  const rentals = await fetchRentals();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 pt-24 pb-20 overflow-x-hidden">
      {/* 1. VIP B2B Announcement Banner */}
      <div className="container mx-auto px-4 md:px-6 mb-4">
        <PromoBanner />
      </div>

      {/* 2. Spectacular Top Store Hero Carousel */}
      <div className="container mx-auto px-4 md:px-6 mb-6">
        <HeroCarousel />
      </div>

      {/* 3. Enterprise Guarantees (4 Value Pillars) */}
      <div className="container mx-auto px-4 md:px-6 mb-8">
        <EnterpriseGuarantees />
      </div>

      {/* 4. Product Catalog — Interactive store with tabs, 3-step finder, filters, sidebar */}
      <div className="container mx-auto px-4 md:px-6">
        {/* Reference exchange rate estimate */}
        <ExchangeRateTicker />

        <Suspense fallback={<CatalogLoading />}>
          <StoreClient initialItems={catalog.items} rentalItems={rentals} catalogConnected={catalog.connected} />
        </Suspense>
      </div>

      {/* 5. Service Highlights — 4 Core Business Pillars */}
      <ServiceHighlights />

      {/* 6. Social Proof — Trusted Enterprise Partners marquee */}
      <TrustedPartners />
      
      {/* End Store Content */}
    </div>
  );
}
