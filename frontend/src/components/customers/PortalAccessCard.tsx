import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { KeyRound, Plus } from 'lucide-react'
import { createPortalAccount, getPortalAccounts, updatePortalAccount } from '@/api/customerPortal'
import { toast } from '@/store/toastStore'
import { Badge } from '@/components/ui/Badge'

const USERNAME_RE = /^[A-Za-z0-9._-]{3,100}$/

/**
 * Customer 360: the customer's login for the storefront portal (/client-dashboard),
 * where they see only their own forklifts, rentals, work orders and invoices.
 * Superuser-only, matching the backend.
 */
export default function PortalAccessCard({ customerId }: { customerId: number }) {
  const { t } = useTranslation()
  const qc = useQueryClient()
  const key = ['portal-account', customerId]
  const { data, isLoading } = useQuery({
    queryKey: key, queryFn: () => getPortalAccounts(customerId).then((r) => r.data),
  })
  const account = data?.[0] ?? null

  const [form, setForm] = useState<{ username: string; password: string } | null>(null)
  const [newPassword, setNewPassword] = useState<string | null>(null)

  const refresh = () => qc.invalidateQueries({ queryKey: key })
  const onError = (err: unknown) => {
    if (isAxiosError(err) && err.response?.status === 409) toast.error(t('portalAccess.conflict'))
    else toast.error(t('crmWork.saveFailed'))
  }

  const create = useMutation({
    mutationFn: (f: { username: string; password: string }) =>
      createPortalAccount({ customer_id: customerId, username: f.username.trim(), password: f.password }),
    onSuccess: () => { setForm(null); toast.success(t('portalAccess.created')); refresh() },
    onError,
  })
  const update = useMutation({
    mutationFn: (d: { is_active?: boolean; password?: string }) => updatePortalAccount(account!.id, d),
    onSuccess: (_r, d) => {
      setNewPassword(null)
      toast.success(d.password ? t('portalAccess.passwordReset') : t('portalAccess.updated'))
      refresh()
    },
    onError,
  })

  const formValid = !!form && USERNAME_RE.test(form.username.trim()) && form.password.length >= 8

  return (
    <div className="c360-card">
      <div className="c360-card-header">
        <KeyRound size={16} /> {t('portalAccess.title')}
        {!account && !isLoading && (
          <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }}
            onClick={() => setForm(form ? null : { username: '', password: '' })}>
            <Plus size={13} /> {t('portalAccess.create')}
          </button>
        )}
      </div>
      <div className="c360-card-body">
        <p className="cell-muted" style={{ fontSize: 12, marginBottom: 10 }}>{t('portalAccess.hint')}</p>

        {isLoading ? null : account ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
            <strong>{account.username}</strong>
            <Badge variant={account.is_active ? 'green' : 'gray'}>
              {account.is_active ? t('portalAccess.active') : t('portalAccess.inactive')}
            </Badge>
            <button className="btn btn-ghost btn-sm" disabled={update.isPending}
              onClick={() => update.mutate({ is_active: !account.is_active })}>
              {account.is_active ? t('portalAccess.deactivate') : t('portalAccess.activate')}
            </button>
            {newPassword === null ? (
              <button className="btn btn-ghost btn-sm" onClick={() => setNewPassword('')}>
                {t('portalAccess.resetPassword')}
              </button>
            ) : (
              <form style={{ display: 'flex', gap: 8 }}
                onSubmit={(e) => { e.preventDefault(); if (newPassword.length >= 8) update.mutate({ password: newPassword }) }}>
                <input type="password" autoFocus autoComplete="new-password" placeholder={t('portalAccess.passwordHint')}
                  value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                <button className="btn btn-primary btn-sm" disabled={update.isPending || newPassword.length < 8}>
                  {t('crmWork.save')}
                </button>
              </form>
            )}
          </div>
        ) : form ? (
          <form style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', alignItems: 'end' }}
            onSubmit={(e) => { e.preventDefault(); if (formValid) create.mutate(form) }}>
            <div className="form-group">
              <label>{t('portalAccess.username')}</label>
              <input autoFocus autoComplete="off" value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })} />
            </div>
            <div className="form-group">
              <label>{t('portalAccess.password')}</label>
              <input type="password" autoComplete="new-password" placeholder={t('portalAccess.passwordHint')}
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <button className="btn btn-primary" disabled={create.isPending || !formValid}>{t('crmWork.save')}</button>
          </form>
        ) : (
          <div className="c360-empty">{t('portalAccess.none')}</div>
        )}
      </div>
    </div>
  )
}
