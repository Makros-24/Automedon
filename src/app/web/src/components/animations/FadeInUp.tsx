import React from 'react'
import { motion } from 'motion/react'
// import { animationPresets } from '@/constants/animations'
import { type BaseComponentProps } from '@/types'

interface FadeInUpProps extends BaseComponentProps {
  delay?: number
  duration?: number
  distance?: number
  as?: keyof JSX.IntrinsicElements
}

export const FadeInUp = ({ 
  children, 
  className, 
  delay = 0, 
  duration = 0.8, 
  distance = 30,
  as = 'div',
  ...props 
}: FadeInUpProps) => {
  const MotionComponent = motion[as] as React.ComponentType<React.HTMLAttributes<HTMLElement>>

  return (
    <MotionComponent
      className={className}
      initial={{ opacity: 0, y: distance }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration, 
        delay, 
        ease: [0.23, 1, 0.32, 1] 
      }}
      {...props}
    >
      {children}
    </MotionComponent>
  )
}