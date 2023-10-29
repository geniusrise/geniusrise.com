/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"

export const useContainerDimensions = (myRef: any) => {
  const getDimensions = () => {
    if (myRef.current)
      return {
        width: myRef.current.offsetWidth,
        height: myRef.current.offsetHeight,
      }
    else
      return {
        width: 0,
        height: 0,
      }
  }

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const handleResize = () => {
      setDimensions(getDimensions())
    }

    if (myRef.current) {
      setDimensions(getDimensions())
    }

    window.addEventListener("resize", handleResize)
    setTimeout(() => {
      handleResize()
    }, 100)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [myRef])

  return dimensions
}
