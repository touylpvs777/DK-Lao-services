module.exports = [
"[project]/storefront/components/store/ProductCard.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProductCard",
    ()=>ProductCard,
    "isBigProductEligibleForWarranty",
    ()=>isBigProductEligibleForWarranty
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storefront/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storefront/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storefront/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$data$2f$catalog$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storefront/data/catalog.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__ = __turbopack_context__.i("[project]/storefront/node_modules/lucide-react/dist/esm/icons/shopping-cart.mjs [app-ssr] (ecmascript) <export default as ShoppingCart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/storefront/node_modules/lucide-react/dist/esm/icons/package.mjs [app-ssr] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/storefront/node_modules/lucide-react/dist/esm/icons/check.mjs [app-ssr] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/storefront/node_modules/lucide-react/dist/esm/icons/eye.mjs [app-ssr] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/storefront/node_modules/lucide-react/dist/esm/icons/file-text.mjs [app-ssr] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/storefront/node_modules/lucide-react/dist/esm/icons/download.mjs [app-ssr] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/storefront/node_modules/lucide-react/dist/esm/icons/clock.mjs [app-ssr] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__ = __turbopack_context__.i("[project]/storefront/node_modules/lucide-react/dist/esm/icons/message-circle.mjs [app-ssr] (ecmascript) <export default as MessageCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$vertical$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sliders$3e$__ = __turbopack_context__.i("[project]/storefront/node_modules/lucide-react/dist/esm/icons/sliders-vertical.mjs [app-ssr] (ecmascript) <export default as Sliders>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/storefront/node_modules/lucide-react/dist/esm/icons/sparkles.mjs [app-ssr] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/storefront/node_modules/lucide-react/dist/esm/icons/arrow-right.mjs [app-ssr] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$alert$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldAlert$3e$__ = __turbopack_context__.i("[project]/storefront/node_modules/lucide-react/dist/esm/icons/shield-alert.mjs [app-ssr] (ecmascript) <export default as ShieldAlert>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__ = __turbopack_context__.i("[project]/storefront/node_modules/lucide-react/dist/esm/icons/shield-check.mjs [app-ssr] (ecmascript) <export default as ShieldCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storefront/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$context$2f$CartContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storefront/context/CartContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storefront/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storefront/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$components$2f$store$2f$RFQModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storefront/components/store/RFQModal.tsx [app-ssr] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module 'next-intl'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
"use client";
;
;
;
;
;
;
;
;
;
;
;
const SPEC_TRANSLATIONS_LO = {
    "Height": "ຄວາມສູງ (Height)",
    "Width": "ຄວາມກວ້າງ (Width)",
    "Length": "ຄວາມຍາວ (Length)",
    "Dimensions": "ຂະໜາດລວມ (Dimensions)",
    "Type": "ປະເພດ / ຮູບແບບ (Type)",
    "Material": "ວັດສະດຸ (Material)",
    "Capacity": "ຄວາມຈຸ / ຮັບນ້ຳໜັກ (Capacity)",
    "Load Capacity": "ນ້ຳໜັກບັນທຸກ (Load Capacity)",
    "Lifting Height": "ໄລຍະຍົກສູງສຸດ (Lifting Height)",
    "Weight": "ນ້ຳໜັກຕົວເຄື່ອງ (Weight)",
    "Net Weight": "ນ້ຳໜັກສຸດທິ (Net Weight)",
    "Gross Weight": "ນ້ຳໜັກລວມ (Gross Weight)",
    "Power": "ກຳລັງໄຟຟ້າ (Power)",
    "Power Supply": "ລະບົບໄຟຟ້າ (Power Supply)",
    "Voltage": "ແຮງດັນໄຟ (Voltage)",
    "Frequency": "ຄວາມຖີ່ໄຟ (Frequency)",
    "Motor": "ມໍເຕີ (Motor)",
    "Battery": "ແບັດເຕີຣີ (Battery)",
    "Battery Capacity": "ຄວາມຈຸແບັດເຕີຣີ (Battery Capacity)",
    "Fork Width": "ຄວາມກວ້າງງາ (Fork Width)",
    "Fork Length": "ຄວາມຍາວງາ (Fork Length)",
    "Rollers": "ປະເພດລໍ້ (Rollers)",
    "Wheel Type": "ປະເພດລໍ້ (Wheel Type)",
    "Wheel Material": "ວັດສະດຸລໍ້ (Wheel Material)",
    "Tank Capacity": "ຄວາມຈຸຖັງ (Tank Capacity)",
    "Volume": "ປະລິມານຄວາມຈຸ (Volume)",
    "Airflow": "ແຮງລົມດູດ (Airflow)",
    "Suction Power": "ແຮງດູດ (Suction Power)",
    "Noise Level": "ລະດັບສຽງ (Noise Level)",
    "Cable Length": "ຄວາມຍາວສາຍໄຟ (Cable Length)",
    "Hose Length": "ຄວາມຍາວສາຍດູດ (Hose Length)",
    "Pressure": "ແຮງດັນ (Pressure)",
    "Speed": "ຄວາມໄວ (Speed)",
    "Max Speed": "ຄວາມໄວສູງສຸດ (Max Speed)",
    "Warranty": "ການຮັບປະກັນ (Warranty)",
    "Color": "ສີ (Color)",
    "Size": "ຂະໜາດ (Size)",
    "Origin": "ປະເທດຕົ້ນກຳເນີດ (Origin)",
    "Standard": "ມາດຕະຖານ (Standard)",
    "Certification": "ໃບຢັ້ງຢືນ (Certification)",
    "Platform Size": "ຂະໜາດຖານຮອງ (Platform Size)",
    "Table Size": "ຂະໜາດໜ້າໂຕະ (Table Size)",
    "Stroke": "ໄລຍະຊັກ / ຍົກ (Stroke)"
};
function formatSpecKey(key, isLao) {
    if (!isLao) return key;
    if (SPEC_TRANSLATIONS_LO[key]) return SPEC_TRANSLATIONS_LO[key];
    const found = Object.keys(SPEC_TRANSLATIONS_LO).find((k)=>k.toLowerCase() === key.toLowerCase().trim());
    if (found) return SPEC_TRANSLATIONS_LO[found];
    return key;
}
const GALLERY_IMAGE_META = {
    "front": {
        lo: "ມຸມໜ້າ",
        en: "Front View"
    },
    "rear": {
        lo: "ມຸມຫຼັງ",
        en: "Rear View"
    },
    "left": {
        lo: "ມຸມຊ້າຍ",
        en: "Left Profile"
    },
    "right": {
        lo: "ມຸມຂວາ",
        en: "Right Profile"
    },
    "tire_front": {
        lo: "ຢາງໜ້າ",
        en: "Front Tire"
    },
    "tire_rear": {
        lo: "ຢາງຫຼັງ",
        en: "Rear Tire"
    },
    "dashboard": {
        lo: "ໜ້າປັດ",
        en: "Dashboard"
    },
    "seat": {
        lo: "ເບາະນັ່ງ",
        en: "Operator Seat"
    },
    "pedals": {
        lo: "ແປ້ນຄັນເລັ່ງ/ເບຣກ",
        en: "Pedals Controls"
    },
    "levers": {
        lo: "ຄັນໂຍກ",
        en: "Hydraulic Levers"
    },
    "mast": {
        lo: "ເສົາຍົກ",
        en: "Mast & Lift"
    },
    "forks": {
        lo: "ງ່າຍົກ",
        en: "Forks & Carriage"
    }
};
function getGalleryImageLabel(url, isLao) {
    if (url.includes("tire_front")) return isLao ? "ຢາງໜ້າ" : "Front Tire";
    if (url.includes("tire_rear")) return isLao ? "ຢາງຫຼັງ" : "Rear Tire";
    if (url.includes("dashboard")) return isLao ? "ໜ້າປັດ" : "Dashboard";
    if (url.includes("seat")) return isLao ? "ເບາະນັ່ງ" : "Operator Seat";
    if (url.includes("pedals")) return isLao ? "ແປ້ນຄັນເລັ່ງ/ເບຣກ" : "Pedals Controls";
    if (url.includes("levers")) return isLao ? "ຄັນໂຍກ" : "Hydraulic Levers";
    if (url.includes("mast") || url.includes("lift")) return isLao ? "ເສົາຍົກ" : "Mast & Lift";
    if (url.includes("forks")) return isLao ? "ງ່າຍົກ" : "Forks & Carriage";
    if (url.includes("front")) return isLao ? "ມຸມໜ້າ" : "Front View";
    if (url.includes("rear")) return isLao ? "ມຸມຫຼັງ" : "Rear View";
    if (url.includes("left")) return isLao ? "ມຸມຊ້າຍ" : "Left Profile";
    if (url.includes("right")) return isLao ? "ມຸມຂວາ" : "Right Profile";
    if (url.includes("wheel")) return isLao ? "ລໍ້ & ຢາງ" : "Wheel";
    return isLao ? "ຮູບຕົວຈິງ" : "Photo";
}
// Helpers for Realistic Dynamic Lead Time Display (Matching Enterprise Logistics)
function getLeadTimeBadge(leadTimeStr, isLao) {
    if (!leadTimeStr) return isLao ? "ນຳເຂົ້າ 30-45 ວັນ (ຮອບໂຮງງານ)" : "Pre-Order (30-45 Days)";
    const lt = leadTimeStr.toLowerCase();
    // Real In-Stock at Vientiane Logistics Hub
    if (lt.includes("24") || lt.includes("48") || lt.includes("hub") || lt.includes("dispatch") || lt.includes("in stock") && !lt.includes("30-45")) {
        return isLao ? "ພ້ອມສົ່ງ 24-48 ຊມ (ສາງວຽງຈັນ)" : "VTE Hub (24-48h Dispatch)";
    }
    // Direct Factory Import
    if (lt.includes("30") || lt.includes("45") || lt.includes("pre-order") || lt.includes("import") || lt.includes("factory")) {
        return isLao ? "ນຳເຂົ້າ 30-45 ວັນ (ຮອບໂຮງງານ)" : "Factory Direct (30-45 Days)";
    }
    return isLao ? `ຈັດສົ່ງ (${leadTimeStr.replace(/in stock|delivery|\(|\)/ig, "").trim()})` : `Lead Time (${leadTimeStr})`;
}
function getLeadTimeBusiness(leadTimeStr, isLao) {
    if (!leadTimeStr) return isLao ? "ສິນຄ້ານຳເຂົ້າຕາມຮອບໂຮງງານ 30-45 ວັນລັດຖະການ" : "Direct Factory Import: 30-45 Business Days";
    const lt = leadTimeStr.toLowerCase();
    if (lt.includes("24") || lt.includes("48") || lt.includes("hub") || lt.includes("dispatch") || lt.includes("in stock") && !lt.includes("30-45")) {
        return isLao ? "ສິນຄ້າພ້ອມຈັດສົ່ງທັນທີພາຍໃນ 24-48 ຊົ່ວໂມງ (ສາງນະຄອນຫຼວງວຽງຈັນ)" : "Immediate Dispatch from Vientiane Logistics Hub (24-48 Hours)";
    }
    return isLao ? "ສິນຄ້ານຳເຂົ້າຕາມຮອບໂຮງງານຜູ້ຜະລິດ 30-45 ວັນລັດຖະການ" : "Official Factory Import Order: 30-45 Business Days";
}
function isBigProductEligibleForWarranty(item) {
    if (!item || !item.warranty_months || item.warranty_months <= 0) return false;
    const name = ((item.part_name || '') + ' ' + (item.part_name_lo || '')).toLowerCase();
    const cat = (item.category || '').toLowerCase();
    const unitPrice = Number(item.unit_price) || 0;
    const currency = item.currency || 'THB';
    const priceTHB = currency === 'THB' ? unitPrice : currency === 'USD' ? unitPrice * 35 : unitPrice / 650;
    // 1. Definite small items, consumables, PPE, signage, manual accessories to exclude
    const smallItemKeywords = [
        'sign',
        'caution',
        'wet floor',
        'cone',
        'tape',
        'glove',
        'vest',
        'goggle',
        'helmet',
        'mop',
        'broom',
        'brush',
        'pad',
        'bucket',
        'bag',
        'cloth',
        'duster',
        'sponge',
        'bottle',
        'dispenser',
        'refill',
        'paper',
        'mask',
        'filter pad',
        'label',
        'wheel chock',
        'strap',
        'sling',
        'band',
        'box',
        'film',
        'carton',
        'cable tie',
        'tag',
        'caster',
        'wheel',
        'ປ້າຍ',
        'ຖົງມື',
        'ແວ່ນຕາ',
        'ເສື້ອ',
        'ໄມ້ຖູ',
        'ຟອຍ',
        'ຖັງ',
        'ຜ້າ',
        'ເທບ',
        'ໜ້າກາກ',
        'ຂວດ',
        'ສາຍຮັດ',
        'ກ່ອງ',
        'ລໍ້',
        'ໝວກ'
    ];
    if (smallItemKeywords.some((kw)=>name.includes(kw))) {
        return false;
    }
    // 2. Categories that are predominantly small consumables / supplies
    if (cat.includes('safety') || cat.includes('packaging') || cat.includes('cleaning') || cat.includes('wheels') || cat.includes('accessories')) {
        // Only motorized/electrical industrial machines in these categories qualify (e.g. electric floor scrubber, industrial vacuum)
        const isElectricMachine = (name.includes('machine') || name.includes('electric') || name.includes('motor') || name.includes('vacuum') || name.includes('nilfisk') || name.includes('scrubber') || name.includes('sweeper') || name.includes('washer') || name.includes('ເຄື່ອງດູດຝຸ່ນ') || name.includes('ເຄື່ອງຂັດ') || name.includes('ເຄື່ອງກວາດ') || name.includes('ເຄື່ອງສີດນ້ຳ')) && priceTHB >= 3000;
        return isElectricMachine;
    }
    // 3. Heavy industrial machinery, lifting, vehicles, solar, hydraulic systems
    if (cat.includes('handling') || cat.includes('lifting') || cat.includes('machinery') || cat.includes('forklift') || cat.includes('pallet') || cat.includes('hydraulic') || cat.includes('solar') || cat.includes('fleet')) {
        return true;
    }
    // 4. Other heavy equipment above price threshold (>= 3,000 THB or ~2,000,000 LAK)
    if (priceTHB >= 3000) {
        return true;
    }
    return false;
}
function ProductCard({ item, viewMode = 'grid' }) {
    const { addToCart, openCheckout, exchangeRates, isAdminMode } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$context$2f$CartContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCart"])();
    const locale = useLocale();
    const isLao = locale === 'lo';
    const [isAdded, setIsAdded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showQuickView, setShowQuickView] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showRfq, setShowRfq] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedColor, setSelectedColor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(item?.colors && item.colors.length > 0 ? item.colors[0] : null);
    const [selectedSize, setSelectedSize] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(item?.sizes && item.sizes.length > 0 ? item.sizes[0] : null);
    const [quantity, setQuantity] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(1);
    const [mainImage, setMainImage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(item?.image_url || null);
    if (!item) return null;
    const isRental = item.category === 'Equipment Rental';
    const hasWarranty = isBigProductEligibleForWarranty(item);
    const warrantyMonths = item.warranty_months || 12;
    const displayName = (isLao ? item.part_name_lo || item.part_name : item.part_name || item.part_name_lo) || item.sku_code || 'Product';
    const displayDesc = isLao ? item.description_lo || item.description : item.description || item.description_lo;
    const factoryPrice = Number(item.unit_price) || 0;
    const itemCurrency = item.currency || 'THB';
    const retailForeignPrice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$context$2f$CartContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateRetailForeignPrice"])(factoryPrice, itemCurrency);
    // Real DB Discount Logic vs Mock
    let isSale = false;
    let discountPercent = 0;
    let originalPriceNative = factoryPrice;
    if (item.original_price && item.original_price > factoryPrice) {
        isSale = true;
        originalPriceNative = Number(item.original_price);
        discountPercent = Math.round((originalPriceNative - factoryPrice) / originalPriceNative * 100);
    } else {
        // Fallback to deterministic mock if no real discount in DB
        const discountSeed = item.sku_id.split('').reduce((acc, char)=>acc + char.charCodeAt(0), 0);
        isSale = !isRental && discountSeed % 5 === 0;
        discountPercent = isSale ? discountSeed % 3 === 0 ? 30 : discountSeed % 2 === 0 ? 20 : 15 : 0;
        originalPriceNative = isSale ? factoryPrice / (1 - discountPercent / 100) : factoryPrice;
    }
    const discountSeed = item.sku_id.split('').reduce((acc, char)=>acc + char.charCodeAt(0), 0);
    const isBogo = !isRental && !isSale && discountSeed % 7 === 0;
    const stockCount = discountSeed % 150 + 12; // Simulated WMS Stock (12 - 161)
    const isLowStock = stockCount < 20;
    const originalPriceLAK = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$context$2f$CartContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateLAKPrice"])(originalPriceNative, itemCurrency, item.category, exchangeRates);
    const relatedProducts = item.related_skus ? __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$data$2f$catalog$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["INITIAL_CATALOG"].filter((prod)=>item.related_skus?.includes(prod.sku_id)) : [];
    const handleAddToCart = ()=>{
        // In a real app we'd pass color and size to cart item, but for now we just add it to cart.
        addToCart(item, quantity);
        setIsAdded(true);
        setTimeout(()=>setIsAdded(false), 1500);
    };
    const handleQuickBuy = ()=>{
        addToCart(item, quantity);
        openCheckout();
    };
    const priceLAK = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$context$2f$CartContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateLAKPrice"])(factoryPrice, itemCurrency, item.category, exchangeRates);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                whileHover: {
                    y: -4,
                    boxShadow: "0 20px 40px -15px rgba(0,91,172,0.18)"
                },
                transition: {
                    duration: 0.3
                },
                className: "group relative flex flex-col justify-between overflow-hidden rounded-[1.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-[#005BAC]/50 transition-all duration-300",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative mb-0 h-56 w-full overflow-hidden bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center p-6 border-b border-slate-100 dark:border-white/5",
                        children: [
                            item.image_url ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                src: item.image_url,
                                alt: displayName,
                                fill: true,
                                className: "object-contain p-3 transition-transform duration-500 group-hover:scale-105",
                                sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
                                loading: "lazy"
                            }, void 0, false, {
                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                lineNumber: 286,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                className: "h-16 w-16 text-slate-300 dark:text-slate-700 group-hover:scale-110 transition-transform duration-500 m-auto"
                            }, void 0, false, {
                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                lineNumber: 295,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute top-4 left-4 flex flex-col gap-2 z-10",
                                children: isRental ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "bg-[#005BAC] text-white text-[11px] font-black px-2.5 py-1 rounded-md shadow-lg shadow-blue-600/30",
                                    children: isLao ? "ໃຫ້ເຊົ່າ" : "Rental"
                                }, void 0, false, {
                                    fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                    lineNumber: 301,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "bg-[#005BAC] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md flex items-center gap-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                    className: "w-3 h-3"
                                                }, void 0, false, {
                                                    fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                    lineNumber: 307,
                                                    columnNumber: 19
                                                }, this),
                                                " ",
                                                getLeadTimeBadge(item.lead_time, isLao)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                            lineNumber: 306,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: `text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md flex items-center gap-1 border backdrop-blur-md ${isLowStock ? 'bg-amber-50/90 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800' : 'bg-emerald-50/90 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                                    className: "w-3 h-3"
                                                }, void 0, false, {
                                                    fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                    lineNumber: 310,
                                                    columnNumber: 19
                                                }, this),
                                                " ",
                                                isLao ? `ສາງ VTE: ${stockCount} ພ້ອມສົ່ງ` : `VTE Hub: ${stockCount} In Stock`
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                            lineNumber: 309,
                                            columnNumber: 17
                                        }, this),
                                        isSale && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "bg-[#E1251B] text-white text-[11px] font-black px-2.5 py-1 rounded-md shadow-lg shadow-red-500/30 animate-pulse",
                                            children: [
                                                "-",
                                                discountPercent,
                                                "% OFF"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                            lineNumber: 313,
                                            columnNumber: 19
                                        }, this),
                                        isBogo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "bg-amber-500 text-white text-[11px] font-black px-2.5 py-1 rounded-md shadow-lg shadow-amber-500/30",
                                            children: isLao ? "ຊື້ 1 ແຖມ 1" : "Buy 1 Get 1"
                                        }, void 0, false, {
                                            fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                            lineNumber: 318,
                                            columnNumber: 19
                                        }, this),
                                        hasWarranty && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "bg-blue-50/90 dark:bg-blue-950/80 text-[#005BAC] dark:text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-800 backdrop-blur-md flex items-center gap-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                    className: "w-3 h-3"
                                                }, void 0, false, {
                                                    fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                    lineNumber: 324,
                                                    columnNumber: 21
                                                }, this),
                                                " ",
                                                isLao ? `${warrantyMonths} ເດືອນ` : `${warrantyMonths}M Wty`
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                            lineNumber: 323,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                    lineNumber: 305,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                lineNumber: 299,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setShowQuickView(true),
                                className: "absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 dark:bg-slate-900/90 hover:bg-white text-slate-400 hover:text-[#005BAC] flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-sm hover:scale-110 z-10",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                    lineNumber: 335,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                lineNumber: 331,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                        lineNumber: 284,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `flex flex-col flex-1 p-5 ${viewMode === 'list' ? 'w-full justify-between' : ''}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: viewMode === 'list' ? 'mb-4' : 'flex-1',
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-start mb-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[10px] font-mono font-bold text-[#005BAC] dark:text-blue-300 bg-blue-50 dark:bg-blue-900/40 border border-blue-100 dark:border-blue-800 px-2 py-0.5 rounded-md inline-block",
                                                children: [
                                                    "SKU: ",
                                                    item.sku_code
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                lineNumber: 343,
                                                columnNumber: 15
                                            }, this),
                                            item.category && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest truncate max-w-[120px]",
                                                children: item.category.split(' & ')[0]
                                            }, void 0, false, {
                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                lineNumber: 347,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                        lineNumber: 342,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-base font-bold text-slate-900 dark:text-white leading-tight line-clamp-2 group-hover:text-[#005BAC] transition-colors",
                                        children: displayName
                                    }, void 0, false, {
                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                        lineNumber: 353,
                                        columnNumber: 13
                                    }, this),
                                    viewMode === 'list' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed",
                                        children: displayDesc
                                    }, void 0, false, {
                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                        lineNumber: 358,
                                        columnNumber: 15
                                    }, this),
                                    item.compatible_models && item.compatible_models.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-3 flex flex-wrap gap-1.5",
                                        children: [
                                            item.compatible_models.slice(0, 2).map((model)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[10px] font-bold text-slate-600 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700",
                                                    children: model
                                                }, model, false, {
                                                    fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                    lineNumber: 366,
                                                    columnNumber: 19
                                                }, this)),
                                            item.compatible_models.length > 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[10px] font-bold text-slate-500 bg-slate-50 dark:bg-slate-800/50 px-2 py-0.5 rounded-md border border-transparent",
                                                children: [
                                                    "+",
                                                    item.compatible_models.length - 2
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                lineNumber: 371,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                        lineNumber: 364,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                lineNumber: 341,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `pt-4 mt-4 border-t border-slate-100 dark:border-white/5 ${viewMode === 'list' ? 'flex items-center justify-between gap-4' : 'flex flex-col gap-4'}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-col gap-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-1.5 flex-wrap",
                                                    children: isAdminMode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[11px] font-bold text-amber-600 dark:text-amber-400",
                                                                children: itemCurrency === 'USD' ? 'ຕົ້ນທຶນ ($):' : 'ຕົ້ນທຶນ (฿):'
                                                            }, void 0, false, {
                                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                lineNumber: 387,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-xs font-mono font-black text-slate-900 dark:text-white bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-300 dark:border-amber-800",
                                                                children: [
                                                                    itemCurrency === 'USD' ? '$' : itemCurrency === 'LAK' ? '₭' : '฿',
                                                                    factoryPrice.toLocaleString("en-US", {
                                                                        minimumFractionDigits: itemCurrency === 'USD' ? 2 : 0
                                                                    })
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                lineNumber: 390,
                                                                columnNumber: 23
                                                            }, this),
                                                            itemCurrency !== 'LAK' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/40 px-1.5 py-0.5 rounded border border-amber-300 dark:border-amber-700",
                                                                children: "+65% ກຳໄລ"
                                                            }, void 0, false, {
                                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                lineNumber: 394,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                        lineNumber: 386,
                                                        columnNumber: 21
                                                    }, this) : itemCurrency !== 'LAK' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs font-semibold text-slate-500 dark:text-slate-400",
                                                        children: [
                                                            isLao ? "ລາຄາອ້າງອີງ:" : "Ref:",
                                                            " ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-bold text-slate-700 dark:text-slate-300",
                                                                children: [
                                                                    itemCurrency === 'USD' ? '$' : '฿',
                                                                    retailForeignPrice.toLocaleString("en-US", {
                                                                        minimumFractionDigits: itemCurrency === 'USD' ? 2 : 0
                                                                    })
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                lineNumber: 403,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                        lineNumber: 401,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                    lineNumber: 384,
                                                    columnNumber: 17
                                                }, this),
                                                isSale && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2 mb-0.5",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs font-bold text-slate-400 line-through",
                                                        children: [
                                                            originalPriceLAK.toLocaleString(),
                                                            " ₭"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                        lineNumber: 414,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                    lineNumber: 413,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-baseline gap-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `text-xl font-black tracking-tight ${isSale ? 'text-[#E1251B] dark:text-rose-500' : 'text-[#E1251B] dark:text-red-500'}`,
                                                            children: [
                                                                priceLAK.toLocaleString(),
                                                                " ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-sm font-bold",
                                                                    children: "₭"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                    lineNumber: 421,
                                                                    columnNumber: 49
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                            lineNumber: 420,
                                                            columnNumber: 19
                                                        }, this),
                                                        isRental && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs font-semibold text-slate-500",
                                                            children: isLao ? "/ ມື້" : "/ day"
                                                        }, void 0, false, {
                                                            fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                            lineNumber: 424,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                    lineNumber: 419,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-[10px] text-slate-400 flex items-center gap-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"
                                                        }, void 0, false, {
                                                            fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                            lineNumber: 430,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: itemCurrency === 'USD' ? isLao ? `ອັດຕາແລກປ່ຽນ: $1 = ${exchangeRates.USD.toLocaleString()} ₭` : `Rate: $1 = ${exchangeRates.USD.toLocaleString()} LAK` : isLao ? `ອັດຕາແລກປ່ຽນ: 1 ฿ = ${exchangeRates.THB.toLocaleString()} ₭` : `Rate: 1 ฿ = ${exchangeRates.THB.toLocaleString()} LAK`
                                                        }, void 0, false, {
                                                            fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                            lineNumber: 431,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                    lineNumber: 429,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                            lineNumber: 382,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                        lineNumber: 381,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `grid ${isRental ? 'grid-cols-1' : 'grid-cols-2'} gap-2 ${viewMode === 'list' ? 'w-64' : 'w-full'}`,
                                        children: [
                                            !isRental && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                onClick: handleAddToCart,
                                                className: `h-11 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-300 active:scale-95 group/btn ${isAdded ? "bg-[#005BAC] hover:bg-[#00478a] text-white shadow-lg shadow-blue-600/25" : "bg-slate-900 hover:bg-[#005BAC] text-white dark:bg-slate-800 dark:hover:bg-[#005BAC] shadow-lg shadow-slate-900/10"}`,
                                                children: isAdded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                            className: "w-4 h-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                            lineNumber: 451,
                                                            columnNumber: 23
                                                        }, this),
                                                        " ",
                                                        isLao ? "ເພີ່ມແລ້ວ" : "Added"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                    lineNumber: 451,
                                                    columnNumber: 21
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__["ShoppingCart"], {
                                                            className: "w-4 h-4 transition-transform group-hover/btn:-translate-x-1"
                                                        }, void 0, false, {
                                                            fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                            lineNumber: 453,
                                                            columnNumber: 23
                                                        }, this),
                                                        " ",
                                                        isLao ? "ໃສ່ກະຕ່າ" : "Add to Cart"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                    lineNumber: 453,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                lineNumber: 442,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                onClick: ()=>setShowRfq(true),
                                                variant: isRental ? "default" : "secondary",
                                                className: `h-11 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-300 hover:shadow-md ${isRental ? "bg-[#005BAC] text-white hover:bg-[#00478a] w-full shadow-lg shadow-blue-600/20" : "bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                        className: "w-4 h-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                        lineNumber: 467,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: isRental ? isLao ? 'ຈອງ/ຕິດຕໍ່' : 'Book / Inquire' : isLao ? 'ຂໍລາຄາ' : 'Get Quote'
                                                    }, void 0, false, {
                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                        lineNumber: 468,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                lineNumber: 458,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                        lineNumber: 440,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: `https://wa.me/8562058929299?text=${encodeURIComponent(isLao ? `ສະບາຍດີ LUD/DK Lao, ຂ້າພະເຈົ້າສົນໃຈສິນຄ້າ:\n• ຊື່: ${displayName}\n• ລະຫັດ SKU: ${item.sku_code}\n• ລາຄາ: ${priceLAK.toLocaleString()} ₭\nຕ້ອງການສັ່ງຊື້ / ສອບຖາມຂໍ້ມູນເພີ່ມເຕີມ` : `Hello LUD/DK Lao, I am interested in:\n• Product: ${displayName}\n• SKU: ${item.sku_code}\n• Price: ${priceLAK.toLocaleString()} LAK\nI would like to order / inquire further.`)}`,
                                        target: "_blank",
                                        rel: "noopener noreferrer",
                                        className: "w-full py-2 px-3 rounded-xl text-[11px] font-bold bg-emerald-500/10 hover:bg-emerald-600 text-emerald-700 hover:text-white dark:bg-emerald-500/20 dark:text-emerald-400 dark:hover:text-white border border-emerald-500/30 flex items-center justify-center gap-1.5 transition-all duration-200 shadow-sm group/wa",
                                        title: isLao ? "ສັ່ງຊື້ ຫຼື ສອບຖາມດ່ວນຜ່ານ WhatsApp (020 5892 9299)" : "Order or Inquire instantly via WhatsApp",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"], {
                                                className: "w-3.5 h-3.5 transition-transform group-hover/wa:scale-110"
                                            }, void 0, false, {
                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                lineNumber: 484,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: isLao ? "ສັ່ງຊື້ / ຖາມຜ່ານ WhatsApp" : "Order via WhatsApp"
                                            }, void 0, false, {
                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                lineNumber: 485,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                        lineNumber: 473,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-slate-400 font-medium",
                                                children: isRental ? isLao ? "ການບໍລິຫານ:" : "Management:" : isLao ? "ທາງເລືອກ B2B:" : "B2B Option:"
                                            }, void 0, false, {
                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                lineNumber: 490,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                href: isRental ? `/${locale}/services#rental` : `/${locale}/services#management-ecosystem`,
                                                className: "text-[#005BAC] dark:text-blue-400 hover:underline font-bold flex items-center gap-0.5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: isRental ? isLao ? "ແພັກເກດ 0 CAPEX" : "0 CAPEX Lease" : isLao ? "ບໍລິຫານ 360°" : "360° Care"
                                                    }, void 0, false, {
                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                        lineNumber: 497,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                        className: "w-3 h-3"
                                                    }, void 0, false, {
                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                        lineNumber: 498,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                lineNumber: 493,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                        lineNumber: 489,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                lineNumber: 380,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                        lineNumber: 340,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                lineNumber: 278,
                columnNumber: 7
            }, this),
            showQuickView && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-[60] overflow-y-auto bg-white dark:bg-slate-950 flex flex-col animate-in fade-in zoom-in-95 duration-200",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "sticky top-0 z-20 flex justify-between items-center p-4 md:px-8 md:py-4 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 shadow-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "w-3 h-3 rounded-full bg-[#E1251B] animate-ping"
                                    }, void 0, false, {
                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                        lineNumber: 510,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs font-black uppercase tracking-wider text-[#005BAC] dark:text-blue-400",
                                        children: isLao ? "ລາຍລະອຽດສິນຄ້າ ແລະ ມຸມມອງ 360°" : "Product Details & 360° Inspection"
                                    }, void 0, false, {
                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                        lineNumber: 511,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                lineNumber: 509,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setShowQuickView(false),
                                className: "p-2 md:px-4 md:py-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full transition-all flex items-center gap-2 font-bold text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "hidden md:block",
                                        children: isLao ? "ປິດ (Close)" : "Close"
                                    }, void 0, false, {
                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                        lineNumber: 519,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        xmlns: "http://www.w3.org/2000/svg",
                                        width: "20",
                                        height: "20",
                                        viewBox: "0 0 24 24",
                                        fill: "none",
                                        stroke: "currentColor",
                                        strokeWidth: "2",
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                x1: "18",
                                                y1: "6",
                                                x2: "6",
                                                y2: "18"
                                            }, void 0, false, {
                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                lineNumber: 520,
                                                columnNumber: 193
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                x1: "6",
                                                y1: "6",
                                                x2: "18",
                                                y2: "18"
                                            }, void 0, false, {
                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                lineNumber: 520,
                                                columnNumber: 236
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                        lineNumber: 520,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                lineNumber: 515,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                        lineNumber: 508,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 w-full max-w-5xl mx-auto p-4 md:p-8 flex flex-col gap-12 pb-24",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col md:flex-row gap-8 lg:gap-12",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-full md:w-1/2 flex flex-col gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative h-64 md:h-[400px] lg:h-[500px] w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/10 shadow-inner",
                                                children: [
                                                    mainImage ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                        src: mainImage,
                                                        alt: displayName,
                                                        fill: true,
                                                        className: "object-contain p-2",
                                                        priority: true
                                                    }, void 0, false, {
                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                        lineNumber: 530,
                                                        columnNumber: 19
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                                        className: "w-16 h-16 m-auto text-slate-400 dark:text-slate-600 absolute inset-0"
                                                    }, void 0, false, {
                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                        lineNumber: 532,
                                                        columnNumber: 19
                                                    }, this),
                                                    mainImage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md text-white text-xs font-bold shadow-xl border border-white/20 flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "w-2.5 h-2.5 rounded-full bg-[#E1251B] animate-pulse"
                                                            }, void 0, false, {
                                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                lineNumber: 537,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: mainImage === item.image_url ? isLao ? "ຮູບຫຼັກ (Overview)" : "Overview" : getGalleryImageLabel(mainImage, isLao)
                                                            }, void 0, false, {
                                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                lineNumber: 538,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                        lineNumber: 536,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                lineNumber: 528,
                                                columnNumber: 15
                                            }, this),
                                            item.gallery_images && item.gallery_images.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col gap-1.5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center justify-between px-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: isLao ? "ເລືອກເບິ່ງມຸມ ແລະ ຊິ້ນສ່ວນລົດ:" : "Inspect Angles & Components:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                lineNumber: 547,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[10px] text-[#005BAC] font-mono font-bold",
                                                                children: [
                                                                    "1 + ",
                                                                    item.gallery_images.length,
                                                                    " ",
                                                                    isLao ? "ມຸມມອງ" : "views"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                lineNumber: 548,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                        lineNumber: 546,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex gap-2.5 overflow-x-auto pb-3 pt-1 scrollbar-thin snap-x",
                                                        children: [
                                                            item.image_url && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>setMainImage(item.image_url),
                                                                className: `relative flex flex-col items-center gap-1 shrink-0 snap-start group/thumb`,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: `relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all ${mainImage === item.image_url ? 'border-[#E1251B] ring-2 ring-[#E1251B]/40 shadow-md scale-[1.03] bg-white' : 'border-slate-200 dark:border-white/10 hover:border-[#005BAC] bg-white'}`,
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                            src: item.image_url,
                                                                            alt: "thumbnail-main",
                                                                            fill: true,
                                                                            className: "object-contain p-1"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                            lineNumber: 557,
                                                                            columnNumber: 28
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                        lineNumber: 556,
                                                                        columnNumber: 26
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: `text-[10px] font-bold px-1.5 py-0.5 rounded transition-colors ${mainImage === item.image_url ? 'bg-[#E1251B] text-white' : 'text-slate-600 dark:text-slate-300 group-hover/thumb:text-[#005BAC]'}`,
                                                                        children: isLao ? "ຮູບຫຼັກ" : "Main"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                        lineNumber: 559,
                                                                        columnNumber: 26
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                lineNumber: 552,
                                                                columnNumber: 23
                                                            }, this),
                                                            item.gallery_images.map((img, idx)=>{
                                                                const label = getGalleryImageLabel(img, isLao);
                                                                const isSelected = mainImage === img;
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>setMainImage(img),
                                                                    className: `relative flex flex-col items-center gap-1 shrink-0 snap-start group/thumb`,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: `relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all ${isSelected ? 'border-[#E1251B] ring-2 ring-[#E1251B]/40 shadow-md scale-[1.03] bg-white' : 'border-slate-200 dark:border-white/10 hover:border-[#005BAC] bg-white'}`,
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                                src: img,
                                                                                alt: `thumbnail-${idx}`,
                                                                                fill: true,
                                                                                className: "object-cover"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                                lineNumber: 574,
                                                                                columnNumber: 30
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                            lineNumber: 573,
                                                                            columnNumber: 28
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: `text-[10px] font-bold px-1.5 py-0.5 rounded truncate max-w-[84px] text-center transition-colors ${isSelected ? 'bg-[#E1251B] text-white' : 'text-slate-600 dark:text-slate-300 group-hover/thumb:text-[#005BAC]'}`,
                                                                            children: label
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                            lineNumber: 576,
                                                                            columnNumber: 28
                                                                        }, this)
                                                                    ]
                                                                }, idx, true, {
                                                                    fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                    lineNumber: 568,
                                                                    columnNumber: 25
                                                                }, this);
                                                            })
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                        lineNumber: 550,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                lineNumber: 545,
                                                columnNumber: 17
                                            }, this),
                                            item.spec_sheet_url && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: item.spec_sheet_url,
                                                download: true,
                                                className: "flex items-center justify-center gap-2 text-sm font-bold text-[#005BAC] dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 py-2.5 rounded-xl border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                                        className: "w-4 h-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                        lineNumber: 592,
                                                        columnNumber: 19
                                                    }, this),
                                                    " ",
                                                    isLao ? "ດາວໂຫຼດສະເປັກ (PDF)" : "Download Specs (PDF)"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                lineNumber: 587,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                        lineNumber: 526,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-full md:w-1/2 flex flex-col",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between items-start mb-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs font-mono font-bold text-[#005BAC] dark:text-blue-300 bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800 px-2.5 py-0.5 rounded-lg",
                                                        children: item.sku_code
                                                    }, void 0, false, {
                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                        lineNumber: 599,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs font-semibold text-[#005BAC] dark:text-blue-400 flex items-center gap-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                                className: "w-3.5 h-3.5"
                                                            }, void 0, false, {
                                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                lineNumber: 603,
                                                                columnNumber: 19
                                                            }, this),
                                                            " ",
                                                            getLeadTimeBadge(item.lead_time, isLao)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                        lineNumber: 602,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                lineNumber: 598,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-xl font-black text-slate-900 dark:text-white leading-tight mb-2",
                                                children: displayName
                                            }, void 0, false, {
                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                lineNumber: 606,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mb-4 pb-4 border-b border-slate-100 dark:border-white/5",
                                                children: [
                                                    isSale && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-sm font-medium text-slate-400 line-through mb-1",
                                                        children: [
                                                            originalPriceLAK.toLocaleString(),
                                                            " ₭"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                        lineNumber: 612,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: `text-3xl font-black ${isSale ? 'text-[#E1251B] dark:text-rose-500' : 'text-[#E1251B] dark:text-red-500'}`,
                                                                children: [
                                                                    priceLAK.toLocaleString(),
                                                                    " ₭"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                lineNumber: 617,
                                                                columnNumber: 19
                                                            }, this),
                                                            isSale && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "bg-rose-100 dark:bg-rose-500/20 text-[#E1251B] dark:text-rose-400 text-xs font-bold px-2 py-1 rounded",
                                                                children: [
                                                                    "-",
                                                                    discountPercent,
                                                                    "%"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                lineNumber: 621,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                        lineNumber: 616,
                                                        columnNumber: 17
                                                    }, this),
                                                    itemCurrency !== 'LAK' ? isAdminMode ? /* 🔐 Admin & Internal Staff Intelligence Panel */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-2.5 p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-300/80 dark:border-amber-700/50 flex flex-col gap-1.5 shadow-sm",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center justify-between text-[11px] font-bold text-amber-800 dark:text-amber-300 border-b border-amber-200 dark:border-amber-800/50 pb-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "flex items-center gap-1",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                                                                                className: "w-3.5 h-3.5 text-amber-600"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                                lineNumber: 634,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            isLao ? "🔐 ມຸມມອງແອັດມີນ / ໂຄງສ້າງຕົ້ນທຶນພາຍໃນ (Admin Only)" : "🔐 Internal Admin Cost Intelligence"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                        lineNumber: 633,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-[10px] bg-amber-200/80 dark:bg-amber-800/60 px-1.5 py-0.5 rounded text-amber-900 dark:text-amber-200",
                                                                        children: "+65% ກຳໄລຄົງທີ່"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                        lineNumber: 637,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                lineNumber: 632,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center justify-between text-xs text-slate-600 dark:text-slate-300",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: isLao ? "ລາຄາຕົ້ນທຶນໂຮງງານ (Factory Base):" : "Factory Base Cost:"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                        lineNumber: 642,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "font-bold text-slate-900 dark:text-white",
                                                                        children: [
                                                                            itemCurrency === 'USD' ? '$' : '฿',
                                                                            factoryPrice.toLocaleString("en-US", {
                                                                                minimumFractionDigits: itemCurrency === 'USD' ? 2 : 0
                                                                            })
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                        lineNumber: 643,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                lineNumber: 641,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center justify-between text-xs text-slate-600 dark:text-slate-300",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: isLao ? "ລາຄາຂາຍລວມກຳໄລ 65%:" : "Retail Price (+65%):"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                        lineNumber: 648,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "font-bold text-[#005BAC] dark:text-blue-400",
                                                                        children: [
                                                                            itemCurrency === 'USD' ? '$' : '฿',
                                                                            retailForeignPrice.toLocaleString("en-US", {
                                                                                minimumFractionDigits: itemCurrency === 'USD' ? 2 : 0
                                                                            })
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                        lineNumber: 649,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                lineNumber: 647,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center justify-between text-[11px] text-emerald-600 dark:text-emerald-400 pt-1 border-t border-amber-200/50 dark:border-white/5",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "flex items-center gap-1",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                                lineNumber: 655,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            isLao ? "ອັດຕາແລກປ່ຽນອອນໄລນ໌ປັດຈຸບັນ:" : "Live Online Rate:"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                        lineNumber: 654,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "font-bold",
                                                                        children: itemCurrency === 'USD' ? `1 USD = ${exchangeRates.USD.toLocaleString()} ₭` : `1 THB = ${exchangeRates.THB.toLocaleString()} ₭`
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                        lineNumber: 658,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                lineNumber: 653,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                        lineNumber: 631,
                                                        columnNumber: 21
                                                    }, this) : /* 👤 Public Customer View: Clean, Professional, No Internal Cost Leak */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-2 flex flex-wrap items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-semibold",
                                                                children: [
                                                                    isLao ? "ລາຄາອ້າງອີງ:" : "Reference:",
                                                                    " ",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "font-bold text-slate-800 dark:text-slate-200",
                                                                        children: [
                                                                            itemCurrency === 'USD' ? '$' : '฿',
                                                                            retailForeignPrice.toLocaleString("en-US", {
                                                                                minimumFractionDigits: itemCurrency === 'USD' ? 2 : 0
                                                                            })
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                        lineNumber: 670,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                lineNumber: 668,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-slate-300 dark:text-slate-600",
                                                                children: "•"
                                                            }, void 0, false, {
                                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                lineNumber: 674,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                        lineNumber: 676,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    itemCurrency === 'USD' ? `1 USD ≈ ${exchangeRates.USD.toLocaleString()} ₭` : `1 THB ≈ ${exchangeRates.THB.toLocaleString()} ₭`
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                lineNumber: 675,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                        lineNumber: 667,
                                                        columnNumber: 21
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-sm font-bold text-slate-500 mt-1",
                                                        children: [
                                                            priceLAK.toLocaleString(),
                                                            " ₭"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                        lineNumber: 684,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                lineNumber: 610,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mb-4",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                    className: "list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1.5",
                                                    children: (displayDesc || '').split('\n').map((line, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: line
                                                        }, idx, false, {
                                                            fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                            lineNumber: 694,
                                                            columnNumber: 21
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                    lineNumber: 692,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                lineNumber: 691,
                                                columnNumber: 15
                                            }, this),
                                            item.compatible_models && item.compatible_models.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mb-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs font-bold text-slate-700 dark:text-slate-300 mb-2",
                                                        children: isLao ? "ຮອງຮັບກັບລົດ (Compatible Models):" : "Compatible Vehicle Models:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                        lineNumber: 701,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-wrap gap-2",
                                                        children: item.compatible_models.map((model)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "px-2 py-1 text-xs font-semibold rounded bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-800",
                                                                children: model
                                                            }, model, false, {
                                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                lineNumber: 706,
                                                                columnNumber: 23
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                        lineNumber: 704,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                lineNumber: 700,
                                                columnNumber: 17
                                            }, this),
                                            hasWarranty && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mb-6 flex items-center gap-2 text-sm font-bold text-[#005BAC] dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 px-3.5 py-2 rounded-lg border border-blue-200 dark:border-blue-800 w-fit",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                        className: "w-4 h-4 text-[#005BAC]"
                                                    }, void 0, false, {
                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                        lineNumber: 715,
                                                        columnNumber: 20
                                                    }, this),
                                                    " ",
                                                    isLao ? "ຮັບປະກັນສິນຄ້າ 12 ເດືອນ (12-Month OEM Warranty)" : "12-Month OEM Warranty Guarantee"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                lineNumber: 714,
                                                columnNumber: 17
                                            }, this),
                                            (item.colors || item.sizes) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col gap-4 mb-4 pb-4 border-b border-slate-100 dark:border-white/5",
                                                children: [
                                                    item.colors && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-xs font-bold text-slate-700 dark:text-slate-300 mb-2",
                                                                children: isLao ? "ສີ (Color):" : "Color:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                lineNumber: 723,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex flex-wrap gap-2",
                                                                children: item.colors.map((color)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>setSelectedColor(color),
                                                                        className: `px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${selectedColor === color ? "bg-blue-50 dark:bg-blue-500/20 border-[#005BAC] text-[#005BAC] dark:text-blue-400 font-bold" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-blue-300"}`,
                                                                        children: color
                                                                    }, color, false, {
                                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                        lineNumber: 728,
                                                                        columnNumber: 27
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                lineNumber: 726,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                        lineNumber: 722,
                                                        columnNumber: 21
                                                    }, this),
                                                    item.sizes && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-xs font-bold text-slate-700 dark:text-slate-300 mb-2",
                                                                children: isLao ? "ຂະໜາດ (Size):" : "Size:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                lineNumber: 746,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex flex-wrap gap-2",
                                                                children: item.sizes.map((size)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>setSelectedSize(size),
                                                                        className: `px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${selectedSize === size ? "bg-blue-50 dark:bg-blue-500/20 border-[#005BAC] text-[#005BAC] dark:text-blue-400 font-bold" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-blue-300"}`,
                                                                        children: size
                                                                    }, size, false, {
                                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                        lineNumber: 751,
                                                                        columnNumber: 27
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                lineNumber: 749,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                        lineNumber: 745,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                lineNumber: 720,
                                                columnNumber: 17
                                            }, this),
                                            item.category === 'Forklifts' || item.category === 'Equipment Rental' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mb-4 bg-gradient-to-br from-amber-50/90 to-orange-50/90 dark:from-amber-950/40 dark:to-orange-950/30 rounded-xl p-3.5 border border-amber-200 dark:border-amber-800/50 shadow-sm",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-300 mb-1.5",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$alert$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldAlert$3e$__["ShieldAlert"], {
                                                                className: "w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0"
                                                            }, void 0, false, {
                                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                lineNumber: 773,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: isLao ? "ນະໂຍບາຍລາຄາສົ່ງ & ສ່ວນຫຼຸດໂຄງການອົງກອນ (Corporate Fleet Policy)" : "Corporate Fleet & Wholesale Policy"
                                                            }, void 0, false, {
                                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                lineNumber: 774,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                        lineNumber: 772,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-amber-800/90 dark:text-amber-300/90 leading-relaxed mb-2.5",
                                                        children: isLao ? "• ລາຄາສົ່ງ ແລະ ສ່ວນຫຼຸດພິເສດ: ໃຫ້ສະເພາະສິນຄ້າທີ່ຮ່ວມລາຍການເທົ່ານັ້ນ (ອາໄຫຼ່ ແລະ ອຸປະກອນສິ້ນເປືອງ).\n• ສຳລັບລົດຍົກ ແລະ ເຄື່ອງຈັກໜັກ: ຂໍສະຫງວນສິດລາຄາໂຄງການເປັນໄປຕາມທີ່ບໍລິສັດກຳນົດໄວ້." : "• Wholesale bulk pricing applies strictly to participating spare parts and consumables.\n• For forklifts and heavy machinery: company reserves project fleet terms per corporate policy."
                                                    }, void 0, false, {
                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                        lineNumber: 776,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                        onClick: ()=>{
                                                            setShowQuickView(false);
                                                            setShowRfq(true);
                                                        },
                                                        variant: "outline",
                                                        className: "w-full py-2 h-9 text-xs font-bold bg-white dark:bg-slate-900 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-950/50 flex items-center justify-center gap-1.5",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                                className: "w-3.5 h-3.5 text-amber-600 dark:text-amber-400"
                                                            }, void 0, false, {
                                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                lineNumber: 789,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: isLao ? "ຂໍໃບສະເໜີລາຄາໂຄງການ B2B (Request Project Quotation)" : "Request B2B Project Quotation"
                                                            }, void 0, false, {
                                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                lineNumber: 790,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                        lineNumber: 781,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                lineNumber: 771,
                                                columnNumber: 17
                                            }, this) : item.bulk_pricing && item.bulk_pricing.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mb-4 bg-slate-50 dark:bg-slate-950 rounded-xl p-3 border border-slate-200 dark:border-white/5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs font-bold text-slate-700 dark:text-slate-300 mb-2",
                                                        children: isLao ? "ລາຄາສົ່ງ (Bulk Pricing - ສະເພາະສິນຄ້າຮ່ວມລາຍການ):" : "Enterprise Wholesale Pricing (Participating Only):"
                                                    }, void 0, false, {
                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                        lineNumber: 796,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-1.5",
                                                        children: item.bulk_pricing.map((tier, idx)=>{
                                                            const tierPriceLAK = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$context$2f$CartContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateLAKPrice"])(tier.price, itemCurrency, item.category, exchangeRates);
                                                            const currSymbol = itemCurrency === 'USD' ? '$' : itemCurrency === 'LAK' ? '₭' : '฿';
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex justify-between items-center text-sm",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-slate-600 dark:text-slate-400 font-medium",
                                                                        children: [
                                                                            tier.min_qty,
                                                                            "+ units"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                        lineNumber: 805,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "text-right",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "font-bold text-[#E1251B] dark:text-red-400",
                                                                                children: [
                                                                                    tierPriceLAK.toLocaleString(),
                                                                                    " ₭"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                                lineNumber: 807,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-xs text-slate-400 ml-1.5 font-normal",
                                                                                children: [
                                                                                    "(",
                                                                                    currSymbol,
                                                                                    tier.price.toLocaleString(),
                                                                                    ")"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                                lineNumber: 810,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                        lineNumber: 806,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, idx, true, {
                                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                lineNumber: 804,
                                                                columnNumber: 27
                                                            }, this);
                                                        })
                                                    }, void 0, false, {
                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                        lineNumber: 799,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                lineNumber: 795,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col gap-3 mt-auto",
                                                children: [
                                                    !isRental && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-white/10",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>setQuantity(Math.max(1, quantity - 1)),
                                                                        className: "px-3 py-2 text-slate-600 dark:text-slate-400 hover:text-[#005BAC] dark:hover:text-blue-400 font-bold",
                                                                        children: "-"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                        lineNumber: 827,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "w-8 text-center text-sm font-bold text-slate-900 dark:text-white",
                                                                        children: quantity
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                        lineNumber: 831,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>setQuantity(quantity + 1),
                                                                        className: "px-3 py-2 text-slate-600 dark:text-slate-400 hover:text-[#005BAC] dark:hover:text-blue-400 font-bold",
                                                                        children: "+"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                        lineNumber: 832,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                lineNumber: 826,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-xs text-slate-400 font-medium",
                                                                children: isLao ? "ຈຳນວນທີ່ຕ້ອງການສັ່ງຊື້" : "Order Quantity"
                                                            }, void 0, false, {
                                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                lineNumber: 837,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                        lineNumber: 825,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: `flex gap-2 ${isRental ? 'flex-col sm:flex-row' : ''}`,
                                                        children: [
                                                            !isRental && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex gap-2 w-full mt-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                                        onClick: ()=>{
                                                                            handleAddToCart();
                                                                            setShowQuickView(false);
                                                                        },
                                                                        variant: "outline",
                                                                        className: "flex-1 border-2 border-[#005BAC] text-[#005BAC] hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl font-bold h-12 text-base",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__["ShoppingCart"], {
                                                                                className: "w-5 h-5 mr-2"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                                lineNumber: 854,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            " ",
                                                                            isLao ? "ໃສ່ກະຕ່າ" : "Add to Cart"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                        lineNumber: 846,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                                        onClick: ()=>{
                                                                            handleQuickBuy();
                                                                            setShowQuickView(false);
                                                                        },
                                                                        className: "flex-1 bg-[#E1251B] hover:bg-[#c91e15] text-white rounded-xl font-bold h-12 text-base shadow-lg shadow-red-500/25",
                                                                        children: isLao ? "ຊື້ເລີຍ" : "Buy Now"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                        lineNumber: 856,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                lineNumber: 845,
                                                                columnNumber: 21
                                                            }, this),
                                                            isRental && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                                onClick: ()=>{
                                                                    setShowQuickView(false);
                                                                    setShowRfq(true);
                                                                },
                                                                className: "w-full mt-2 bg-[#005BAC] hover:bg-[#00478a] text-white rounded-xl font-bold h-12 text-base shadow-lg shadow-blue-600/25",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                                        className: "w-5 h-5 mr-2"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                        lineNumber: 875,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    " ",
                                                                    isLao ? "ຈອງລົດ / ສອບຖາມ (Book / Inquire)" : "Book / Inquire Equipment"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                lineNumber: 868,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                        lineNumber: 843,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                        href: `https://wa.me/8562058929299?text=${encodeURIComponent(isLao ? `ສະບາຍດີ LUD/DK Lao, ຂ້າພະເຈົ້າສົນໃຈສິນຄ້າ:\n• ຊື່: ${displayName}\n• ລະຫັດ SKU: ${item.sku_code}\n• ຈຳນວນ: ${quantity} ອັນ\n• ລາຄາ: ${priceLAK.toLocaleString()} ₭\nຕ້ອງການສັ່ງຊື້ / ສອບຖາມຂໍ້ມູນເພີ່ມເຕີມ` : `Hello LUD/DK Lao, I am interested in:\n• Product: ${displayName}\n• SKU: ${item.sku_code}\n• Qty: ${quantity}\n• Price: ${priceLAK.toLocaleString()} LAK\nI would like to order / inquire further.`)}`,
                                                        target: "_blank",
                                                        rel: "noopener noreferrer",
                                                        className: "w-full mt-2 h-11 rounded-xl text-sm font-bold bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center gap-2 transition-all shadow-md shadow-green-600/25",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"], {
                                                                className: "w-4 h-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                lineNumber: 891,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: isLao ? "ສັ່ງຊື້ / ຖາມຜ່ານ WhatsApp (020 5892 9299)" : "Direct WhatsApp Order (020 5892 9299)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                lineNumber: 892,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                        lineNumber: 881,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                lineNumber: 823,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                        lineNumber: 597,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                lineNumber: 525,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-full p-4 md:p-5 rounded-2xl bg-gradient-to-r from-blue-950/70 via-slate-900/80 to-indigo-950/70 border border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-start gap-3.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0 mt-0.5",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                                    className: "w-5 h-5"
                                                }, void 0, false, {
                                                    fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                    lineNumber: 902,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                lineNumber: 901,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-wrap items-center gap-2 mb-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "px-2 py-0.5 rounded bg-blue-500 text-white text-[10px] font-black uppercase tracking-wider",
                                                                children: "360° FLEET SYNERGY"
                                                            }, void 0, false, {
                                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                lineNumber: 906,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-xs font-bold text-blue-300",
                                                                children: isLao ? "ໂຄງສ້າງການບໍລິຫານ & ບໍລິການຄົບວົງຈອນ" : "Integrated Fleet & Service"
                                                            }, void 0, false, {
                                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                lineNumber: 909,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                        lineNumber: 905,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                        className: "text-sm md:text-base font-black text-white",
                                                        children: isLao ? "ຕ້ອງການເຊົ່າໄລຍະຍາວ 0 CAPEX ຫຼື ສັ່ງອາໄຫຼ່ພ້ອມຊ່າງ PM ລົງຕິດຕັ້ງເຖິງໂຮງງານ?" : "Prefer 0 CAPEX Long-Term Lease or Spare Parts with On-Site PM Installation?"
                                                    }, void 0, false, {
                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                        lineNumber: 913,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-slate-300 mt-1 leading-relaxed",
                                                        children: isLao ? "DK LAO ໃຫ້ບໍລິການທີມຊ່າງເຄື່ອນທີ່ Mobile Service, ຕັ້ງຕູ້ສະຕັອກ Consignment, ແລະ ໃບແຈ້ງໜີ້ລວມ B2B." : "DK LAO offers Rapid Mobile Service SLAs, On-site Plant Consignment Depots, and Unified Enterprise B2B Billing."
                                                    }, void 0, false, {
                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                        lineNumber: 918,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                lineNumber: 904,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                        lineNumber: 900,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 w-full sm:w-auto shrink-0",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            href: `/${locale}/services#management-ecosystem`,
                                            className: "w-full sm:w-auto px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-600/30",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: isLao ? "ສຳຫຼວດລະບົບ 360°" : "Explore 360°"
                                                }, void 0, false, {
                                                    fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                    lineNumber: 931,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                    className: "w-3.5 h-3.5"
                                                }, void 0, false, {
                                                    fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                    lineNumber: 932,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                            lineNumber: 927,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                        lineNumber: 926,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                lineNumber: 899,
                                columnNumber: 11
                            }, this),
                            item.specs && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden mt-6 shadow-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-white/10 flex items-center justify-between flex-wrap gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2.5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "p-1.5 rounded-lg bg-blue-500/10 text-[#005BAC] dark:text-blue-400",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$vertical$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sliders$3e$__["Sliders"], {
                                                            className: "w-4 h-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                            lineNumber: 943,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                        lineNumber: 942,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "text-base font-bold text-slate-900 dark:text-white",
                                                        children: isLao ? "ຄຸນລັກສະນະສະເພາະ (Technical Specifications)" : "Technical Specifications"
                                                    }, void 0, false, {
                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                        lineNumber: 945,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                lineNumber: 941,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[11px] font-bold text-[#005BAC] dark:text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20",
                                                        children: isLao ? "ມາດຕະຖານໂຮງງານ 100%" : "100% Certified"
                                                    }, void 0, false, {
                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                        lineNumber: 950,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20",
                                                        children: isLao ? "PDI 30-Point Checked" : "PDI Verified"
                                                    }, void 0, false, {
                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                        lineNumber: 953,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                lineNumber: 949,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                        lineNumber: 940,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "divide-y divide-slate-100 dark:divide-white/5",
                                        children: [
                                            Object.entries(item.specs).filter(([key])=>!key.toLowerCase().includes('warranty') && !key.toLowerCase().includes('ຮັບປະກັນ') && !key.toLowerCase().includes('lead') && !key.toLowerCase().includes('ຈັດສົ່ງ')).map(([key, val], idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `flex flex-col sm:flex-row px-6 py-3.5 transition-colors hover:bg-blue-50/20 dark:hover:bg-blue-950/10 ${idx % 2 === 0 ? 'bg-slate-50/40 dark:bg-slate-800/30' : 'bg-white dark:bg-slate-900'}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "sm:w-5/12 text-sm text-slate-600 dark:text-slate-400 font-semibold mb-1 sm:mb-0 flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "w-1.5 h-1.5 rounded-full bg-[#005BAC]"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                    lineNumber: 969,
                                                                    columnNumber: 23
                                                                }, this),
                                                                formatSpecKey(key, isLao)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                            lineNumber: 968,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "sm:w-7/12 text-sm font-bold text-slate-900 dark:text-white",
                                                            children: val
                                                        }, void 0, false, {
                                                            fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                            lineNumber: 972,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, key, true, {
                                                    fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                    lineNumber: 962,
                                                    columnNumber: 19
                                                }, this)),
                                            hasWarranty && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col sm:flex-row px-6 py-3.5 bg-blue-50/40 dark:bg-blue-950/20 transition-colors",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "sm:w-5/12 text-sm text-[#005BAC] dark:text-blue-400 font-semibold mb-1 sm:mb-0 flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "w-1.5 h-1.5 rounded-full bg-[#005BAC]"
                                                            }, void 0, false, {
                                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                lineNumber: 982,
                                                                columnNumber: 23
                                                            }, this),
                                                            isLao ? "ການຮັບປະກັນ (Warranty Guarantee)" : "Warranty Guarantee"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                        lineNumber: 981,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "sm:w-7/12 text-sm font-bold text-[#005BAC] dark:text-blue-300 flex items-center gap-1.5",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                                className: "w-4 h-4 text-[#005BAC]"
                                                            }, void 0, false, {
                                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                lineNumber: 986,
                                                                columnNumber: 23
                                                            }, this),
                                                            isLao ? "ຮັບປະກັນສິນຄ້າແທ້ 12 ເດືອນ (12 Months OEM Warranty)" : "12 Months OEM Factory Warranty"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                        lineNumber: 985,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                lineNumber: 980,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col sm:flex-row px-6 py-3.5 bg-blue-50/30 dark:bg-blue-950/10 transition-colors",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "sm:w-5/12 text-sm text-[#005BAC] dark:text-blue-400 font-semibold mb-1 sm:mb-0 flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "w-1.5 h-1.5 rounded-full bg-[#005BAC]"
                                                            }, void 0, false, {
                                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                lineNumber: 994,
                                                                columnNumber: 21
                                                            }, this),
                                                            isLao ? "ກຳນົດເວລາຈັດສົ່ງ (Delivery Lead Time)" : "Delivery Lead Time"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                        lineNumber: 993,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "sm:w-7/12 text-sm font-bold text-[#005BAC] dark:text-blue-300 flex items-center gap-1.5",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                                className: "w-4 h-4 text-[#005BAC]"
                                                            }, void 0, false, {
                                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                lineNumber: 998,
                                                                columnNumber: 21
                                                            }, this),
                                                            getLeadTimeBusiness(item.lead_time, isLao)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                        lineNumber: 997,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                lineNumber: 992,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                        lineNumber: 958,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                lineNumber: 939,
                                columnNumber: 13
                            }, this),
                            relatedProducts.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-full mt-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-xl font-bold text-slate-900 dark:text-white mb-4",
                                        children: isLao ? "ສິນຄ້າທີ່ມັກຊື້ຄູ່ກັນ (Frequently Bought Together)" : "Frequently Bought Together"
                                    }, void 0, false, {
                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                        lineNumber: 1009,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4",
                                        children: relatedProducts.map((rel)=>{
                                            const relName = (isLao ? rel.part_name_lo || rel.part_name : rel.part_name || rel.part_name_lo) || rel.sku_code || 'Product';
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex gap-4 p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 hover:border-[#005BAC]/50 hover:shadow-md transition-all cursor-pointer",
                                                onClick: ()=>{
                                                    // In a real app we might navigate to the product detail page, but for now we close the modal to let user click the new item from the store.
                                                    setShowQuickView(false);
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-white",
                                                        children: rel.image_url ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                            src: rel.image_url,
                                                            alt: relName,
                                                            fill: true,
                                                            className: "object-cover"
                                                        }, void 0, false, {
                                                            fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                            lineNumber: 1022,
                                                            columnNumber: 27
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                                            className: "w-8 h-8 m-auto text-slate-400 absolute inset-0"
                                                        }, void 0, false, {
                                                            fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                            lineNumber: 1024,
                                                            columnNumber: 27
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                        lineNumber: 1020,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-col justify-center",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                className: "text-sm font-bold text-slate-900 dark:text-white line-clamp-2",
                                                                children: relName
                                                            }, void 0, false, {
                                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                lineNumber: 1028,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-[#E1251B] dark:text-red-400 font-bold mt-1 text-sm",
                                                                children: [
                                                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$context$2f$CartContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateLAKPrice"])(Number(rel.unit_price), rel.currency, rel.category).toLocaleString(),
                                                                    " ₭"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                                lineNumber: 1031,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                        lineNumber: 1027,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, rel.sku_id, true, {
                                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                                lineNumber: 1016,
                                                columnNumber: 21
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                        lineNumber: 1012,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                                lineNumber: 1008,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/storefront/components/store/ProductCard.tsx",
                        lineNumber: 524,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                lineNumber: 507,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$components$2f$store$2f$RFQModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RFQModal"], {
                item: item,
                isOpen: showRfq,
                onClose: ()=>setShowRfq(false)
            }, void 0, false, {
                fileName: "[project]/storefront/components/store/ProductCard.tsx",
                lineNumber: 1046,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/storefront/components/store/ProductCard.tsx",
        lineNumber: 277,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=storefront_components_store_ProductCard_tsx_1-72ogi._.js.map