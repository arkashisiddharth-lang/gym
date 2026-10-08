import { useEffect, useRef } from 'react'
import { gsap, reduced } from '../animations/gsap'
export type AthleteState = 'IDLE' | 'TRAIN' | 'POWER' | 'SPRINT' | 'RECOVER'
export const athleteStates: AthleteState[] = ['IDLE', 'TRAIN', 'POWER', 'SPRINT', 'RECOVER']
type Cfg = Record<string, gsap.TweenVars>
// Each state maps a layer selector to GSAP vars. Replace the SVG layers with your own asset and keep the same class names.
const CFG: Record<AthleteState, Cfg> = {
  IDLE: { '.a-body': { x: 0, y: 0, scale: 1, rotation: 0 }, '.a-armL': { rotation: 0 }, '.a-armR': { rotation: 0 }, '.a-bar': { y: 0 }, '.a-light': { opacity: 0.35 }, '.a-shadow': { scaleX: 1 }, '.a-bg': { x: 0 } },
  TRAIN: { '.a-body': { x: 0, y: -6, scale: 1.02, rotation: 0 }, '.a-armL': { rotation: -18 }, '.a-armR': { rotation: 18 }, '.a-bar': { y: -55 }, '.a-light': { opacity: 0.6 }, '.a-shadow': { scaleX: 1.05 }, '.a-bg': { x: -10 } },
  POWER: { '.a-body': { x: 0, y: -16, scale: 1.06, rotation: 0 }, '.a-armL': { rotation: -32 }, '.a-armR': { rotation: 32 }, '.a-bar': { y: -105 }, '.a-light': { opacity: 1 }, '.a-shadow': { scaleX: 0.85 }, '.a-bg': { x: -20 } },
  SPRINT: { '.a-body': { x: 24, y: -4, scale: 1.02, rotation: 7 }, '.a-armL': { rotation: -55 }, '.a-armR': { rotation: 50 }, '.a-bar': { y: 20 }, '.a-light': { opacity: 0.7 }, '.a-shadow': { scaleX: 1.2 }, '.a-bg': { x: -50 } },
  RECOVER: { '.a-body': { x: 0, y: 12, scale: 0.97, rotation: -2 }, '.a-armL': { rotation: 14 }, '.a-armR': { rotation: -14 }, '.a-bar': { y: 40 }, '.a-light': { opacity: 0.18 }, '.a-shadow': { scaleX: 1 }, '.a-bg': { x: 0 } },
}
export default function InteractiveAthlete({ state }: { state: AthleteState }) {
  const root = useRef<SVGSVGElement>(null)
  const first = useRef(true)
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!root.current) return
      const d = reduced() ? 0 : 0.8
      Object.entries(CFG[state]).forEach(([sel, vars]) =>
        gsap.to(sel, { ...vars, duration: first.current ? 0 : d, ease: 'power3.inOut', svgOrigin: sel.includes('arm') ? (sel.includes('L') ? '140 190' : '260 190') : '200 400', transformOrigin: sel.includes('shadow') ? '50% 50%' : undefined }))
      first.current = false
    }, root)
    return () => ctx.revert()
  }, [state])
  useEffect(() => {
    if (reduced()) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.a-reveal', { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.4, ease: 'power4.out', delay: 0.5 })
      gsap.to('.a-breath', { y: -6, duration: 2.4, yoyo: true, repeat: -1, ease: 'sine.inOut' })
    }, root)
    return () => ctx.revert()
  }, [])
  return (
    <svg ref={root} className="athlete" viewBox="0 0 400 500" role="img" aria-label="Stylised athlete lifting a barbell">
      <g className="a-bg"><circle cx="200" cy="230" r="170" fill="none" stroke="#c8ff2e" strokeOpacity=".25" /><circle cx="200" cy="230" r="120" fill="none" stroke="#f2efe8" strokeOpacity=".1" /><path d="M0 420H400M0 440H400" stroke="#f2efe8" strokeOpacity=".08" /></g>
      <polygon className="a-light" points="200,0 330,500 70,500" fill="#c8ff2e" opacity=".35" />
      <ellipse className="a-shadow" cx="200" cy="470" rx="110" ry="12" fill="#000" opacity=".7" />
      <g className="a-reveal"><g className="a-body"><g className="a-breath">
        <path d="M165 470l-8-130 30-8 13 60 13-60 30 8-8 130h-22l-5-70-8 70z" fill="#d9d5cb" />
        <path d="M130 195l140 0 -18 150H148z" fill="#f2efe8" /><path d="M150 200h100l-8 70H158z" fill="#c8ff2e" opacity=".9" />
        <circle cx="200" cy="150" r="30" fill="#e8e4da" /><path d="M170 146a30 30 0 0 1 60 0z" fill="#0a0a0a" />
        <g className="a-armL"><path d="M140 195L95 250l30 60" stroke="#f2efe8" strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" fill="none" /></g>
        <g className="a-armR"><path d="M260 195L305 250l-30 60" stroke="#f2efe8" strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" fill="none" /></g>
        <g className="a-bar"><rect x="30" y="306" width="340" height="8" fill="#8d8a83" /><rect x="40" y="276" width="16" height="68" fill="#c8ff2e" /><rect x="344" y="276" width="16" height="68" fill="#c8ff2e" /><rect x="62" y="286" width="12" height="48" fill="#f2efe8" /><rect x="326" y="286" width="12" height="48" fill="#f2efe8" /></g>
      </g></g></g>
    </svg>
  )
}
