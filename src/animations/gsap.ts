import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
export { gsap, ScrollTrigger }
export const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
type El = Element
const st = (trigger: El, start = 'top 88%') => ({ trigger, start, once: true })
export const revealUp = (el: El) => gsap.from(el, { y: 48, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: st(el) })
export const revealFade = (el: El) => gsap.from(el, { opacity: 0, duration: 1.1, ease: 'power2.out', scrollTrigger: st(el) })
export const scaleIn = (el: El) => gsap.from(el, { scale: 0.92, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: st(el) })
export const staggerText = (el: El) =>
  gsap.from(el.querySelectorAll('.line > span'), { yPercent: 115, duration: 1, stagger: 0.12, ease: 'power4.out',
    delay: Number((el as HTMLElement).dataset.delay || 0), scrollTrigger: st(el, 'top 95%') })
export const imageReveal = (el: El) => {
  gsap.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power4.inOut', scrollTrigger: st(el, 'top 90%') })
  gsap.from(el.querySelector('.vis'), { scale: 1.3, duration: 1.6, ease: 'power3.out', scrollTrigger: st(el, 'top 90%') })
}
export const parallaxImage = (el: El) =>
  gsap.to(el, { y: Number((el as HTMLElement).dataset.par || -40), ease: 'none', scrollTrigger: { trigger: el, scrub: true, start: 'top bottom', end: 'bottom top' } })
export const counterAnimation = (el: El) => {
  const t = el as HTMLElement, to = Number(t.dataset.count), o = { v: 0 }
  gsap.to(o, { v: to, duration: 1.8, ease: 'power2.out', scrollTrigger: st(el, 'top 92%'), onUpdate: () => { t.textContent = Math.round(o.v) + (t.dataset.suffix || '') } })
}
let overlay: HTMLElement | null = null
export const setOverlay = (el: HTMLElement | null) => { overlay = el }
export const pageExit = (done: () => void) => {
  if (!overlay || reduced()) return done()
  gsap.fromTo(overlay, { yPercent: 100 }, { yPercent: 0, duration: 0.4, ease: 'power3.in', onComplete: done })
}
export const pageEnter = () => {
  if (!overlay) return
  if (reduced()) return void gsap.set(overlay, { yPercent: -100 })
  gsap.fromTo(overlay, { yPercent: 0 }, { yPercent: -100, duration: 0.6, ease: 'power4.inOut' })
}
export function animatePage(root: HTMLElement) {
  if (reduced()) return
  const all = (s: string) => Array.from(root.querySelectorAll(s))
  all('[data-lines]').forEach(staggerText)
  all('[data-reveal]').forEach(revealUp)
  all('[data-fade]').forEach(revealFade)
  all('[data-scale]').forEach(scaleIn)
  all('[data-img]').forEach(imageReveal)
  all('[data-par]').forEach(parallaxImage)
  all('[data-count]').forEach(counterAnimation)
  all('[data-stagger]').forEach((p) => gsap.from(p.children, { y: 50, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out', scrollTrigger: st(p, 'top 85%') }))
}
