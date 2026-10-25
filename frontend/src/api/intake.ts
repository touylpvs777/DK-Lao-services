import client from './client'

export type IntakeType = 'quote_request' | 'parts_order' | 'rental_reservation' | 'service_request'
export type IntakeChannel = 'phone' | 'whatsapp' | 'facebook' | 'line' | 'email' | 'walk_in' | 'other'

export interface IntakeNewCustomer {
  first_name: string
  last_name?: string
  phone?: string
  email?: string
  company?: string
}

export interface IntakeItem {
  description: string
  quantity: number
  unit_price: number
}

export interface IntakeCreate {
  intake_type: IntakeType
  channel: IntakeChannel
  customer_id?: number
  new_customer?: IntakeNewCustomer
  subject: string
  details?: string
  notify_customer: boolean
  items?: IntakeItem[]
  expected_delivery_date?: string
  delivery_address?: string
  forklift_id?: number
  start_date?: string
  end_date?: string
  daily_rate?: number
  monthly_rate?: number
  scheduled_date?: string
  priority?: 'low' | 'normal' | 'high' | 'critical'
}

export interface IntakeResult {
  reference: string
  lead_id: number
  customer_id: number
  customer_name: string
  customer_created: boolean
  document_type: string | null
  document_id: number | null
  document_number: string | null
  customer_notified: boolean
}

export const createIntake = (data: IntakeCreate) => client.post<IntakeResult>('/intake/', data)
