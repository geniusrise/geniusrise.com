import { useEffect } from "react"

export function useEffectAsync(effect: any, inputs: any) {
  useEffect(() => {
    effect()
  }, inputs)
}
