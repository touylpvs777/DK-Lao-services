module.exports = [
"[project]/storefront/.next-internal/server/app/store/page/actions.js { ACTIONS_MODULE0 => \"[project]/storefront/actions/store.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/storefront/actions/order.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "00f44a6eeb83526a9cdd600a7efaca1704a5452694",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$actions$2f$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchRentals"],
    "403f31033dde3c4242654c6124f363a086b8e60900",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$actions$2f$order$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["placeOrder"],
    "6067211817e0b56a86ff52a693ab44eaf1a8c58a09",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$actions$2f$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchInventory"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f2e$next$2d$internal$2f$server$2f$app$2f$store$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$storefront$2f$actions$2f$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$storefront$2f$actions$2f$order$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/storefront/.next-internal/server/app/store/page/actions.js { ACTIONS_MODULE0 => "[project]/storefront/actions/store.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/storefront/actions/order.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$actions$2f$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storefront/actions/store.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$actions$2f$order$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storefront/actions/order.ts [app-rsc] (ecmascript)");
}),
"[project]/storefront/.next-internal/server/app/store/page/actions.js { ACTIONS_MODULE0 => \"[project]/storefront/actions/store.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/storefront/actions/order.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$actions$2f$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storefront/actions/store.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$actions$2f$order$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storefront/actions/order.ts [app-rsc] (ecmascript)");
;
;
;
}),
"[project]/storefront/actions/order.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"403f31033dde3c4242654c6124f363a086b8e60900":{"name":"placeOrder"}},"storefront/actions/order.ts",""] */ __turbopack_context__.s([
    "placeOrder",
    ()=>placeOrder
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storefront/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/storefront/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1` : 'http://localhost:8000/api/v1';
async function placeOrder(input) {
    try {
        const timestamp = Date.now();
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        const orderNumber = `LUD-ORD-${randomSuffix}`;
        // Format WhatsApp message for Lao customer service
        const paymentLabel = {
            BCEL_ONE_QR: "BCEL One QR Code (ໂອນແລ້ວ)",
            BANK_TRANSFER: "ໂອນຜ່ານບັນຊີທະນາຄານ (Bank Transfer)",
            CASH_ON_DELIVERY: "ເກັບເງິນປາຍທາງ (Cash on Delivery)",
            B2B_PO: "ຂໍໃບສະເໜີລາຄາ / Purchase Order (B2B)"
        }[input.payment_method];
        const itemsSummary = input.items.map((i, idx)=>`${idx + 1}. *${i.part_name}* (${i.sku_code})\n   ຈຳນວນ: ${i.quantity} x $${i.unit_price.toLocaleString()} = *$${i.subtotal.toLocaleString()}*`).join("\n");
        const messageText = `📦 *ແຈ້ງການສັ່ງຊື້ສິນຄ້າໃໝ່ (New Order)*\n` + `━━━━━━━━━━━━━━━━━━\n` + `🔖 *ເລກທີ Order:* ${orderNumber}\n` + `👤 *ລູກຄ້າ:* ${input.customer_name}\n` + `📞 *ເບີໂທ:* ${input.phone_number}\n` + `📍 *ສະຖານທີ່ຈັດສົ່ງ:* ${input.delivery_address} ${input.district ? `(${input.district}, ${input.province})` : ""}\n` + `💳 *ວິທີຊຳລະ:* ${paymentLabel}\n` + `🚚 *ຮູບແບບ:* ສິນຄ້ານຳເຂົ້າຕາມອໍເດີ (Pre-Order ຈັດສົ່ງ 30-120 ວັນ)\n` + `━━━━━━━━━━━━━━━━━━\n` + `📋 *ລາຍການສິນຄ້າ:*\n${itemsSummary}\n` + `━━━━━━━━━━━━━━━━━━\n` + `💵 *ຍອດລວມ (USD):* $${input.total_usd.toLocaleString('en-US', {
            minimumFractionDigits: 2
        })}\n` + `🇱🇦 *ຍອດລວມ (LAK):* ${input.total_lak.toLocaleString()} ກີບ\n` + `${input.tax_company_name ? `🏢 *ອອກໃບກຳກັບພາສີໃນນາມ:* ${input.tax_company_name}\n` : ""}` + `${input.tax_id ? `📝 *ເລກປະຈຳຕົວຜູ້ເສຍພາສີ:* ${input.tax_id}\n` : ""}` + `${input.notes ? `📝 *ໝາຍເຫດ:* ${input.notes}\n` : ""}` + `━━━━━━━━━━━━━━━━━━\n` + `_ສົ່ງຈາກລະບົບ LUD Storefront Official_`;
        // Lao Customer Service Admin WhatsApp number (or company contact)
        const adminWhatsApp = "8562058929299";
        const whatsappUrl = `https://wa.me/${adminWhatsApp}?text=${encodeURIComponent(messageText)}`;
        // Try posting to Backend API if available
        try {
            await fetch(`${API_BASE_URL}/bookings/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    booking_date: new Date().toISOString(),
                    status: "PENDING",
                    notes: JSON.stringify({
                        order_number: orderNumber,
                        customer_name: input.customer_name,
                        phone_number: input.phone_number,
                        delivery_address: input.delivery_address,
                        payment_method: input.payment_method,
                        total_usd: input.total_usd,
                        total_lak: input.total_lak,
                        items: input.items,
                        tax_company_name: input.tax_company_name,
                        tax_id: input.tax_id
                    })
                })
            });
        } catch (apiErr) {
            console.warn("Backend API booking log skipped:", apiErr);
        }
        return {
            success: true,
            order_id: `ord_${timestamp}`,
            order_number: orderNumber,
            message: "ການສັ່ງຊື້ຂອງທ່ານສຳເລັດແລ້ວ! ທີມງານຈະຕິດຕໍ່ກັບພາຍໃນ 15 ນາທີ.",
            whatsapp_url: whatsappUrl,
            data: {
                orderNumber,
                customerName: input.customer_name,
                phone: input.phone_number,
                totalUSD: input.total_usd,
                totalLAK: input.total_lak,
                items: input.items,
                paymentMethod: input.payment_method
            }
        };
    } catch (error) {
        console.error("Place order failed:", error);
        return {
            success: false,
            order_id: "",
            order_number: "",
            message: error?.message || "ບໍ່ສາມາດດຳເນີນການສັ່ງຊື້ໄດ້, ກະລຸນາລອງໃໝ່ອີກຄັ້ງ."
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    placeOrder
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$storefront$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(placeOrder, "403f31033dde3c4242654c6124f363a086b8e60900", null);
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

//# sourceMappingURL=storefront_1el3suz._.js.map