import React from 'react'
import useScrollReveal from '../../hooks/useScrollReveal'

const ScrollReveal = ({ 
  children, 
  className = '', 
  direction = 'up', 
  delay = 0,
  triggerOnce = false,
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px'
}) => {
  const { ref, inView } = useScrollReveal({ triggerOnce, threshold, rootMargin })

  const directionClass = {
    up: 'reveal-up',
    down: 'reveal-up',
    left: 'reveal-left',
    right: 'reveal-right',
    scale: 'reveal-scale',
    rotate: 'reveal-rotate',
    fade: '',
  }[direction] || 'reveal-up'

  const delayClass = delay ? `delay-${delay}` : ''

  return (
    <div
      ref={ref}
      className={`reveal-item ${directionClass} ${delayClass} ${className}`}
    >
      {children}
    </div>
  )
}

export default ScrollReveal