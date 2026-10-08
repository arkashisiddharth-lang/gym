import { useMemo, useRef, useState, useEffect } from 'react'
import { gsap, ScrollTrigger, reduced } from '../animations/gsap'
import { usePageAnim, useMeta } from '../hooks/hooks'
import { cats, gallery, plans, programs, trainers } from '../data/data'
import { Button, Lines, RevealImage, SectionHeading } from '../components/ui'
import { GalleryItem, MembershipCard, ProgramCard, Stats, TrainerCard } from '../components/Cards'
import InteractiveAthlete, { athleteStates } from '../components/InteractiveAthlete'
import type { AthleteState } from '../components/InteractiveAthlete'
import { useTraining } from '../components/training'
import ContactForm, { CONTACT } from '../components/ContactForm'

const Hero = ({ lines, eyebrow, meta }: { lines: string[]; eyebrow: string; meta: string }) => (
  <header className="phero"><p className="eyebrow">{eyebrow}</p><h1 className="h1"><Lines lines={lines} delay={0.4} /></h1><p className="lead" data-fade>{meta}</p></header>
)

export function Home() {
  useMeta('Premium Fitness Club', 'Iron District is a premium urban fitness club for strength, discipline, performance and transformation.')
  const ref = usePageAnim(), zone = useRef<HTMLDivElement>(null), { on, set } = useTraining()
  const [manual, setManual] = useState<AthleteState | null>(null)
  useEffect(() => {
    const t = ScrollTrigger.create({ trigger: zone.current, start: 'top 60%', end: 'bottom 40%', onToggle: (s) => set(s.isActive) })
    return () => { t.kill(); set(false) }
  }, [set])
  const state: AthleteState = manual ?? (on ? 'POWER' : 'IDLE')
  return (
    <div ref={ref}>
      <section className="hero">
        <div className="hero-t">
          <h1 className="h1 xl"><Lines lines={['BUILD.', 'BREAK.', 'REBUILD.']} delay={0.5} /></h1>
          <p className="lead" data-fade>Strength is built in the moments nobody sees.</p>
          <div className="row" data-stagger><Button to="/membership">START TRAINING</Button><Button to="/programs" ghost>EXPLORE THE DISTRICT</Button></div>
        </div>
        <div className="hero-a" data-par="-50"><InteractiveAthlete state={state} />
          <div className="chips" role="group" aria-label="Athlete state">{athleteStates.map((s) => <button key={s} aria-pressed={state === s} className={state === s ? 'on' : ''} onClick={() => setManual(manual === s ? null : s)}>{s}</button>)}</div></div>
      </section>
      <div ref={zone}>
        <section className="sec split">
          <SectionHeading eyebrow="Philosophy" lines={['DISCIPLINE', 'OVER', 'MOTIVATION.']} />
          <div><p className="lead" data-reveal>Motivation is a mood. Discipline is a system. We coach the system: show up, do the work, record it, repeat.</p>
            <p className="muted" data-reveal>Every session at Iron District has a purpose, a standard and a coach who notices when you slip.</p>
            <RevealImage seed={2} label="Athletes training on the main floor" par={-30} /></div>
        </section>
        <section className="sec"><SectionHeading eyebrow="Programs" lines={['TRAIN WITH', 'PURPOSE.']} />
          <div className="grid3" data-stagger>{programs.slice(0, 3).map((p, i) => <ProgramCard key={p.title} p={p} i={i} />)}</div>
          <Button to="/programs">VIEW ALL PROGRAMS</Button></section>
        <section className="sec"><SectionHeading eyebrow="Performance" lines={['NUMBERS', 'DON’T LIE.']} /><Stats /></section>
      </div>
      <section className="sec"><SectionHeading eyebrow="Trainers" lines={['COACHES', 'WHO COACH.']} />
        <div className="grid3" data-stagger>{trainers.slice(0, 3).map((t, i) => <TrainerCard key={t.name} t={t} i={i} />)}</div><Button to="/trainers">MEET THE TRAINERS</Button></section>
      <section className="sec"><SectionHeading eyebrow="Membership" lines={['THREE LEVELS.', 'ONE STANDARD.']} />
        <div className="plans" data-stagger>{plans.map((p) => <div className="plan mini" key={p.id}><h3>{p.name}</h3><p className="muted">{p.tag}</p></div>)}</div><Button to="/membership">CHOOSE YOUR MEMBERSHIP</Button></section>
      <section className="sec"><SectionHeading eyebrow="Gallery" lines={['INSIDE', 'THE DISTRICT']} />
        <div className="gal" data-stagger>{gallery.filter((_, i) => [0, 1, 2, 3, 4].includes(i)).map((g) => <GalleryItem key={g.id} g={g} />)}</div><Button to="/gallery">VIEW FULL GALLERY</Button></section>
      <section className="sec cta"><h2 className="h1 xl"><Lines lines={['READY TO ENTER', 'THE DISTRICT?']} /></h2><Button to="/membership">START YOUR MEMBERSHIP</Button></section>
    </div>
  )
}
export function Programs() {
  useMeta('Training Programs', 'Strength, conditioning, performance, mobility, boxing and personal training at Iron District.')
  const ref = usePageAnim()
  return (<div ref={ref}><Hero eyebrow="Programs" lines={['TRAIN WITH', 'PURPOSE.']} meta="Six programs. One standard of coaching." />
    {programs.map((p, i) => (
      <section key={p.title} className={'sec prog' + (i % 2 ? ' flip' : '')}><RevealImage seed={i} label={`${p.title} program`} par={-30} />
        <div><h2 className="h2"><Lines lines={[p.title]} /></h2><p className="lead" data-reveal>{p.desc}</p>
          <dl className="dl" data-reveal><dt>Difficulty</dt><dd>{p.difficulty}</dd><dt>Duration</dt><dd>{p.duration}</dd><dt>Training style</dt><dd>{p.style}</dd><dt>Suitable for</dt><dd>{p.suitable}</dd></dl>
          <Button to="/contact">ENQUIRE ABOUT THIS PROGRAM</Button></div></section>))}</div>)
}
export function Trainers() {
  useMeta('Trainers', 'Meet the coaches behind Iron District: strength, performance, boxing and mobility specialists.')
  const ref = usePageAnim()
  return (<div ref={ref}><Hero eyebrow="Trainers" lines={['THE PEOPLE BEHIND', 'THE PERFORMANCE.']} meta="Placeholder profiles. Replace with your real team." />
    <section className="sec grid2" data-stagger>{trainers.map((t, i) => <TrainerCard key={t.name} t={t} i={i} full />)}</section></div>)
}
export function Membership() {
  useMeta('Membership', 'Choose a District, Performance or Elite membership and send an enquiry to Iron District.')
  const ref = usePageAnim()
  return (<div ref={ref}><Hero eyebrow="Membership" lines={['CHOOSE', 'YOUR LEVEL.']} meta="Select a plan to send an enquiry. No payment is taken online." />
    <section className="sec plans" data-stagger>{plans.map((p) => <MembershipCard key={p.id} p={p} rec={p.id === 'performance'} />)}</section></div>)
}
export function About() {
  useMeta('About', 'The story, philosophy and space behind Iron District.')
  const ref = usePageAnim()
  const blocks: [string, string][] = [['OUR STORY', 'Iron District started as a single rack in a converted warehouse and a rule: no shortcuts.'], ['WHY IRON DISTRICT', 'Because serious training deserves a serious room, and a community that holds you to it.'], ['OUR PHILOSOPHY', 'Discipline over motivation. Measure, repeat, improve.'], ['THE SPACE', 'Open floor, heavy kit, concrete and good light. Built to train, not to pose.'], ['OUR APPROACH', 'Assess, program, coach, review. Every member leaves each session with a number to beat.']]
  return (<div ref={ref}><Hero eyebrow="About" lines={['BUILT ON', 'DISCIPLINE.']} meta="Placeholder story. Replace with the gym’s real history." />
    {blocks.map(([h, t], i) => <section key={h} className={'sec prog' + (i % 2 ? ' flip' : '')}><RevealImage seed={i + 1} label={h} par={-30} /><div><h2 className="h2"><Lines lines={[h]} /></h2><p className="lead" data-reveal>{t}</p></div></section>)}
    <section className="sec"><SectionHeading eyebrow="Milestones" lines={['THE TIMELINE']} />
      <ol className="tl" data-stagger>{[['Year 1', 'Doors open with one rack and a rule.'], ['Year 2', 'Performance testing introduced.'], ['Year 3', 'Boxing and mobility programs added.'], ['Year 5', 'Thousands of workouts and a full coaching team.']].map(([y, t]) => <li key={y}><b>{y}</b><span>{t}</span></li>)}</ol><Stats /></section></div>)
}
export function Gallery() {
  useMeta('Gallery', 'Training, people, space, community and performance at Iron District.')
  const ref = usePageAnim(), grid = useRef<HTMLDivElement>(null), [cat, setCat] = useState('ALL')
  const items = useMemo(() => gallery.filter((g) => cat === 'ALL' || g.cat === cat), [cat])
  useEffect(() => {
    if (reduced() || !grid.current) return
    const c = gsap.context(() => { gsap.fromTo('[data-gi]', { opacity: 0, clipPath: 'inset(100% 0 0 0)' }, { opacity: 1, clipPath: 'inset(0% 0 0 0)', duration: 0.8, stagger: 0.06, ease: 'power3.out' }) }, grid)
    return () => c.revert()
  }, [cat])
  return (<div ref={ref}><Hero eyebrow="Gallery" lines={['INSIDE', 'THE DISTRICT.']} meta="Placeholder visuals. Swap in real photography." />
    <section className="sec"><div className="filters" role="group" aria-label="Filter gallery">{cats.map((c) => <button key={c} aria-pressed={cat === c} className={cat === c ? 'on' : ''} onClick={() => setCat(c)}>{c}</button>)}</div>
      <div className="gal" ref={grid}>{items.map((g) => <GalleryItem key={g.id} g={g} />)}</div></section></div>)
}
export function Contact() {
  useMeta('Contact', 'Send a membership or training enquiry to Iron District.')
  const ref = usePageAnim()
  return (<div ref={ref}><Hero eyebrow="Contact" lines={['LET’S BUILD YOUR', 'NEXT LEVEL.']} meta="Send an enquiry and the team will get back to you." />
    <section className="sec split"><div className="info" data-reveal><h2 className="h3">IRON DISTRICT</h2><p className="muted">Placeholder details. Replace before launch.</p>
      <dl className="dl"><dt>Opening hours</dt><dd>[Mon-Fri 05:00-22:00, Sat-Sun 07:00-18:00]</dd><dt>Location</dt><dd>[Street address, City]</dd><dt>Phone</dt><dd>{CONTACT.phone}</dd><dt>Email</dt><dd>{CONTACT.email}</dd></dl></div>
      <div data-reveal><ContactForm /></div></section></div>)
}
