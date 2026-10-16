import client from './client'

export type ActivityType = 'call' | 'meeting' | 'visit' | 'email' | 'whatsapp' | 'note' | 'task'
export type ActivityState = 'open' | 'overdue' | 'done' | 'all'

export interface CrmActivity {
  id: number
  type: ActivityType
  subject: string
  notes: string | null
  customer_id: number | null
  customer_name: string | null
  lead_id: number | null
  contact_id: number | null
  due_at: string | null
  completed_at: string | null
  assigned_to: number | null
  assigned_name: string | null
  created_by: number | null
  created_at: string
  is_overdue: boolean
}

export interface ActivityInput {
  type?: ActivityType
  subject: string
  notes?: string | null
  customer_id?: number | null
  lead_id?: number | null
  contact_id?: number | null
  due_at?: string | null
  assigned_to?: number | null
  completed?: boolean
}

export interface ActivitySummary { open: number; overdue: number; due_today: number }

export const listActivities = (params: {
  customer_id?: number; lead_id?: number; state?: ActivityState; mine?: boolean; limit?: number
}) => client.get<CrmActivity[]>('/crm/activities/', { params })

export const getActivitySummary = () => client.get<ActivitySummary>('/crm/activities/summary')
export const createActivity = (d: ActivityInput) => client.post<CrmActivity>('/crm/activities/', d)
export const completeActivity = (id: number) => client.post<CrmActivity>(`/crm/activities/${id}/complete`)
export const reopenActivity = (id: number) => client.post<CrmActivity>(`/crm/activities/${id}/reopen`)
export const deleteActivity = (id: number) => client.delete(`/crm/activities/${id}`)

export const ACTIVITY_TYPES: { value: ActivityType; label: string }[] = [
  { value: 'call', label: 'ໂທ' },
  { value: 'visit', label: 'ລົງພື້ນທີ່' },
  { value: 'meeting', label: 'ນັດພົບ' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'email', label: 'Email' },
  { value: 'note', label: 'ໂນ໊ດ' },
  { value: 'task', label: 'ງານຕິດຕາມ' },
]
