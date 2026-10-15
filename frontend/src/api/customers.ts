import client from './client'
import type { Customer, Customer360, CustomerCreate, CustomerUpdate } from '@/types/customer'

export const getCustomers = (params?: { skip?: number; limit?: number; status?: string; q?: string }) =>
  client.get<Customer[]>('/customers/', { params })

export const getCustomer = (id: number) =>
  client.get<Customer>(`/customers/${id}`)

export const getCustomerOverview = (id: number) =>
  client.get<Customer360>(`/customers/${id}/overview`)

export const createCustomer = (data: CustomerCreate) =>
  client.post<Customer>('/customers/', data)

export const updateCustomer = (id: number, data: CustomerUpdate) =>
  client.patch<Customer>(`/customers/${id}`, data)

export const deleteCustomer = (id: number) =>
  client.delete(`/customers/${id}`)

// Sites & contacts

export interface CustomerSite {
  id: number; customer_id: number; name: string
  address: string | null; district: string | null; province: string | null
  is_primary: boolean; notes: string | null
}
export type CustomerSiteInput = Partial<Omit<CustomerSite, 'id' | 'customer_id'>> & { name: string }

export interface CustomerContact {
  id: number; customer_id: number; site_id: number | null; name: string
  position: string | null; phone: string | null; whatsapp: string | null
  email: string | null; is_primary: boolean; notes: string | null
}
export type CustomerContactInput = Partial<Omit<CustomerContact, 'id' | 'customer_id'>> & { name: string }

export const getSites = (cid: number) => client.get<CustomerSite[]>(`/customers/${cid}/sites`)
export const createSite = (cid: number, d: CustomerSiteInput) => client.post<CustomerSite>(`/customers/${cid}/sites`, d)
export const deleteSite = (cid: number, id: number) => client.delete(`/customers/${cid}/sites/${id}`)

export const getContacts = (cid: number) => client.get<CustomerContact[]>(`/customers/${cid}/contacts`)
export const createContact = (cid: number, d: CustomerContactInput) => client.post<CustomerContact>(`/customers/${cid}/contacts`, d)
export const deleteContact = (cid: number, id: number) => client.delete(`/customers/${cid}/contacts/${id}`)
