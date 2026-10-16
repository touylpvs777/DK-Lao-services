import client from './client'

/** Login a customer uses on the public storefront's /client-dashboard portal. */
export interface PortalAccount {
  id: number
  customer_id: number
  customer_name: string
  company: string | null
  username: string
  is_active: boolean
  created_at: string
}

export const getPortalAccounts = (customerId: number) =>
  client.get<PortalAccount[]>('/portal/accounts', { params: { customer_id: customerId } })

export const createPortalAccount = (d: { customer_id: number; username: string; password: string }) =>
  client.post<PortalAccount>('/portal/accounts', d)

export const updatePortalAccount = (id: number, d: { is_active?: boolean; password?: string }) =>
  client.patch<PortalAccount>(`/portal/accounts/${id}`, d)
