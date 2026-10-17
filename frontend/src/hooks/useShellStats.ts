import { useQuery } from '@tanstack/react-query'
import { getActivitySummary } from '@/api/crmActivities'
import { getLeads } from '@/api/leads'
import { useAuthStore } from '@/store/authStore'

const POLL_MS = 60_000

/** Small live counters shown in the top bar and the side panel. */
export function useShellStats() {
  const enabled = !!useAuthStore((s) => s.user)
  const tasks = useQuery({
    queryKey: ['activity-summary'], queryFn: () => getActivitySummary().then((r) => r.data),
    refetchInterval: 120_000, enabled,
  })
  const newLeads = useQuery({
    queryKey: ['shell-new-leads'],
    queryFn: () => getLeads({ status: 'new', limit: 100 }).then((r) => r.data.length),
    refetchInterval: POLL_MS, enabled, retry: false,
  })
  return { overdueTasks: tasks.data?.overdue ?? 0, newLeads: newLeads.data ?? 0 }
}
