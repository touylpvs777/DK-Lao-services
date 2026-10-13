(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/storefront/actions/data:63b595 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "placeOrder",
    ()=>$$RSC_SERVER_ACTION_0
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storefront/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"403f31033dde3c4242654c6124f363a086b8e60900":{"name":"placeOrder"}},"storefront/actions/order.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("403f31033dde3c4242654c6124f363a086b8e60900", __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "placeOrder");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/storefront/context/CartContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CartProvider",
    ()=>CartProvider,
    "DEFAULT_EXCHANGE_RATES",
    ()=>DEFAULT_EXCHANGE_RATES,
    "FACTORY_MARKUP_PERCENT",
    ()=>FACTORY_MARKUP_PERCENT,
    "FACTORY_MARKUP_RATE",
    ()=>FACTORY_MARKUP_RATE,
    "MARKUP_RATE",
    ()=>MARKUP_RATE,
    "THB_TO_LAK_RATE",
    ()=>THB_TO_LAK_RATE,
    "USD_TO_LAK_RATE",
    ()=>USD_TO_LAK_RATE,
    "calculateLAKPrice",
    ()=>calculateLAKPrice,
    "calculateRetailForeignPrice",
    ()=>calculateRetailForeignPrice,
    "getApplicablePrice",
    ()=>getApplicablePrice,
    "getProductPricingParameters",
    ()=>getProductPricingParameters,
    "useCart",
    ()=>useCart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storefront/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storefront/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
const DEFAULT_EXCHANGE_RATES = {
    THB: 650,
    USD: 22000,
    lastUpdated: "ມື້ນີ້ (Real-time Online Feed)",
    source: "BCEL & Commercial FX Market Reference"
};
const USD_TO_LAK_RATE = DEFAULT_EXCHANGE_RATES.USD;
const THB_TO_LAK_RATE = DEFAULT_EXCHANGE_RATES.THB;
const FACTORY_MARKUP_PERCENT = 65; // Strictly 65% factory profit markup (as mandated by user)
const FACTORY_MARKUP_RATE = 1.65; // 1 + 0.65 = 1.65 (Strictly 65% profit markup)
const MARKUP_RATE = FACTORY_MARKUP_RATE;
function getProductPricingParameters(category, unitPrice = 0, currency = 'THB') {
    return {
        freightFactor: 0.0,
        marginPercent: 65,
        markupFactor: 1.65
    };
}
const calculateRetailForeignPrice = (factoryPrice, currency = 'THB')=>{
    if (currency === 'LAK') return Math.round(factoryPrice);
    return Math.round(factoryPrice * FACTORY_MARKUP_RATE);
};
const calculateLAKPrice = (price, currency = 'THB', category, rates = DEFAULT_EXCHANGE_RATES)=>{
    if (currency === 'LAK') {
        // Already in Lao Kip
        return Math.round(price);
    }
    let baseLak = 0;
    const thbRate = rates?.THB || DEFAULT_EXCHANGE_RATES.THB;
    const usdRate = rates?.USD || DEFAULT_EXCHANGE_RATES.USD;
    if (currency === 'THB') {
        baseLak = price * thbRate;
    } else if (currency === 'USD') {
        baseLak = price * usdRate;
    } else {
        baseLak = price * thbRate;
    }
    // Strictly +65% Factory Markup (1.65x)
    return Math.round(baseLak * FACTORY_MARKUP_RATE);
};
const getApplicablePrice = (item)=>{
    if (!item.bulk_pricing || item.bulk_pricing.length === 0) return item.unit_price;
    // Find highest applicable qty tier
    const sortedTiers = [
        ...item.bulk_pricing
    ].sort((a, b)=>b.min_qty - a.min_qty);
    for (const tier of sortedTiers){
        if (item.quantity >= tier.min_qty) {
            return tier.price;
        }
    }
    return item.unit_price;
};
const CartContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function CartProvider({ children }) {
    _s();
    const [items, setItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isInitialized, setIsInitialized] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [rates, setRates] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(DEFAULT_EXCHANGE_RATES);
    const [isAdminMode, setIsAdminModeState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Load cart, rates, and adminMode from LocalStorage on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CartProvider.useEffect": ()=>{
            try {
                const savedCart = localStorage.getItem("lud_shopping_cart");
                if (savedCart) {
                    setItems(JSON.parse(savedCart));
                }
                const savedRates = localStorage.getItem("lud_exchange_rates");
                if (savedRates) {
                    setRates(JSON.parse(savedRates));
                }
                // Admin mode must ALWAYS default to false for public customers.
                // We only check temporary sessionStorage for authorized staff during active session,
                // and explicitly remove any legacy localStorage keys to prevent accidental leaks.
                localStorage.removeItem("lud_admin_pricing_mode");
                const sessionAdmin = sessionStorage.getItem("lud_admin_pricing_mode");
                if (sessionAdmin === "true") {
                    setIsAdminModeState(true);
                } else {
                    setIsAdminModeState(false);
                }
            } catch (e) {
                console.error("Failed to load cart/rates from storage", e);
            } finally{
                setIsInitialized(true);
            }
        }
    }["CartProvider.useEffect"], []);
    const setAdminMode = (val)=>{
        setIsAdminModeState(val);
        try {
            if (val) {
                sessionStorage.setItem("lud_admin_pricing_mode", "true");
            } else {
                sessionStorage.removeItem("lud_admin_pricing_mode");
                localStorage.removeItem("lud_admin_pricing_mode");
            }
        } catch (e) {}
    };
    const toggleAdminMode = ()=>{
        setAdminMode(!isAdminMode);
    };
    const updateRates = (newRates)=>{
        setRates((prev)=>{
            const updated = {
                ...prev,
                ...newRates,
                lastUpdated: "ອັບເດດລ່າສຸດ (Online Live Rate)"
            };
            try {
                localStorage.setItem("lud_exchange_rates", JSON.stringify(updated));
            } catch (e) {}
            return updated;
        });
    };
    // Save cart to LocalStorage when items change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CartProvider.useEffect": ()=>{
            if (!isInitialized) return;
            try {
                localStorage.setItem("lud_shopping_cart", JSON.stringify(items));
            } catch (e) {
                console.error("Failed to save cart to localStorage", e);
            }
        }
    }["CartProvider.useEffect"], [
        items,
        isInitialized
    ]);
    const openCart = ()=>setIsOpen(true);
    const closeCart = ()=>setIsOpen(false);
    const openCheckout = ()=>{
        setIsOpen(false);
        setIsCheckoutOpen(true);
    };
    const closeCheckout = ()=>setIsCheckoutOpen(false);
    const addToCart = (product, qty = 1)=>{
        setItems((prev)=>{
            const existing = prev.find((item)=>item.sku_id === product.sku_id);
            if (existing) {
                const newQty = Math.min(existing.quantity + qty, product.qty_on_hand > 0 ? product.qty_on_hand : 99);
                return prev.map((item)=>item.sku_id === product.sku_id ? {
                        ...item,
                        quantity: newQty
                    } : item);
            } else {
                const newItem = {
                    sku_id: product.sku_id,
                    sku_code: product.sku_code,
                    part_name: product.part_name,
                    part_name_lo: product.part_name_lo || product.part_name,
                    category: product.category || "Industrial Parts",
                    unit_price: Number(product.unit_price),
                    currency: product.currency || 'THB',
                    quantity: Math.min(qty, product.qty_on_hand > 0 ? product.qty_on_hand : 1),
                    image_url: product.image_url,
                    qty_on_hand: product.qty_on_hand,
                    bulk_pricing: product.bulk_pricing
                };
                return [
                    ...prev,
                    newItem
                ];
            }
        });
        setIsOpen(true);
    };
    const removeFromCart = (sku_id)=>{
        setItems((prev)=>prev.filter((item)=>item.sku_id !== sku_id));
    };
    const updateQuantity = (sku_id, quantity)=>{
        if (quantity <= 0) {
            removeFromCart(sku_id);
            return;
        }
        setItems((prev)=>prev.map((item)=>{
                if (item.sku_id === sku_id) {
                    const maxAllowed = item.qty_on_hand > 0 ? item.qty_on_hand : 99;
                    return {
                        ...item,
                        quantity: Math.min(quantity, maxAllowed)
                    };
                }
                return item;
            }));
    };
    const clearCart = ()=>{
        setItems([]);
    };
    const totalItems = items.reduce((sum, item)=>sum + item.quantity, 0);
    const totalUSD = items.reduce((sum, item)=>{
        return item.currency === 'USD' ? sum + getApplicablePrice(item) * item.quantity : sum;
    }, 0);
    const totalTHB = items.reduce((sum, item)=>{
        return item.currency === 'THB' ? sum + getApplicablePrice(item) * item.quantity : sum;
    }, 0);
    const totalLAK = items.reduce((sum, item)=>{
        const applicablePrice = getApplicablePrice(item);
        return sum + calculateLAKPrice(applicablePrice, item.currency, item.category, rates) * item.quantity;
    }, 0);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CartContext.Provider, {
        value: {
            items,
            isOpen,
            isCheckoutOpen,
            openCart,
            closeCart,
            openCheckout,
            closeCheckout,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            totalItems,
            totalUSD,
            totalTHB,
            totalLAK,
            exchangeRates: rates,
            updateRates,
            isAdminMode,
            setAdminMode,
            toggleAdminMode
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/storefront/context/CartContext.tsx",
        lineNumber: 285,
        columnNumber: 5
    }, this);
}
_s(CartProvider, "UOyM4s23EHHyWoSx0R/nuQPqxjw=");
_c = CartProvider;
function useCart() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
_s1(useCart, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "CartProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/storefront/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storefront/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storefront/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=storefront_05l8r-l._.js.map