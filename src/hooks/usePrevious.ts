import { useEffect, useRef } from 'react'

export const usePrevious = <T>(value: T): T | null => {
  const previousValue = useRef<T | null>(null)

  useEffect(() => {
    previousValue.current = value
  }, [value])

  return previousValue.current
}
