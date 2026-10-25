import { useEffect, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Search, UserPlus, X, CheckCircle2, Plus, Trash2, MessageSquare, ShoppingCart, CalendarClock, Wrench } from 'lucide-react'
import PageHeader from '@/components/layout/PageHeader'
import { getCustomers } from '@/api/customers'
import { getForklifts } from '@/api/forklift'
import { createIntake } from '@/api/intake'
import type { IntakeChannel, IntakeCreate, IntakeItem, IntakeResult, IntakeType } from '@/api/intake'
import type { Customer } from '@/types/customer'
import type { Forklift } from '@/types/forklift'
import { toast } from '@/store/toastStore'
import './IntakePage.css'

const TYPES: { value: IntakeType; icon: typeof MessageSquare }[] = [
  { value: 'quote_request', icon: MessageSquare },
  { value: 'parts_order', icon: ShoppingCart },
  { value: 'rental_reservation', icon: CalendarClock },
  { value: 'service_request', icon: Wrench },
]
const CHANNELS: IntakeChannel[] = ['phone', 'whatsapp', 'facebook', 'line', 'email', 'walk_in', 'other']
const CHANNEL_KEY: Record<IntakeChannel, string> = {
  phone: 'phone', whatsapp: 'whatsapp', facebook: 'facebook', line: 'line',
  email: 'email', walk_in: 'walkIn', other: 'other',
}

const EMPTY_NEW = { first_name: '', last_name: '', phone: '', email: '', company: '' }
const EMPTY_ITEM = { description: '', quantity: '1', unit_price: '' }

const customerLabel = (c: Customer) =>
  `${c.company ? `${c.company} · ` : ''}${`${c.first_name} ${c.last_name}`.replace(/ -$/, '')}${c.phone ? ` · ${c.phone}` : ''}`

const forkliftLabel = (f: Forklift) => `${f.name_en} · ${f.serial_number}`

function useDebounced<T>(value: T, ms = 300) {
  const [v, setV] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setV(value), ms)
    return () => clearTimeout(id)
  }, [value, ms])
  return v
}

function errorText(err: unknown): { message: string; existing?: { id: number; name: string } } {
  const detail = (err as { response?: { data?: { detail?: unknown } } })?.response?.data?.detail
  if (typeof detail === 'string') return { message: detail }
  if (detail && typeof detail === 'object' && !Array.isArray(detail)) {
    const d = detail as { code?: string; message?: string; customer_id?: number; customer_name?: string }
    return {
      message: d.message ?? '',
      existing: d.code === 'customer_exists' && d.customer_id ? { id: d.customer_id, name: d.customer_name ?? '' } : undefined,
    }
  }
  if (Array.isArray(detail) && detail[0]?.msg) return { message: String(detail[0].msg) }
  return { message: '' }
}

export default function IntakePage() {
  const { t } = useTranslation()

  const [type, setType] = useState<IntakeType>('quote_request')
  const [channel, setChannel] = useState<IntakeChannel>('phone')

  // Customer: pick an existing one, or type a new one.
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [newCustomer, setNewCustomer] = useState(EMPTY_NEW)
  const [customerQuery, setCustomerQuery] = useState('')
  const [customerHits, setCustomerHits] = useState<Customer[]>([])
  const debouncedCustomerQuery = useDebounced(customerQuery)

  const [subject, setSubject] = useState('')
  const [details, setDetails] = useState('')
  const [notify, setNotify] = useState(true)

  const [items, setItems] = useState([{ ...EMPTY_ITEM }])
  const [deliveryDate, setDeliveryDate] = useState('')
  const [address, setAddress] = useState('')

  const [forklift, setForklift] = useState<Forklift | null>(null)
  const [forkliftQuery, setForkliftQuery] = useState('')
  const [forkliftHits, setForkliftHits] = useState<Forklift[]>([])
  const debouncedForkliftQuery = useDebounced(forkliftQuery)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [dailyRate, setDailyRate] = useState('')
  const [monthlyRate, setMonthlyRate] = useState('')
  const [priority, setPriority] = useState<'low' | 'normal' | 'high' | 'critical'>('normal')
  const [scheduledDate, setScheduledDate] = useState('')

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [existing, setExisting] = useState<{ id: number; name: string } | null>(null)
  const [result, setResult] = useState<IntakeResult | null>(null)

  // Hits are only shown while a search is active, so stale results never need clearing in the effect.
  const searchingCustomers = !customer && !isNew && debouncedCustomerQuery.trim().length >= 2
  useEffect(() => {
    if (!searchingCustomers) return
    let live = true
    getCustomers({ q: debouncedCustomerQuery.trim(), limit: 8 })
      .then((r) => { if (live) setCustomerHits(r.data) })
      .catch(() => { if (live) setCustomerHits([]) })
    return () => { live = false }
  }, [debouncedCustomerQuery, searchingCustomers])

  const needsForklift = type === 'rental_reservation' || type === 'service_request'
  const searchingForklifts = needsForklift && !forklift && debouncedForkliftQuery.trim().length >= 2
  useEffect(() => {
    if (!searchingForklifts) return
    let live = true
    getForklifts({ q: debouncedForkliftQuery.trim(), page_size: 8, is_active: true })
      .then((r) => { if (live) setForkliftHits(r.data.items) })
      .catch(() => { if (live) setForkliftHits([]) })
    return () => { live = false }
  }, [debouncedForkliftQuery, searchingForklifts])

  const setItem = (i: number, key: keyof typeof EMPTY_ITEM, value: string) =>
    setItems((rows) => rows.map((r, idx) => (idx === i ? { ...r, [key]: value } : r)))

  const reset = () => {
    setCustomer(null); setIsNew(false); setNewCustomer(EMPTY_NEW); setCustomerQuery('')
    setSubject(''); setDetails(''); setItems([{ ...EMPTY_ITEM }]); setDeliveryDate(''); setAddress('')
    setForklift(null); setForkliftQuery(''); setStartDate(''); setEndDate('')
    setDailyRate(''); setMonthlyRate(''); setScheduledDate(''); setPriority('normal')
    setError(''); setExisting(null); setResult(null)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(''); setExisting(null)
    if (!customer && !isNew) { setError(t('intake.errors.pickCustomer')); return }

    const cleanItems: IntakeItem[] = items
      .filter((r) => r.description.trim())
      .map((r) => ({
        description: r.description.trim(),
        quantity: parseFloat(r.quantity) || 1,
        unit_price: parseFloat(r.unit_price) || 0,
      }))

    const payload: IntakeCreate = {
      intake_type: type,
      channel,
      subject: subject.trim(),
      notify_customer: notify,
      ...(details.trim() && { details: details.trim() }),
      ...(customer
        ? { customer_id: customer.id }
        : {
            new_customer: {
              first_name: newCustomer.first_name.trim(),
              ...(newCustomer.last_name.trim() && { last_name: newCustomer.last_name.trim() }),
              ...(newCustomer.phone.trim() && { phone: newCustomer.phone.trim() }),
              ...(newCustomer.email.trim() && { email: newCustomer.email.trim() }),
              ...(newCustomer.company.trim() && { company: newCustomer.company.trim() }),
            },
          }),
      ...(type === 'parts_order' && {
        items: cleanItems,
        ...(deliveryDate && { expected_delivery_date: deliveryDate }),
        ...(address.trim() && { delivery_address: address.trim() }),
      }),
      ...(type === 'rental_reservation' && {
        forklift_id: forklift?.id,
        start_date: startDate,
        end_date: endDate,
        daily_rate: parseFloat(dailyRate) || 0,
        monthly_rate: parseFloat(monthlyRate) || 0,
        ...(address.trim() && { delivery_address: address.trim() }),
      }),
      ...(type === 'service_request' && {
        forklift_id: forklift?.id,
        priority,
        ...(scheduledDate && { scheduled_date: new Date(scheduledDate).toISOString() }),
      }),
    }

    if (type === 'parts_order' && cleanItems.length === 0) { setError(t('intake.errors.needItems')); return }
    if (needsForklift && !forklift) { setError(t('intake.errors.pickForklift')); return }

    setSaving(true)
    try {
      const res = await createIntake(payload)
      setResult(res.data)
      toast.success(t('intake.saved', { reference: res.data.reference }))
    } catch (err) {
      const parsed = errorText(err)
      setError(parsed.message || t('intake.errors.generic'))
      if (parsed.existing) setExisting(parsed.existing)
    } finally {
      setSaving(false)
    }
  }

  const useExisting = async () => {
    if (!existing) return
    try {
      const r = await getCustomers({ q: existing.name, limit: 20 })
      const hit = r.data.find((c) => c.id === existing.id)
      if (hit) { setCustomer(hit); setIsNew(false); setError(''); setExisting(null) }
    } catch { /* the form stays as it is; staff can search by hand */ }
  }

  if (result) {
    const docLink =
      result.document_id == null ? null
        : result.document_type === 'Sales order' ? `/sales-orders/${result.document_id}`
        : result.document_type === 'Rental contract' ? `/rental-contracts/${result.document_id}`
        : `/maintenance/work-orders/${result.document_id}`
    return (
      <div>
        <PageHeader title={t('intake.title')} subtitle={t('intake.subtitle')} />
        <div className="intake-card intake-done">
          <CheckCircle2 size={40} className="intake-done-icon" />
          <h2>{t('intake.done.title')}</h2>
          <p className="intake-ref">{result.reference}</p>
          <ul className="intake-links">
            <li>
              {t('intake.done.customer')}: <Link to={`/customers/${result.customer_id}`}>{result.customer_name}</Link>
              {result.customer_created && <span className="intake-tag">{t('intake.done.newCustomer')}</span>}
            </li>
            <li>{t('intake.done.lead')}: <Link to="/leads">{result.reference}</Link></li>
            {docLink && (
              <li>{t('intake.done.document')}: <Link to={docLink}>{result.document_number}</Link></li>
            )}
            <li>
              {result.customer_notified ? t('intake.done.notified') : t('intake.done.notNotified')}
            </li>
          </ul>
          <button className="btn btn-primary" onClick={reset}>{t('intake.done.another')}</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title={t('intake.title')} subtitle={t('intake.subtitle')} />

      <form onSubmit={handleSubmit} className="intake-layout">
        {error && (
          <div className="page-error">
            <span>{error}</span>
            {existing && (
              <button type="button" className="btn btn-ghost" onClick={useExisting}>
                {t('intake.useExisting', { name: existing.name })}
              </button>
            )}
          </div>
        )}

        {/* 1 · Who */}
        <section className="intake-card">
          <h3>1 · {t('intake.sections.customer')}</h3>
          {customer ? (
            <div className="intake-picked">
              <strong>{customerLabel(customer)}</strong>
              <button type="button" className="btn btn-ghost" onClick={() => setCustomer(null)}>
                <X size={14} /> {t('intake.change')}
              </button>
            </div>
          ) : isNew ? (
            <div className="form-grid">
              <div className="form-row-2">
                <div className="form-group">
                  <label>{t('intake.new.firstName')} <span className="required">*</span></label>
                  <input value={newCustomer.first_name} required
                    onChange={(e) => setNewCustomer((p) => ({ ...p, first_name: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>{t('intake.new.lastName')}</label>
                  <input value={newCustomer.last_name}
                    onChange={(e) => setNewCustomer((p) => ({ ...p, last_name: e.target.value }))} />
                </div>
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label>{t('intake.new.phone')}</label>
                  <input value={newCustomer.phone} inputMode="tel"
                    onChange={(e) => setNewCustomer((p) => ({ ...p, phone: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>{t('intake.new.email')}</label>
                  <input type="email" value={newCustomer.email}
                    onChange={(e) => setNewCustomer((p) => ({ ...p, email: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label>{t('intake.new.company')}</label>
                <input value={newCustomer.company}
                  onChange={(e) => setNewCustomer((p) => ({ ...p, company: e.target.value }))} />
              </div>
              <small className="intake-hint">{t('intake.new.hint')}</small>
              <div>
                <button type="button" className="btn btn-ghost" onClick={() => setIsNew(false)}>
                  <Search size={14} /> {t('intake.searchInstead')}
                </button>
              </div>
            </div>
          ) : (
            <div className="form-grid">
              <div className="form-group">
                <label>{t('intake.search.label')}</label>
                <input
                  value={customerQuery}
                  onChange={(e) => setCustomerQuery(e.target.value)}
                  placeholder={t('intake.search.placeholder')}
                  autoFocus
                />
              </div>
              {searchingCustomers && customerHits.length > 0 && (
                <ul className="intake-hits">
                  {customerHits.map((c) => (
                    <li key={c.id}>
                      <button type="button" onClick={() => setCustomer(c)}>
                        {customerLabel(c)}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {searchingCustomers && customerHits.length === 0 && (
                <small className="intake-hint">{t('intake.search.none')}</small>
              )}
              <div>
                <button type="button" className="btn btn-ghost" onClick={() => setIsNew(true)}>
                  <UserPlus size={14} /> {t('intake.new.button')}
                </button>
              </div>
            </div>
          )}
        </section>

        {/* 2 · What */}
        <section className="intake-card">
          <h3>2 · {t('intake.sections.request')}</h3>
          <div className="intake-types" role="radiogroup">
            {TYPES.map(({ value, icon: Icon }) => (
              <button
                key={value} type="button" role="radio" aria-checked={type === value}
                className={`intake-type${type === value ? ' active' : ''}`}
                onClick={() => setType(value)}
              >
                <Icon size={20} />
                <span>{t(`intake.types.${value}.label`)}</span>
                <small>{t(`intake.types.${value}.hint`)}</small>
              </button>
            ))}
          </div>

          <div className="form-grid" style={{ marginTop: 16 }}>
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="in-channel">{t('intake.channel.label')}</label>
                <select id="in-channel" value={channel} onChange={(e) => setChannel(e.target.value as IntakeChannel)}>
                  {CHANNELS.map((c) => (
                    <option key={c} value={c}>{t(`intake.channel.${CHANNEL_KEY[c]}`)}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="in-subject">{t('intake.subject')} <span className="required">*</span></label>
                <input id="in-subject" value={subject} required maxLength={200}
                  onChange={(e) => setSubject(e.target.value)} placeholder={t('intake.subjectPlaceholder')} />
              </div>
            </div>

            {type === 'parts_order' && (
              <>
                <div className="intake-items">
                  {items.map((row, i) => (
                    <div className="intake-item-row" key={i}>
                      <input value={row.description} placeholder={t('intake.items.description')}
                        onChange={(e) => setItem(i, 'description', e.target.value)} />
                      <input type="number" min="0" step="any" value={row.quantity} aria-label={t('intake.items.qty')}
                        onChange={(e) => setItem(i, 'quantity', e.target.value)} />
                      <input type="number" min="0" step="any" value={row.unit_price} placeholder={t('intake.items.price')}
                        onChange={(e) => setItem(i, 'unit_price', e.target.value)} />
                      <button type="button" className="btn btn-ghost" aria-label={t('common.delete')}
                        disabled={items.length === 1}
                        onClick={() => setItems((rows) => rows.filter((_, idx) => idx !== i))}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <button type="button" className="btn btn-ghost" onClick={() => setItems((r) => [...r, { ...EMPTY_ITEM }])}>
                    <Plus size={14} /> {t('intake.items.add')}
                  </button>
                </div>
                <div className="form-row-2">
                  <div className="form-group">
                    <label>{t('intake.deliveryDate')}</label>
                    <input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>{t('intake.address')}</label>
                    <input value={address} onChange={(e) => setAddress(e.target.value)} />
                  </div>
                </div>
              </>
            )}

            {needsForklift && (
              <div className="form-group">
                <label>{t('intake.forklift.label')} <span className="required">*</span></label>
                {forklift ? (
                  <div className="intake-picked">
                    <strong>{forkliftLabel(forklift)}</strong>
                    <button type="button" className="btn btn-ghost" onClick={() => setForklift(null)}>
                      <X size={14} /> {t('intake.change')}
                    </button>
                  </div>
                ) : (
                  <>
                    <input value={forkliftQuery} onChange={(e) => setForkliftQuery(e.target.value)}
                      placeholder={t('intake.forklift.placeholder')} />
                    {searchingForklifts && forkliftHits.length > 0 && (
                      <ul className="intake-hits">
                        {forkliftHits.map((f) => (
                          <li key={f.id}>
                            <button type="button" onClick={() => setForklift(f)}>
                              {forkliftLabel(f)} <small>({f.status})</small>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </div>
            )}

            {type === 'rental_reservation' && (
              <>
                <div className="form-row-2">
                  <div className="form-group">
                    <label>{t('intake.rental.start')} <span className="required">*</span></label>
                    <input type="date" value={startDate} required onChange={(e) => setStartDate(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>{t('intake.rental.end')} <span className="required">*</span></label>
                    <input type="date" value={endDate} required min={startDate || undefined}
                      onChange={(e) => setEndDate(e.target.value)} />
                  </div>
                </div>
                <div className="form-row-2">
                  <div className="form-group">
                    <label>{t('intake.rental.daily')}</label>
                    <input type="number" min="0" step="any" value={dailyRate} onChange={(e) => setDailyRate(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>{t('intake.rental.monthly')}</label>
                    <input type="number" min="0" step="any" value={monthlyRate} onChange={(e) => setMonthlyRate(e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label>{t('intake.address')}</label>
                  <input value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
              </>
            )}

            {type === 'service_request' && (
              <div className="form-row-2">
                <div className="form-group">
                  <label>{t('intake.service.priority')}</label>
                  <select value={priority} onChange={(e) => setPriority(e.target.value as typeof priority)}>
                    {(['low', 'normal', 'high', 'critical'] as const).map((p) => (
                      <option key={p} value={p}>{t(`intake.service.priorities.${p}`)}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>{t('intake.service.when')}</label>
                  <input type="datetime-local" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} />
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="in-details">{t('intake.details')}</label>
              <textarea id="in-details" rows={4} value={details} maxLength={4000}
                onChange={(e) => setDetails(e.target.value)} placeholder={t('intake.detailsPlaceholder')} />
            </div>
          </div>
        </section>

        {/* 3 · Confirm */}
        <section className="intake-card">
          <h3>3 · {t('intake.sections.confirm')}</h3>
          <label className="intake-check">
            <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} />
            {t('intake.notify')}
          </label>
          <small className="intake-hint">{t('intake.notifyHint')}</small>
          <div style={{ marginTop: 16 }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? t('common.saving') : t('intake.submit')}
            </button>
          </div>
        </section>
      </form>
    </div>
  )
}
