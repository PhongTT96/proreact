import { useCallback, useEffect, useRef, useState } from 'react'

const PULL_THRESHOLD = 72
const MAX_PULL = 110

export function PullToRefresh({ onRefresh, children, disabled = false }) {
  const [pull, setPull] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const startY = useRef(0)
  const pulling = useRef(false)
  const pullRef = useRef(0)
  const containerRef = useRef(null)

  useEffect(() => {
    pullRef.current = pull
  }, [pull])

  const isAtTop = useCallback(() => window.scrollY <= 2, [])

  const resetPull = useCallback(() => {
    pulling.current = false
    setPull(0)
  }, [])

  const runRefresh = useCallback(async () => {
    setRefreshing(true)
    setPull(PULL_THRESHOLD)
    try {
      await onRefresh()
    } finally {
      setRefreshing(false)
      resetPull()
    }
  }, [onRefresh, resetPull])

  useEffect(() => {
    const el = containerRef.current
    if (!el || disabled) return undefined

    const onTouchStart = (event) => {
      if (refreshing || !isAtTop()) return
      startY.current = event.touches[0].clientY
      pulling.current = true
    }

    const onTouchMove = (event) => {
      if (!pulling.current || refreshing) return
      const delta = event.touches[0].clientY - startY.current
      if (delta > 0 && isAtTop()) {
        event.preventDefault()
        setPull(Math.min(delta * 0.45, MAX_PULL))
      } else if (delta <= 0) {
        resetPull()
      }
    }

    const onTouchEnd = () => {
      if (!pulling.current) return
      const shouldRefresh = pullRef.current >= PULL_THRESHOLD
      pulling.current = false
      if (shouldRefresh) {
        void runRefresh()
      } else {
        resetPull()
      }
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    el.addEventListener('touchcancel', onTouchEnd, { passive: true })

    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
      el.removeEventListener('touchcancel', onTouchEnd)
    }
  }, [disabled, refreshing, isAtTop, resetPull, runRefresh])

  const hint = refreshing
    ? 'Đang làm mới...'
    : pull >= PULL_THRESHOLD
      ? 'Thả để làm mới'
      : 'Kéo xuống để làm mới'

  return (
    <div ref={containerRef} className="pull-to-refresh-wrap">
      <div
        className={`pull-to-refresh-indicator ${refreshing ? 'is-refreshing' : ''}`}
        style={{ height: pull > 0 || refreshing ? Math.max(pull, refreshing ? PULL_THRESHOLD : 0) : 0 }}
        aria-hidden={pull <= 0 && !refreshing}
      >
        <span className={`pull-to-refresh-spinner ${refreshing ? 'spin' : ''}`} />
        <span className="pull-to-refresh-text">{hint}</span>
      </div>
      {children}
    </div>
  )
}
