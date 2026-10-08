import { useEffect, useLayoutEffect, useRef } from 'react'
import { animatePage, gsap, ScrollTrigger } from '../animations/gsap'
export function usePageAnim(deps: unknown[] = []) {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => { if (ref.current) animatePage(ref.current) }, ref)
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 400)
    return () => { window.clearTimeout(t); ctx.revert() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return ref
}
export function useMeta(title: string, description: string) {
  useEffect(() => {
    document.title = `Iron District | ${title}`
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  }, [title, description])
}
