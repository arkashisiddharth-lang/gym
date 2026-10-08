import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Phone, Mail, Check } from 'lucide-react'
import { plansLabel } from '../data/data'
import { Button } from './ui'

export type Enquiry = { name: string; email: string; phone: string; interest: string; membership: string; start: string; method: string; message: string }
/** Replace the body with e.g. `await supabase.from('enquiries').insert(data)`. Nothing is sent today. */
export async function submitEnquiry(_data: Enquiry): Promise<{ ok: boolean }> {
  await new Promise((r) => setTimeout(r, 900))
  return { ok: true }
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
  const [busy, setBusy] = useState(false), [done, setDone] = useState(false)
  useEffect(() => { if (plan) setF((s) => ({ ...s, membership: fromParam(plan), interest: 'Membership' })) }, [plan])
  const set = (k: keyof Enquiry) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value })
  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const x: typeof err = {}
    if (f.name.trim().length < 2) x.name = 'Enter your full name.'
    if (!/^\S+@\S+\.\S+$/.test(f.email)) x.email = 'Enter a valid email address.'
    if (f.phone && f.phone.replace(/\D/g, '').length < 7) x.phone = 'Enter a phone number with at least 7 digits.'
    setErr(x); if (Object.keys(x).length) return
    setBusy(true); const r = await submitEnquiry(f); setBusy(false); setDone(r.ok)
  }
  if (done) return (
    <div className="ok" role="status"><Check size={40} /><h2 className="h3">Your membership enquiry has been received.</h2>
      <p className="muted">Selected: {f.membership}. This demo does not send email or store data yet; connect a backend to deliver enquiries to the gym.</p>
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
      <Button type="submit" disabled={busy}>{busy ? 'SENDING...' : 'SEND ENQUIRY'}</Button>
    </form>
  )
}
