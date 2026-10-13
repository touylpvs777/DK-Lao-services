"use server";

import { sendWebsiteInquiry } from "@/lib/crm-inquiries";

export interface OrderItemPayload {
  sku_id: string;
  sku_code: string;
  part_name: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
}

export interface PlaceOrderInput {
  customer_name: string;
  phone_number: string;
  delivery_address: string;
  province?: string;
  district?: string;
  notes?: string;
  items: OrderItemPayload[];
  total_usd: number;
  total_lak: number;
  tax_company_name?: string;
  tax_id?: string;
}

export interface OrderResult {
  success: boolean;
  order_id: string;
  order_number: string;
  message: string;
  data?: any;
}

export async function placeOrder(input: PlaceOrderInput): Promise<OrderResult> {
  try {
    const inquiry = await sendWebsiteInquiry({
      inquiry_type: "store_order",
      category: "store_order",
      customer_name: input.customer_name,
      phone_number: input.phone_number,
      company_name: input.tax_company_name,
      province: input.province,
      district: input.district,
      delivery_address: input.delivery_address,
      total_usd: input.total_usd,
      total_lak: input.total_lak,
      tax_company_name: input.tax_company_name,
      tax_id: input.tax_id,
      notes: input.notes,
      items: input.items.map(({ sku_code, part_name, unit_price, quantity }) => ({
        sku_code,
        part_name,
        unit_price,
        quantity,
      })),
    });

    if (!inquiry.success) {
      return {
        success: false,
        order_id: "",
        order_number: "",
        message: inquiry.message,
      };
    }
    const orderNumber = inquiry.reference_number;

    return {
      success: true,
      order_id: orderNumber,
      order_number: orderNumber,
      message: `ຄຳຮ້ອງຂໍຖືກບັນທຶກໃນ CRM ແລ້ວ (${orderNumber}). ທີມງານຈະຢືນຢັນລາຄາ ແລະສະຕັອກກ່ອນຢືນຢັນ Order.`,
      data: {
        orderNumber,
        customerName: input.customer_name,
        phone: input.phone_number,
        totalUSD: input.total_usd,
        totalLAK: input.total_lak,
        items: input.items,
      },
    };
  } catch {
    return {
      success: false,
      order_id: "",
      order_number: "",
      message: "ບໍ່ສາມາດບັນທຶກຄຳຮ້ອງຂໍໄດ້, ກະລຸນາລອງໃໝ່ອີກ.",
    };
  }
}
