import React from 'react'
import { motion } from 'motion/react'
import { useInViewOnce } from '@/hooks/useInViewOnce'
import { type BaseComponentProps, type InViewOptions } from '@/types'

interface AnimatedSectionProps extends BaseComponentProps {
  as?: keyof JSX.IntrinsicElements
  animation?: 'fadeInUp' | 'fadeIn' | 'slideInLeft' | 'slideInRight' | 'scale'
  delay?: number
  duration?: number
  inViewOptions?: InViewOptions
}

const animationVariants = {
  fadeInUp: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 }
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 }
  },
  slideInLeft: {
    initial: { opacity: 0, x: -40 },
    animate: { opacity: 1, x: 0 }
  },
  slideInRight: {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 }
  },
  scale: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 }
  }
}

export const AnimatedSection = ({ 
  children, 
  className, 
  as = 'div',
  animation = 'fadeInUp',
  delay = 0,
  duration = 0.8,
  inViewOptions = {},
  ...props 
}: AnimatedSectionProps) => {
  const { ref, isInView } = useInViewOnce(inViewOptions)
  const MotionComponent = motion[as] as React.ComponentType<React.HTMLAttributes<HTMLElement>>
  const variant = animationVariants[animation]

  return (
    <MotionComponent
      ref={ref}
      className={className}
      initial={variant.initial}
      animate={isInView ? variant.animate : variant.initial}
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