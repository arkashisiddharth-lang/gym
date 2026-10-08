import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { pageExit } from '../animations/gsap'

export function useGo() {
  const nav = useNavigate(), loc = useLocation()
  return (to: string) => { if (to !== loc.pathname + loc.search) pageExit(() => nav(to)) }
}
type LP = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }
export function TLink({ to, onClick, children, ...p }: LP) {
  const go = useGo()
  return (
    <a href={to} {...p} onClick={(e) => {
      onClick?.(e)
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
      e.preventDefault(); go(to)
    }}>{children}</a>
  )
}
export function Button({ to, children, ghost, type, onClick, disabled }: { to?: string; children: ReactNode; ghost?: boolean; type?: 'button' | 'submit'; onClick?: () => void; disabled?: boolean }) {
  const cls = 'btn' + (ghost ? ' ghost' : '')
  const inner = <><span className="btn-t">{children}</span><ArrowRight size={18} className="btn-a" aria-hidden="true" /></>
  return to ? <TLink to={to} className={cls}>{inner}</TLink> : <button type={type || 'button'} className={cls} onClick={onClick} disabled={disabled}>{inner}</button>
}
export function Lines({ lines, className = '', delay = 0 }: { lines: string[]; className?: string; delay?: number }) {
  return <span className={'lines ' + className} data-lines data-delay={delay}>{lines.map((l, i) => <span className="line" key={i}><span>{l}</span></span>)}</span>
}
export function SectionHeading({ eyebrow, lines, as: H = 'h2' }: { eyebrow?: string; lines: string[]; as?: 'h1' | 'h2' }) {
  return <div className="sh">{eyebrow && <p className="eyebrow" data-fade>{eyebrow}</p>}<H className="h2"><Lines lines={lines} /></H></div>
}
export function Visual({ seed = 0, label, className = '' }: { seed?: number; label: string; className?: string }) {
  const s = seed % 9
  return (
    <div className={'vis ' + className} role="img" aria-label={label}>
      <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id={`vg${s}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={s % 3 === 0 ? '#1d2410' : '#1b1b1b'} /><stop offset="1" stopColor="#070707" /></linearGradient>
          <pattern id={`vp${s}`} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform={`rotate(${30 + s * 12})`}><rect width="2" height="14" fill="#f2efe8" opacity=".05" /></pattern>
        </defs>
        <rect width="400" height="500" fill={`url(#vg${s})`} /><rect width="400" height="500" fill={`url(#vp${s})`} />
        <polygon points={`${40 + s * 20},500 ${200 + s * 10},${120 + s * 12} ${330 - s * 8},500`} fill="#c8ff2e" opacity=".07" />
        <circle cx={90 + s * 28} cy={150 + (s % 4) * 40} r={60 + s * 6} fill="none" stroke="#c8ff2e" strokeOpacity=".35" strokeWidth="2" />
        <text x="24" y="470" fontSize="120" fontWeight="900" fill="#f2efe8" opacity=".08" fontFamily="Impact,Arial Narrow,sans-serif">{String(s + 1).padStart(2, '0')}</text>
      </svg>
    </div>
  )
}
export function RevealImage({ seed, label, par, className = '' }: { seed: number; label: string; par?: number; className?: string }) {
  return <figure className={'ri ' + className} data-img {...(par ? { 'data-par': par } : {})}><Visual seed={seed} label={label} /></figure>
}
