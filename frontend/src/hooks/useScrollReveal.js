import { useEffect, useRef } from 'react'

const useScrollReveal = (options = {}) => {
  const {
    triggerOnce = false,
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
  } = options

  const ref = useRef(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            element.classList.add('reveal-visible')
          } else if (!triggerOnce) {
            element.classList.remove('reveal-visible')
          }
        })
      },
      {
        threshold,
        rootMargin,
      }
    )

    observer.observe(element)

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [triggerOnce, threshold, rootMargin])

  return { ref, inView: false }
}

export default useScrollReveal