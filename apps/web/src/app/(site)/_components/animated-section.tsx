'use client'

import { ReactNode } from 'react'
import { motion, MotionProps } from 'framer-motion'

interface AnimatedSectionProps extends MotionProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function AnimatedSection({
  children,
  className,
  delay = 0,
  ...motionProps
}: AnimatedSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5, delay }}
      className={className}
      {...motionProps}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedElement({
  children,
  className,
  delay = 0,
  ...motionProps
}: AnimatedSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay }}
      className={className}
      {...motionProps}
    >
      {children}
    </motion.div>
  )
}
