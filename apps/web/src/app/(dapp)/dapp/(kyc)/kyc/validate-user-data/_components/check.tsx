'use client'

import { useEffect, useRef } from 'react'
import lottie from 'lottie-web'

export function CheckAnimation() {
  const animationContainer = useRef(null)

  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: animationContainer.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/assets/animation/check-animation.json',
    })

    return () => anim.destroy()
  }, [])

  return <div ref={animationContainer} style={{ width: 64, height: 64 }}></div>
}
