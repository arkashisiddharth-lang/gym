import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { AtSign, Play, Users, X, Menu } from 'lucide-react'
import { gsap, pageEnter, reduced, ScrollTrigger, setOverlay } from '../animations/gsap'
import { nav, programs } from '../data/data'
import { Button, TLink, useGo } from './ui'
import { TrainingHud } from './training'

function Navbar() {
  const [open, setOpen] = useState(false), [scrolled, setScrolled] = useState(false)
  const menu = useRef<HTMLDivElement>(null), mounted = useRef(false), loc = useLocation(), go = useGo()
  useEffect(() => { const f = () => setScrolled(window.scrollY > 40); f(); window.addEventListener('scroll', f, { passive: true }); return () => window.removeEventListener('scroll', f) }, [])
  useEffect(() => setOpen(false), [loc.pathname])
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = '' } }, [open])
  useEffect(() => {
    const m = menu.current; if (!m) return
    const k = reduced() ? 0 : 1
    if (open) {
      gsap.set(m, { visibility: 'visible' })
      gsap.fromTo(m, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.6 * k, ease: 'power4.inOut' })
      gsap.fromTo(m.querySelectorAll('.m-link > span'), { yPercent: 115 }, { yPercent: 0, stagger: 0.06 * k, duration: 0.7 * k, delay: 0.25 * k, ease: 'power3.out' })
    } else if (mounted.current) gsap.to(m, { clipPath: 'inset(0 0 100% 0)', duration: 0.45 * k, ease: 'power3.inOut', onComplete: () => { gsap.set(m, { visibility: 'hidden' }) } })
    mounted.current = true
  }, [open])
  return (
    <header className={'nav' + (scrolled ? ' scrolled' : '')}>
      <TLink to="/" className="logo" aria-label="Iron District home">IRON<b>DISTRICT</b></TLink>
      <nav aria-label="Primary" className="nav-links">
        {nav.map(([to, l]) => <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => 'nl' + (isActive ? ' act' : '')} onClick={(e) => { e.preventDefault(); go(to) }}>{l}</NavLink>)}
      </nav>
      <div className="nav-cta"><Button to="/membership">JOIN THE DISTRICT</Button></div>
      <button className="burger" aria-expanded={open} aria-controls="mm" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      <div id="mm" ref={menu} className="mm" aria-hidden={!open}>
        <nav aria-label="Mobile">{nav.map(([to, l]) => <TLink key={to} to={to} className="m-link" tabIndex={open ? 0 : -1}><span>{l}</span></TLink>)}</nav>
      </div>
    </header>
  )
}
function Footer() {
  return (
    <footer className="foot">
      <div className="foot-big" aria-hidden="true">IRON DISTRICT</div>
      <div className="foot-grid">
        <div><p className="muted">A premium urban fitness club for strength, discipline and performance.</p><p className="muted">[Location placeholder]</p>
          <div className="soc">{[AtSign, Play, Users].map((I, i) => <a key={i} href="#" aria-label={['Instagram', 'YouTube', 'Facebook'][i]}><I size={20} /></a>)}</div></div>
        <div><h3>Navigate</h3>{nav.map(([to, l]) => <TLink key={to} to={to}>{l}</TLink>)}</div>
        <div><h3>Programs</h3>{programs.slice(0, 5).map((p) => <TLink key={p.title} to="/programs">{p.title}</TLink>)}</div>
        <div><h3>Membership</h3><TLink to="/contact?plan=district">DISTRICT</TLink><TLink to="/contact?plan=performance">PERFORMANCE</TLink><TLink to="/contact?plan=elite">ELITE</TLink><br /><Button to="/membership">JOIN THE DISTRICT</Button></div>
      </div>
      <p className="muted copy">© {new Date().getFullYear()} Iron District. All rights reserved.</p>
    </footer>
  )
}
export default function Layout() {
  const loc = useLocation(), wipe = useRef<HTMLDivElement>(null), bar = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => { setOverlay(wipe.current); return () => setOverlay(null) }, [])
  useLayoutEffect(() => { window.scrollTo(0, 0); pageEnter() }, [loc.pathname])
  useEffect(() => {
    const t = ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (s) => { if (bar.current) bar.current.style.transform = `scaleX(${s.progress})` } })
    return () => t.kill()
  }, [loc.pathname])
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <div className="prog" ref={bar} aria-hidden="true" />
      <Navbar /><TrainingHud />
      <main id="main" key={loc.pathname}><Outlet /></main>
      <Footer />
      <div className="wipe" ref={wipe} aria-hidden="true" />
    </>
  )
}
