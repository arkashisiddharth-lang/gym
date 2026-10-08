import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
const Ctx = createContext<{ on: boolean; set: (v: boolean) => void }>({ on: false, set: () => {} })
export const useTraining = () => useContext(Ctx)
export function TrainingProvider({ children }: { children: ReactNode }) {
  const [on, set] = useState(false)
  useEffect(() => { document.body.dataset.training = on ? 'on' : 'off' }, [on])
  return <Ctx.Provider value={{ on, set }}>{children}</Ctx.Provider>
}
export function TrainingHud() {
  const { on } = useTraining()
  return <div className="hud" aria-live="polite"><i className={on ? 'on' : ''} />TRAINING MODE: {on ? 'ON' : 'OFF'}</div>
}
