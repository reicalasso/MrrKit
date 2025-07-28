'use client'

import { useCallback, useRef, useState } from 'react'

interface SwipeDirection {
  direction: 'left' | 'right' | 'up' | 'down'
  distance: number
  velocity: number
}

interface TouchState {
  startX: number
  startY: number
  startTime: number
  currentX: number
  currentY: number
  deltaX: number
  deltaY: number
  isSwiping: boolean
}

export function useSwipe(
  onSwipe?: (direction: SwipeDirection) => void,
  threshold = 50,
  velocityThreshold = 0.3
) {
  const touchState = useRef<TouchState>({
    startX: 0,
    startY: 0,
    startTime: 0,
    currentX: 0,
    currentY: 0,
    deltaX: 0,
    deltaY: 0,
    isSwiping: false
  })

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    touchState.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now(),
      currentX: touch.clientX,
      currentY: touch.clientY,
      deltaX: 0,
      deltaY: 0,
      isSwiping: false
    }
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchState.current) return

    const touch = e.touches[0]
    const deltaX = touch.clientX - touchState.current.startX
    const deltaY = touch.clientY - touchState.current.startY

    touchState.current.currentX = touch.clientX
    touchState.current.currentY = touch.clientY
    touchState.current.deltaX = deltaX
    touchState.current.deltaY = deltaY

    // Determine if this is a swipe gesture
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    if (distance > 10) {
      touchState.current.isSwiping = true
    }
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchState.current || !touchState.current.isSwiping) return

    const { deltaX, deltaY, startTime } = touchState.current
    const duration = Date.now() - startTime
    const velocity = Math.sqrt(deltaX * deltaX + deltaY * deltaY) / duration

    // Only trigger swipe if it meets threshold and velocity requirements
    if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
      if (velocity > velocityThreshold) {
        let direction: SwipeDirection['direction']
        let distance: number

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          direction = deltaX > 0 ? 'right' : 'left'
          distance = Math.abs(deltaX)
        } else {
          direction = deltaY > 0 ? 'down' : 'up'
          distance = Math.abs(deltaY)
        }

        onSwipe?.({
          direction,
          distance,
          velocity
        })
      }
    }

    // Reset state
    touchState.current.isSwiping = false
  }, [onSwipe, threshold, velocityThreshold])

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    isSwiping: touchState.current?.isSwiping || false
  }
}

export function useLongPress(
  onLongPress: () => void,
  delay = 500
) {
  const [isPressed, setIsPressed] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const positionRef = useRef({ x: 0, y: 0 })

  const start = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    
    positionRef.current = { x: clientX, y: clientY }
    setIsPressed(true)
    
    timeoutRef.current = setTimeout(() => {
      onLongPress()
    }, delay)
  }, [onLongPress, delay])

  const clear = useCallback((e?: React.TouchEvent | React.MouseEvent) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsPressed(false)
    
    // Check if we moved too much (shouldn't trigger long press)
    if (e) {
      const clientX = 'touches' in e ? e.changedTouches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.changedTouches[0].clientY : e.clientY
      
      const distance = Math.sqrt(
        Math.pow(clientX - positionRef.current.x, 2) + 
        Math.pow(clientY - positionRef.current.y, 2)
      )
      
      if (distance > 10 && timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return {
    onTouchStart: start,
    onTouchEnd: clear,
    onTouchMove: clear,
    onMouseDown: start,
    onMouseUp: clear,
    onMouseLeave: clear,
    isPressed
  }
}

export function useDoubleTap(
  onDoubleTap: () => void,
  delay = 300
) {
  const lastTapRef = useRef<number>(0)

  const handleTap = useCallback(() => {
    const now = Date.now()
    if (now - lastTapRef.current < delay) {
      onDoubleTap()
      lastTapRef.current = 0
    } else {
      lastTapRef.current = now
    }
  }, [onDoubleTap, delay])

  return {
    onTouchEnd: handleTap,
    onClick: handleTap
  }
}
