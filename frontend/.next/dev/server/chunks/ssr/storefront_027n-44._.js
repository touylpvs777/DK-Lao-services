module.exports = [
"[project]/storefront/.next-internal/server/app/store/page/actions.js { ACTIONS_MODULE0 => \"[project]/storefront/actions/store.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "00f44a6eeb83526a9cdd600a7efaca1704a5452694",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$actions$2f$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchRentals"],
    "6067211817e0b56a86ff52a693ab44eaf1a8c58a09",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$actions$2f$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchInventory"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f2e$next$2d$internal$2f$server$2f$app$2f$store$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$storefront$2f$actions$2f$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/storefront/.next-internal/server/app/store/page/actions.js { ACTIONS_MODULE0 => "[project]/storefront/actions/store.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$actions$2f$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storefront/actions/store.ts [app-rsc] (ecmascript)");
}),
"[project]/storefront/.next-internal/server/app/store/page/actions.js { ACTIONS_MODULE0 => \"[project]/storefront/actions/store.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$actions$2f$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storefront/actions/store.ts [app-rsc] (ecmascript)");
;
;
}),
"[project]/storefront/actions/store.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"00f44a6eeb83526a9cdd600a7efaca1704a5452694":{"name":"fetchRentals"},"6067211817e0b56a86ff52a693ab44eaf1a8c58a09":{"name":"fetchInventory"}},"storefront/actions/store.ts",""] */ __turbopack_context__.s([
    "fetchInventory",
    ()=>fetchInventory,
    "fetchRentals",
    ()=>fetchRentals
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storefront/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@/data/catalog'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storefront/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1` : 'http://localhost:8000/api/v1';
async function fetchInventory(skip = 0, limit = 100) {
    try {
        const response = await fetch(`${API_BASE_URL}/wms/inventory?skip=${skip}&limit=${limit}`, {
            next: {
                revalidate: 30
            },
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            return INITIAL_CATALOG;
        }
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
            // Merge with enriched catalog metadata if API returns basic records
            return data.map((item, idx)=>{
                const enriched = INITIAL_CATALOG.find((c)=>c.sku_code === item.sku_code) || INITIAL_CATALOG[idx % INITIAL_CATALOG.length];
                return {
                    ...enriched,
                    ...item,
                    unit_price: Number(item.unit_price || enriched.unit_price),
                    original_price: item.original_price ? Number(item.original_price) : enriched.original_price,
                    qty_on_hand: Number(item.qty_on_hand ?? enriched.qty_on_hand),
                    image_url: item.image_url || enriched.image_url
                };
            });
        }
        return INITIAL_CATALOG;
    } catch (error) {
        return INITIAL_CATALOG;
    }
}
async function fetchRentals() {
    // Can be extended to fetch from API later
    const { RENTAL_CATALOG } = await Promise.resolve().then(()=>{
        const e = new Error("Cannot find module '@/data/catalog'");
        e.code = 'MODULE_NOT_FOUND';
        throw e;
    });
    return RENTAL_CATALOG;
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    fetchInventory,
    fetchRentals
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(fetchInventory, "6067211817e0b56a86ff52a693ab44eaf1a8c58a09", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(fetchRentals, "00f44a6eeb83526a9cdd600a7efaca1704a5452694", null);
}),
"[project]/storefront/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// This function ensures that all the exported values are valid server actions,
// during the runtime. By definition all actions are required to be async
// functions, but here we can only check that they are functions.
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ensureServerEntryExports", {
    enumerable: true,
    get: function() {
        return ensureServerEntryExports;
    }
});
function ensureServerEntryExports(actions) {
    for(let i = 0; i < actions.length; i++){
        const action = actions[i];
        if (typeof action !== 'function') {
            throw Object.defineProperty(new Error(`A "use server" file can only export async functions, found ${typeof action}.\nRead more: https://nextjs.org/docs/messages/invalid-use-server-value`), "__NEXT_ERROR_CODE", {
                value: "E352",
                enumerable: false,
                configurable: true
            });
        }
    }
}
}),
"[project]/storefront/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/* eslint-disable import/no-extraneous-dependencies */ Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "registerServerReference", {
    enumerable: true,
    get: function() {
        return _server.registerServerReference;
    }
});
const _server = __turbopack_context__.r("[project]/storefront/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=storefront_027n-44._.js.map