import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'
import { getContacts, getSites } from '@/api/customers'

interface LinkFormValues {
  customer_id: number | null
  site_id?: number | null
  contact_id?: number | null
}

/**
 * Site + Contact pickers for document headers. Renders three grid cells
 * (Site, Contact, spacer) so it fills one row of `.doc-editor-header-grid`.
 * Options follow the selected customer; a stale selection is cleared once the
 * new customer's lists load.
 */
export default function SiteContactFields({ readOnly }: { readOnly: boolean }) {
  const { register, watch, setValue } = useFormContext<LinkFormValues>()
  const customerId = watch('customer_id')
  const siteId = watch('site_id')
  const contactId = watch('contact_id')

  const sitesQ = useQuery({
    queryKey: ['customer-sites', customerId], enabled: !!customerId,
    queryFn: () => getSites(customerId!).then((r) => r.data),
  })
  const contactsQ = useQuery({
    queryKey: ['customer-contacts', customerId], enabled: !!customerId,
    queryFn: () => getContacts(customerId!).then((r) => r.data),
  })
  const sites = sitesQ.data ?? []
  const contacts = (contactsQ.data ?? []).filter((c) => !siteId || c.site_id == null || c.site_id === siteId)

  useEffect(() => {
    if (!customerId) {
      if (siteId) setValue('site_id', null)
      if (contactId) setValue('contact_id', null)
      return
    }
    if (sitesQ.data && siteId && !sitesQ.data.some((s) => s.id === siteId)) setValue('site_id', null)
    if (contactsQ.data && contactId && !contactsQ.data.some((c) => c.id === contactId)) setValue('contact_id', null)
  }, [customerId, siteId, contactId, sitesQ.data, contactsQ.data, setValue])

  const toNum = { setValueAs: (v: string) => (v === '' ? null : Number(v)) }
  return (
    <>
      <div className="form-group">
        <label>ສະຖານທີ່ / ໄຊທ໌</label>
        <select {...register('site_id', toNum)} disabled={readOnly || !customerId}>
          <option value="">—</option>
          {sites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label>ຜູ້ຕິດຕໍ່</label>
        <select {...register('contact_id', toNum)} disabled={readOnly || !customerId}>
          <option value="">—</option>
          {contacts.map((c) => <option key={c.id} value={c.id}>{c.name}{c.position ? ` (${c.position})` : ''}</option>)}
        </select>
      </div>
      <div />
    </>
  )
}
