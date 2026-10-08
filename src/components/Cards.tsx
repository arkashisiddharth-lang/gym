import { ArrowUpRight } from 'lucide-react'
import { intensity, plans, programs, trainers, gallery } from '../data/data'
import { Button, TLink, RevealImage, Visual } from './ui'

export function ProgramCard({ p, i }: { p: (typeof programs)[number]; i: number }) {
  return (
    <TLink to="/programs" className="card pc">
      <div className="clip"><Visual seed={i} label={`${p.title} training`} /></div>
      <div className="cb"><h3>{p.title}</h3><p className="muted">{p.desc}</p>
        <p className="meta">{p.duration} / {intensity[i % 3]} intensity</p><ArrowUpRight className="ar" aria-hidden="true" /></div>
    </TLink>
  )
}
export function TrainerCard({ t, i, full }: { t: (typeof trainers)[number]; i: number; full?: boolean }) {
  return (
    <article className={'card tc' + (full ? ' full' : '')}>
      <div className="clip"><Visual seed={i + 3} label={`Portrait placeholder of ${t.name}`} /></div>
      <div className="cb"><h3>{t.name}</h3><p className="acc">{t.role}</p><p className="meta">{t.exp} experience</p>
        {full && <><p>{t.bio}</p><blockquote>{t.philosophy}</blockquote></>}
        {!full && <ArrowUpRight className="ar" aria-hidden="true" />}</div>
    </article>
  )
}
export function MembershipCard({ p, rec }: { p: (typeof plans)[number]; rec?: boolean }) {
  return (
    <article className={'plan' + (rec ? ' rec' : '')}>
      {rec && <span className="tag">RECOMMENDED</span>}
      <h3>{p.name}</h3><p className="muted">{p.tag}</p>
      <ul>{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
      <p className="meta">Rates on request</p>
      <Button to={`/contact?plan=${p.id}`}>SELECT PLAN</Button>
    </article>
  )
}
export function GalleryItem({ g }: { g: (typeof gallery)[number] }) {
  return (
    <figure className={'gi ' + g.size} data-gi>
      <Visual seed={g.id} label={`${g.title} (${g.cat.toLowerCase()})`} />
      <figcaption><b>{g.title}</b><span>{g.cat}</span></figcaption>
    </figure>
  )
}
export const Stats = () => (
  <div className="stats" data-stagger>
    {[[12, 'K+', 'WORKOUTS COMPLETED'], [48, '', 'WEEKLY SESSIONS'], [96, '%', 'MEMBER RETENTION'], [5, '', 'YEARS OF PERFORMANCE']].map(([n, s, l]) => (
      <div key={l as string}><strong data-count={n} data-suffix={s}>{n}{s}</strong><span>{l}</span></div>
    ))}
  </div>
)
export { RevealImage }
