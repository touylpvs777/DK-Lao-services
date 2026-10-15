import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { MapPin, Users, Plus, Trash2, Star } from 'lucide-react'
import {
  createContact, createSite, deleteContact, deleteSite, getContacts, getSites,
} from '@/api/customers'
import { toast } from '@/store/toastStore'

const empty = { name: '', address: '', province: '', position: '', phone: '', whatsapp: '', site_id: '' }
type Form = typeof empty

const gridStyle = (min: number) => ({
  display: 'grid', gap: 10, gridTemplateColumns: `repeat(auto-fit,minmax(${min}px,1fr))`, alignItems: 'end',
})

/** Customer 360: physical sites and people (contacts) of a customer. */
export default function SitesContactsCard({ customerId }: { customerId: number }) {
  const qc = useQueryClient()
  const sitesQ = useQuery({ queryKey: ['customer-sites', customerId], queryFn: () => getSites(customerId).then((r) => r.data) })
  const contactsQ = useQuery({ queryKey: ['customer-contacts', customerId], queryFn: () => getContacts(customerId).then((r) => r.data) })
  const sites = sitesQ.data ?? []
  const contacts = contactsQ.data ?? []

  const [siteForm, setSiteForm] = useState<Form | null>(null)
  const [contactForm, setContactForm] = useState<Form | null>(null)

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ['customer-sites', customerId] })
    qc.invalidateQueries({ queryKey: ['customer-contacts', customerId] })
  }
  const onError = () => toast.error('ບັນທຶກບໍ່ສຳເລັດ')

  const addSite = useMutation({
    mutationFn: (f: Form) => createSite(customerId, {
      name: f.name.trim(), address: f.address || null, province: f.province || null, is_primary: sites.length === 0,
    }),
    onSuccess: () => { setSiteForm(null); refresh() },
    onError,
  })
  const addContact = useMutation({
    mutationFn: (f: Form) => createContact(customerId, {
      name: f.name.trim(), position: f.position || null, phone: f.phone || null, whatsapp: f.whatsapp || null,
      site_id: f.site_id ? Number(f.site_id) : null, is_primary: contacts.length === 0,
    }),
    onSuccess: () => { setContactForm(null); refresh() },
    onError,
  })
  const delSite = useMutation({ mutationFn: (id: number) => deleteSite(customerId, id), onSuccess: refresh, onError })
  const delContact = useMutation({ mutationFn: (id: number) => deleteContact(customerId, id), onSuccess: refresh, onError })

  const siteName = (id: number | null) => sites.find((s) => s.id === id)?.name
  const field = (f: Form, set: (v: Form) => void, key: keyof Form, label: string, autoFocus = false) => (
    <div className="form-group">
      <label>{label}</label>
      <input value={f[key]} onChange={(e) => set({ ...f, [key]: e.target.value })} autoFocus={autoFocus} />
    </div>
  )

  return (
    <>
      <div className="c360-card">
        <div className="c360-card-header">
          <MapPin size={16} /> ສະຖານທີ່ / ໄຊທ໌ (Sites) <span className="c360-card-count">({sites.length})</span>
          <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }} onClick={() => setSiteForm(siteForm ? null : { ...empty })}>
            <Plus size={13} /> ເພີ່ມ
          </button>
        </div>
        {siteForm && (
          <form className="c360-card-body" style={gridStyle(180)}
            onSubmit={(e) => { e.preventDefault(); if (siteForm.name.trim()) addSite.mutate(siteForm) }}>
            {field(siteForm, setSiteForm, 'name', 'ຊື່ສະຖານທີ່ *', true)}
            {field(siteForm, setSiteForm, 'address', 'ທີ່ຢູ່')}
            {field(siteForm, setSiteForm, 'province', 'ແຂວງ')}
            <button className="btn btn-primary" disabled={addSite.isPending || !siteForm.name.trim()}>ບັນທຶກ</button>
          </form>
        )}
        {sites.length === 0 && !siteForm ? (
          <div className="c360-empty">ຍັງບໍ່ມີສະຖານທີ່</div>
        ) : (
          <div className="table-wrap"><table className="data-table"><tbody>
            {sites.map((s) => (
              <tr key={s.id}>
                <td>{s.is_primary && <Star size={12} style={{ color: '#f59e0b', marginRight: 6 }} />}{s.name}</td>
                <td className="cell-muted">{[s.address, s.province].filter(Boolean).join(', ') || '—'}</td>
                <td style={{ width: 40 }}>
                  <button className="btn btn-ghost btn-sm" title="ລຶບ" onClick={() => window.confirm('ລຶບສະຖານທີ່ນີ້?') && delSite.mutate(s.id)}><Trash2 size={13} /></button>
                </td>
              </tr>
            ))}
          </tbody></table></div>
        )}
      </div>

      <div className="c360-card">
        <div className="c360-card-header">
          <Users size={16} /> ຜູ້ຕິດຕໍ່ (Contacts) <span className="c360-card-count">({contacts.length})</span>
          <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }} onClick={() => setContactForm(contactForm ? null : { ...empty })}>
            <Plus size={13} /> ເພີ່ມ
          </button>
        </div>
        {contactForm && (
          <form className="c360-card-body" style={gridStyle(160)}
            onSubmit={(e) => { e.preventDefault(); if (contactForm.name.trim()) addContact.mutate(contactForm) }}>
            {field(contactForm, setContactForm, 'name', 'ຊື່ *', true)}
            {field(contactForm, setContactForm, 'position', 'ຕຳແໜ່ງ')}
            {field(contactForm, setContactForm, 'phone', 'ໂທ')}
            {field(contactForm, setContactForm, 'whatsapp', 'WhatsApp')}
            <div className="form-group">
              <label>ສະຖານທີ່</label>
              <select value={contactForm.site_id} onChange={(e) => setContactForm({ ...contactForm, site_id: e.target.value })}>
                <option value="">—</option>
                {sites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <button className="btn btn-primary" disabled={addContact.isPending || !contactForm.name.trim()}>ບັນທຶກ</button>
          </form>
        )}
        {contacts.length === 0 && !contactForm ? (
          <div className="c360-empty">ຍັງບໍ່ມີຜູ້ຕິດຕໍ່</div>
        ) : (
          <div className="table-wrap"><table className="data-table"><tbody>
            {contacts.map((c) => (
              <tr key={c.id}>
                <td>{c.is_primary && <Star size={12} style={{ color: '#f59e0b', marginRight: 6 }} />}{c.name}</td>
                <td className="cell-muted">{c.position || '—'}</td>
                <td className="cell-muted">{[c.phone, c.whatsapp && `WA ${c.whatsapp}`].filter(Boolean).join(' · ') || '—'}</td>
                <td className="cell-muted">{siteName(c.site_id) ?? '—'}</td>
                <td style={{ width: 40 }}>
                  <button className="btn btn-ghost btn-sm" title="ລຶບ" onClick={() => window.confirm('ລຶບຜູ້ຕິດຕໍ່ນີ້?') && delContact.mutate(c.id)}><Trash2 size={13} /></button>
                </td>
              </tr>
            ))}
          </tbody></table></div>
        )}
      </div>
    </>
  )
}
