import DeviceDetector from "device-detector-js"
import { useState, useEffect } from "react"

export const xxs = window.matchMedia("(min-width:320px)").matches
export const xs = window.matchMedia("(min-width:481px)").matches
export const s = window.matchMedia("(min-width:641px)").matches
export const m = window.matchMedia("(min-width:961px)").matches
export const l = window.matchMedia("(min-width:1025px)").matches
export const xl = window.matchMedia("(min-width:1281px)").matches
export const xxl = window.matchMedia("(min-width:2281px)").matches

const deviceDetector = new DeviceDetector()
export const device = deviceDetector.parse(navigator.userAgent)?.device?.type || ""
export const is4K = xxl

console.log(device, "xxs", xxs, "xs", xs, "s", s, "m", m, "l", l, "xl", xl, "is4K", is4K)

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window
  return {
    width,
    height,
  }
}

export function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions())

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions())
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return windowDimensions
}
