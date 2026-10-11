import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Phone, Mail, Check } from 'lucide-react'
import { plansLabel } from '../data/data'
import { Button } from './ui'

export type Enquiry = { name: string; email: string; phone: string; interest: string; membership: string; start: string; method: string; message: string }
/** Sends membership enquiries to the Supabase REST API. */
export async function submitEnquiry(data: Enquiry): Promise<{ ok: boolean; error?: string }> {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) return { ok: false, error: 'The enquiry service is not configured yet. Please call or email the gym.' }
  try {
    const response = await fetch(`${url}/rest/v1/enquiries`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        interest: data.interest,
        membership: data.membership,
        preferred_start_date: data.start || null,
        preferred_contact_method: data.method,
        message: data.message.trim(),
      }),
    })
    if (!response.ok) {
      console.error('Supabase enquiry insert failed:', response.status, await response.text())
      return { ok: false, error: 'We could not send your enquiry right now. Please try again or contact the gym directly.' }
    }
    return { ok: true }
  } catch (error) {
    console.error('Enquiry submission failed:', error)
    return { ok: false, error: 'Network error. Please check your connection and try again.' }
  }
}
export const CONTACT = { phone: '+00 000 000 0000', email: 'hello@irondistrict.example' }
const MEMBERSHIPS = ['General Enquiry', ...Object.values(plansLabel)]
const INTERESTS = ['General Enquiry', 'Membership', 'Personal Training', 'Group Training', 'Programs', 'Other']
const fromParam = (p: string | null) => (p && plansLabel[p]) || 'General Enquiry'

export default function ContactForm() {
  const [params] = useSearchParams()
  const plan = params.get('plan')
  const [f, setF] = useState<Enquiry>({ name: '', email: '', phone: '', interest: plan ? 'Membership' : 'General Enquiry', membership: fromParam(plan), start: '', method: 'Email', message: '' })
  const [err, setErr] = useState<Partial<Record<keyof Enquiry, string>>>({})
  const [busy, setBusy] = useState(false), [done, setDone] = useState(false), [submitError, setSubmitError] = useState('')
  useEffect(() => { if (plan) setF((s) => ({ ...s, membership: fromParam(plan), interest: 'Membership' })) }, [plan])
  const set = (k: keyof Enquiry) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value })
  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const x: typeof err = {}
    if (f.name.trim().length < 2) x.name = 'Enter your full name.'
    if (!/^\S+@\S+\.\S+$/.test(f.email)) x.email = 'Enter a valid email address.'
    if (f.phone && f.phone.replace(/\D/g, '').length < 7) x.phone = 'Enter a phone number with at least 7 digits.'
    setErr(x); if (Object.keys(x).length) return
    setBusy(true); setSubmitError(''); const r = await submitEnquiry(f); setBusy(false); setDone(r.ok); if (!r.ok) setSubmitError(r.error || 'Unable to send your enquiry.')
  }
  if (done) return (
    <div className="ok" role="status"><Check size={40} /><h2 className="h3">Your membership enquiry has been received.</h2>
      <p className="muted">Selected: {f.membership}. Your enquiry has been saved. The gym team can follow up using the contact details you provided.</p>
      <div className="row"><a className="btn" href={`tel:${CONTACT.phone.replace(/\s/g, '')}`}><span className="btn-t">CALL THE GYM</span><Phone size={18} /></a>
        <a className="btn ghost" href={`mailto:${CONTACT.email}`}><span className="btn-t">EMAIL THE GYM</span><Mail size={18} /></a></div></div>
  )
  const fld = (k: keyof Enquiry, label: string, type = 'text', req = false) => (
    <label className="fld">{label}{req && ' *'}
      <input type={type} value={f[k]} onChange={set(k)} aria-invalid={!!err[k]} aria-describedby={err[k] ? `e-${k}` : undefined} required={req} />
      {err[k] && <em id={`e-${k}`} role="alert">{err[k]}</em>}</label>
  )
  const sel = (k: keyof Enquiry, label: string, opts: string[]) => <label className="fld">{label}<select value={f[k]} onChange={set(k)}>{opts.map((o) => <option key={o}>{o}</option>)}</select></label>
  return (
    <form onSubmit={onSubmit} noValidate className="form" aria-label="Membership enquiry">
      <p className="sel" aria-live="polite">Selected plan: <b>{f.membership}</b></p>
      <div className="g2">{fld('name', 'Full name', 'text', true)}{fld('email', 'Email', 'email', true)}{fld('phone', 'Phone', 'tel')}{fld('start', 'Preferred start date', 'date')}
        {sel('interest', 'Interested in', INTERESTS)}{sel('method', 'Preferred contact method', ['Email', 'Phone', 'Text message'])}</div>
      <fieldset><legend>Membership type</legend><div className="seg">
        {MEMBERSHIPS.map((m) => <label key={m} className={f.membership === m ? 'on' : ''}><input type="radio" name="m" checked={f.membership === m} onChange={() => setF({ ...f, membership: m })} />{m}</label>)}</div></fieldset>
      <label className="fld">Message<textarea rows={4} value={f.message} onChange={set('message')} /></label>
      {submitError && <p role="alert" className="error">{submitError}</p>}
      <Button type="submit" disabled={busy}>{busy ? 'SENDING...' : 'SEND ENQUIRY'}</Button>
    </form>
  )
}
