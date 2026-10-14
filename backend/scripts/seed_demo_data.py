"""
Seed linked demo data across every module through the public REST API, so all
business rules, numbering and workflow transitions run exactly as they do for a
real user (nothing is inserted behind the application's back).

    cd backend
    .\\venv\\Scripts\\python.exe scripts\\seed_demo_data.py                # backend on :8001
    .\\venv\\Scripts\\python.exe scripts\\seed_demo_data.py --base http://host:8001/api/v1 --user admin --password ...

What gets created (all customers are fictional and tagged "[DEMO]" in notes):
  brands -> categories -> catalog products -> spare parts (linked to products)
  -> vendors -> purchase order received into stock
  customers -> leads -> forklifts
  Sales chain : quotation -> sales order -> delivery note (stock issued)
                -> invoice -> payment -> allocation
  Rental chain: quotation -> rental contract -> billing cycle -> invoice
  Service     : maintenance plan -> work order -> completed

Refuses to run on a database that already has customers unless --force is given.
"""
import argparse
import sys
from datetime import date, timedelta

import httpx

TODAY = date.today()
d = lambda n=0: (TODAY + timedelta(days=n)).isoformat()  # noqa: E731

ap = argparse.ArgumentParser()
ap.add_argument("--base", default="http://localhost:8001/api/v1")
ap.add_argument("--user", default="admin")
ap.add_argument("--password", default="admin123")
ap.add_argument("--force", action="store_true")
args = ap.parse_args()

c = httpx.Client(base_url=args.base, timeout=60)
failures: list[str] = []


def call(method: str, path: str, body=None, *, label: str | None = None, params=None):
    r = c.request(method, path, json=body, params=params)
    if r.status_code >= 300:
        failures.append(f"{label or path}: {r.status_code} {r.text[:200]}")
        print(f"  FAIL {label or path}: {r.status_code} {r.text[:160]}")
        return None
    return r.json() if r.content else {}


def post(path, body=None, label=None):
    return call("POST", path, body if body is not None else {}, label=label)


def step(title: str):
    print(f"\n== {title}")


# ── login ────────────────────────────────────────────────────────────────────
tok = c.post("/auth/login", json={"username": args.user, "password": args.password})
if tok.status_code != 200:
    sys.exit(f"Login failed ({tok.status_code}): {tok.text[:200]}")
c.headers["Authorization"] = f"Bearer {tok.json()['access_token']}"

existing = c.get("/customers/").json()
n_existing = existing.get("total", len(existing)) if isinstance(existing, dict) else len(existing)
if n_existing and not args.force:
    sys.exit(f"Database already has {n_existing} customer(s); use --force to seed anyway.")

# ── brands / categories / products ──────────────────────────────────────────
step("Brands, categories, products")
brand = {}
for name, role, country in [
    ("Mitsubishi", "both", "Japan"), ("Jungheinrich", "both", "Germany"),
    ("Toyota", "both", "Japan"), ("Nilfisk", "primary", "Denmark"),
    ("Hella", "parts_only", "Germany"),
]:
    brand[name] = (post("/catalog/brands/", {"name": name, "brand_role": role, "country": country}, f"brand {name}") or {}).get("id")

cat = {}
for key, en, lo, parent in [
    ("forklift", "Forklifts", "ລົດຟອກລິບ", None),
    ("diesel", "Diesel Forklifts", "ລົດຟອກລິບດີເຊວ", "forklift"),
    ("electric", "Electric Forklifts", "ລົດຟອກລິບໄຟຟ້າ", "forklift"),
    ("parts", "Spare Parts", "ອາໄຫຼ່", None),
    ("filters", "Filters", "ໄສ້ກອງ", "parts"),
    ("tires", "Tires", "ຢາງ", "parts"),
    ("service", "Services", "ບໍລິການ", None),
]:
    body = {"name_en": en, "name_lo": lo}
    if parent:
        body["parent_id"] = cat.get(parent)
    cat[key] = (post("/catalog/categories/", body, f"category {en}") or {}).get("id")

prod = {}
for key, en, lo, b, ck, model, sale, rental, svc in [
    ("fd30", "Mitsubishi FD30 Diesel Forklift 3.0t", "ລົດຟອກລິບ Mitsubishi FD30 3.0 ໂຕນ", "Mitsubishi", "diesel", "FD30", True, True, False),
    ("fb20", "Mitsubishi FB20 Electric Forklift 2.0t", "ລົດຟອກລິບໄຟຟ້າ Mitsubishi FB20 2.0 ໂຕນ", "Mitsubishi", "electric", "FB20", True, True, False),
    ("efg", "Jungheinrich EFG 320 Electric Forklift", "ລົດຟອກລິບໄຟຟ້າ Jungheinrich EFG 320", "Jungheinrich", "electric", "EFG320", True, False, False),
    ("oilf", "Engine Oil Filter", "ໄສ້ກອງນ້ຳມັນເຄື່ອງ", "Toyota", "filters", "OF-100", True, False, False),
    ("airf", "Air Filter", "ໄສ້ກອງອາກາດ", "Toyota", "filters", "AF-200", True, False, False),
    ("tire", "Solid Tire 28x9-15", "ຢາງຕັນ 28x9-15", "Mitsubishi", "tires", "ST-2891", True, False, False),
    ("pm", "Preventive Maintenance Service", "ບໍລິການບຳລຸງຮັກສາຕາມລະດັບ", None, "service", "PM-24", False, False, True),
]:
    prod[key] = (post("/catalog/products/", {
        "name_en": en, "name_lo": lo, "brand_id": brand.get(b) if b else None, "category_id": cat.get(ck),
        "model_number": model, "is_sale": sale, "is_rental": rental, "is_service_item": svc, "is_active": True,
    }, f"product {en}") or {}).get("id")

# ── warehouse / vendors / spare parts / purchase order ──────────────────────
step("Warehouse, vendors, spare parts, goods receipt")
whs = call("GET", "/inventory/warehouses") or []
wh_id = whs[0]["id"] if whs else (post("/inventory/warehouses", {"code": "WH-MAIN", "name": "Main Warehouse"}) or {}).get("id")

vendor = {}
for key, name, phone in [("v1", "Asia Forklift Parts Co., Ltd.", "+856 21 000 101"), ("v2", "Indochina Tyre Supply", "+856 21 000 102")]:
    vendor[key] = (post("/partners", {"name": name, "partner_type": "vendor", "phone": phone}, f"vendor {name}") or {}).get("id")

part = {}
for key, pn, nm, pc, pk, price, mn in [
    ("oilf", "OF-100", "Engine Oil Filter", "filter", "oilf", 85_000, 10),
    ("airf", "AF-200", "Air Filter", "filter", "airf", 120_000, 10),
    ("tire", "ST-2891", "Solid Tire 28x9-15", "tire", "tire", 1_450_000, 4),
]:
    part[key] = (post("/inventory/parts", {
        "part_number": pn, "name": nm, "part_category": pc, "product_id": prod.get(pk),
        "unit_price": price, "currency": "LAK", "min_stock_level": mn, "reorder_quantity": mn * 2,
    }, f"part {pn}") or {}).get("id")

po = post("/inventory/purchase-orders", {
    "vendor": "Asia Forklift Parts Co., Ltd.", "partner_id": vendor.get("v1"), "warehouse_id": wh_id,
    "order_date": d(-10), "expected_date": d(-3), "tax_rate": 0,
    "items": [
        {"spare_part_id": part.get("oilf"), "quantity_ordered": 40, "unit_cost": 60_000},
        {"spare_part_id": part.get("airf"), "quantity_ordered": 30, "unit_cost": 90_000},
        {"spare_part_id": part.get("tire"), "quantity_ordered": 12, "unit_cost": 1_100_000},
    ],
}, "purchase order")
if po:
    post(f"/inventory/purchase-orders/{po['id']}/submit", label="PO submit")
    full = call("GET", f"/inventory/purchase-orders/{po['id']}") or {}
    recv = [{"item_id": it["id"], "quantity_received": it["quantity_ordered"]} for it in full.get("items", [])]
    r = c.post(f"/inventory/purchase-orders/{po['id']}/receive", json=recv)
    print("  PO receive:", r.status_code)
    if r.status_code >= 300:
        failures.append(f"PO receive: {r.status_code} {r.text[:200]}")

# ── customers / leads ────────────────────────────────────────────────────────
step("Customers and leads")
cust = {}
for key, fn, ln, co, ph, em in [
    ("c1", "Somchai", "Vongsa", "Mekong Logistics Sole Co., Ltd.", "+856 20 5551 0001", "ops@mekong-logistics.example"),
    ("c2", "Noy", "Phommasone", "Lao Packaging Industry Co., Ltd.", "+856 20 5551 0002", "purchasing@lao-packaging.example"),
    ("c3", "Khamla", "Sisouk", "Vientiane Cold Storage", "+856 20 5551 0003", "admin@vte-coldstorage.example"),
    ("c4", "Bounmy", "Keomany", "Savan Building Materials", "+856 20 5551 0004", "info@savan-bm.example"),
    ("c5", "Anouvong", "Chanthavong", "Pakse Beverage Distribution", "+856 20 5551 0005", "fleet@pakse-bev.example"),
    ("c6", "Dara", "Inthavong", "Northern Agro Trading", "+856 20 5551 0006", "contact@north-agro.example"),
]:
    cust[key] = (post("/customers/", {
        "first_name": fn, "last_name": ln, "company": co, "phone": ph, "email": em,
        "status": "active" if key != "c6" else "prospect", "notes": "[DEMO] seeded by scripts/seed_demo_data.py",
    }, f"customer {co}") or {}).get("id")

for title, val, src, st, ck in [
    ("Replace 3 diesel forklifts - Mekong Logistics", 450_000_000, "referral", "proposal", "c1"),
    ("Electric forklift fleet rental - Cold Storage", 96_000_000, "website", "won", "c3"),
    ("Spare parts annual contract - Packaging", 60_000_000, "email", "qualified", "c2"),
    ("New customer enquiry - Northern Agro", 150_000_000, "cold_call", "new", "c6"),
]:
    post("/leads/", {"title": title, "value": val, "source": src, "status": st, "customer_id": cust.get(ck)}, f"lead {title}")

# ── forklifts ────────────────────────────────────────────────────────────────
step("Forklifts")
fk = {}
for key, serial, name, model, bk, fuel, cap, st, own, cond, hrs, ck in [
    ("f1", "MIT-FD30-0001", "Mitsubishi FD30 #1", "FD30", "Mitsubishi", "diesel", 3000, "in_stock", "for_sale", "new", 0, None),
    ("f2", "MIT-FD30-0002", "Mitsubishi FD30 #2", "FD30", "Mitsubishi", "diesel", 3000, "in_stock", "for_sale", "new", 0, None),
    ("f3", "MIT-FB20-0101", "Mitsubishi FB20 #1", "FB20", "Mitsubishi", "electric", 2000, "in_stock", "rental", "used", 1250, None),
    ("f4", "MIT-FB20-0102", "Mitsubishi FB20 #2", "FB20", "Mitsubishi", "electric", 2000, "in_stock", "rental", "used", 980, None),
    ("f5", "JUN-EFG-0301", "Jungheinrich EFG 320 #1", "EFG320", "Jungheinrich", "electric", 2000, "in_stock", "for_sale", "refurbished", 3400, None),
]:
    fk[key] = (post("/forklifts/", {
        "serial_number": serial, "name_en": name, "model_number": model, "brand_id": brand.get(bk),
        "fuel_type": fuel, "capacity_kg": cap, "status": st, "ownership_state": own, "condition": cond,
        "year_manufactured": 2024 if cond == "new" else 2021, "initial_hour_meter": hrs, "current_hour_meter": hrs,
        "purchase_date": d(-120), "warranty_expiry": d(365),
    }, f"forklift {serial}") or {}).get("id")

# ── Sales chain: quotation -> SO -> DN -> invoice -> payment ─────────────────
step("Sales chain (quotation > sales order > delivery > invoice > payment)")
q = post("/quotations/", {
    "quotation_type": "sales", "title": "Supply of 1 diesel forklift + service parts",
    "customer_id": cust.get("c1"), "tax_rate": 10, "currency": "LAK",
    "valid_from": d(-14), "valid_until": d(16), "notes": "[DEMO]",
}, "quotation (sales)")
q_items = []
if q:
    for body in [
        {"item_type": "forklift_sale", "forklift_id": fk.get("f1"), "product_id": prod.get("fd30"), "item_code": "FD30",
         "description": "Mitsubishi FD30 Diesel Forklift 3.0t (new)", "quantity": 1, "unit": "unit", "unit_price": 285_000_000},
        {"item_type": "spare_part", "product_id": prod.get("oilf"), "item_code": "OF-100",
         "description": "Engine Oil Filter", "quantity": 4, "unit": "piece", "unit_price": 85_000},
        {"item_type": "spare_part", "product_id": prod.get("airf"), "item_code": "AF-200",
         "description": "Air Filter", "quantity": 4, "unit": "piece", "unit_price": 120_000},
    ]:
        it = post(f"/quotations/{q['id']}/items", {**body, "tax_percent": 10}, f"quotation item {body['item_code']}")
        q_items.append((body, it))
    for action in ("submit", "approve", "send", "accept"):
        post(f"/quotations/{q['id']}/{action}", {}, f"quotation {action}")
    post(f"/quotations/{q['id']}/convert", {"converted_to_type": "sales_order"}, "quotation convert")

so = post("/sales-orders/", {
    "title": "Sales order - FD30 + parts", "customer_id": cust.get("c1"),
    "quotation_id": q["id"] if q else None, "tax_rate": 10, "currency": "LAK",
    "order_date": d(-7), "expected_delivery_date": d(-2),
}, "sales order")
so_items = []
if so:
    # same lines as the quotation, ids carried over (what the editor's prefill does)
    sparemap = {"OF-100": part.get("oilf"), "AF-200": part.get("airf")}
    for body, _ in q_items:
        it = post(f"/sales-orders/{so['id']}/items", {
            "item_code": body["item_code"], "description": body["description"], "quantity": body["quantity"],
            "unit": body["unit"], "unit_price": body["unit_price"], "tax_percent": 10,
            "product_id": body.get("product_id"), "forklift_id": body.get("forklift_id"),
            "spare_part_id": sparemap.get(body["item_code"]),
        }, f"SO item {body['item_code']}")
        so_items.append(it)
    post(f"/sales-orders/{so['id']}/confirm", {}, "SO confirm")

    dn = post("/delivery-notes/", {"sales_order_id": so["id"], "delivery_date": d(-2), "warehouse": "WH-MAIN",
                                   "delivery_address": "Mekong Logistics yard, Vientiane", "driver_name": "Sengdao",
                                   "vehicle_plate": "VTE 1234"}, "delivery note")
    if dn:
        for it in so_items:
            if it:
                post(f"/delivery-notes/{dn['id']}/items", {
                    "item_code": it.get("item_code"), "description": it["description"],
                    "quantity_ordered": it["quantity"], "quantity_delivered": it["quantity"], "unit": it["unit"],
                    "sales_order_item_id": it["id"], "product_id": it.get("product_id"),
                    "spare_part_id": it.get("spare_part_id"), "forklift_id": it.get("forklift_id"),
                }, "DN item")
        post(f"/delivery-notes/{dn['id']}/dispatch", {}, "DN dispatch (issues stock)")
        post(f"/delivery-notes/{dn['id']}/deliver", {}, "DN deliver")
    post(f"/sales-orders/{so['id']}/complete", {}, "SO complete")

    inv = post("/billing/invoices", {
        "customer_id": cust.get("c1"), "sales_order_id": so["id"], "tax_rate": 10, "currency": "LAK",
        "issue_date": d(-1), "due_date": d(29),
        "items": [{
            "item_code": it["item_code"], "description": it["description"], "unit": it["unit"],
            "quantity": it["quantity"], "unit_rate": it["unit_price"],
            "product_id": it.get("product_id"), "spare_part_id": it.get("spare_part_id"), "forklift_id": it.get("forklift_id"),
        } for it in so_items if it],
    }, "invoice (sales)")
    if inv:
        post(f"/billing/invoices/{inv['id']}/issue", {"issue_date": d(-1), "due_date": d(29)}, "invoice issue")
        total = (call("GET", f"/billing/invoices/{inv['id']}") or {}).get("total_amount", 0)
        pay = post("/billing/payments", {
            "customer_id": cust.get("c1"), "payment_method": "bank_transfer", "amount": round(total * 0.5, 2),
            "currency": "LAK", "payment_date": d(0), "reference_number": "TRX-DEMO-0001",
            "notes": "[DEMO] 50% advance",
        }, "payment (50%)")
        if pay:
            post(f"/billing/payments/{pay['id']}/confirm", {}, "payment confirm")
            post(f"/billing/payments/{pay['id']}/allocate",
                 {"payment_id": pay["id"], "invoice_id": inv["id"], "allocated_amount": pay["amount"]}, "payment allocate")

# ── Rental chain ─────────────────────────────────────────────────────────────
step("Rental chain (contract > billing cycle > invoice)")
rc = post("/rental-contracts/", {
    "customer_id": cust.get("c3"), "contract_type": "long_term", "start_date": d(-30), "end_date": d(335),
    "billing_cycle_day": 1, "payment_terms_days": 15, "deposit_amount": 8_000_000, "tax_rate": 10, "currency": "LAK",
    "delivery_address": "Vientiane Cold Storage, Km 9", "notes": "[DEMO]",
}, "rental contract")
if rc:
    ci = post(f"/rental-contracts/{rc['id']}/items", {
        "forklift_id": fk.get("f3"), "description": "Mitsubishi FB20 electric forklift 2.0t",
        "monthly_rate": 8_000_000, "daily_rate": 350_000, "hourly_rate": 60_000,
    }, "rental item")
    for action in ("submit", "approve", "activate"):
        post(f"/rental-contracts/{rc['id']}/{action}", {}, f"rental {action}")
    cyc = post(f"/rental-contracts/{rc['id']}/billing-cycles", {
        "billing_type": "rental_period", "description": "Monthly rental - FB20 #1",
        "contract_item_id": ci["id"] if ci else None, "period_start": d(-30), "period_end": d(-1),
        "quantity": 1, "unit_rate": 8_000_000, "due_date": d(14),
    }, "billing cycle")
    if cyc:
        inv2 = post("/billing/invoices/from-billing-cycles", {
            "contract_id": rc["id"], "billing_cycle_ids": [cyc["id"]], "tax_rate": 10,
        }, "invoice from cycles")
        if inv2:
            post(f"/billing/invoices/{inv2['id']}/issue", {"issue_date": d(0), "due_date": d(14)}, "rental invoice issue")

# ── Maintenance ──────────────────────────────────────────────────────────────
step("Maintenance")
plan = post("/maintenance/plans", {
    "name": "250h Preventive Service", "service_type": "preventive", "interval_type": "hours", "interval_value": 250,
    "estimated_duration_hours": 3, "estimated_cost": 600_000,
    "checklist": ["Engine oil & filter", "Air filter", "Hydraulic oil level", "Brakes", "Mast & chains"],
}, "maintenance plan")
wo = post("/maintenance/work-orders", {
    "forklift_id": fk.get("f3"), "plan_id": plan["id"] if plan else None, "order_type": "preventive",
    "priority": "normal", "title": "250h service - FB20 #1", "scheduled_date": d(-3) + "T08:00:00Z",
    "estimated_hours": 3, "estimated_cost": 600_000,
}, "work order")
if wo:
    post(f"/maintenance/work-orders/{wo['id']}/start", {"hour_meter_reading": 1255}, "work order start")
    post(f"/maintenance/work-orders/{wo['id']}/complete",
         {"actual_hours": 2.5, "findings": "Routine wear", "resolution": "Oil and air filters replaced"}, "work order complete")

print("\nDONE.", "No failures." if not failures else f"{len(failures)} step(s) failed:")
for f in failures:
    print(" -", f)
