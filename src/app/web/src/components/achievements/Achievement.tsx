import React from 'react'
import { motion } from 'motion/react'
import { useInViewOnce } from '@/hooks/useInViewOnce'
import { type Achievement as AchievementType } from '@/types'

interface AchievementProps {
  achievement: AchievementType
  index: number
}

export const Achievement = ({ achievement, index }: AchievementProps) => {
  const { ref: cardRef, isInView } = useInViewOnce({ 
    threshold: 0.3, 
    rootMargin: '0px 0px -10% 0px' 
  })

  return (
    <motion.div
      ref={cardRef}
      className="text-center group"
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.9 }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.15, 
        ease: [0.23, 1, 0.32, 1] 
      }}
      whileHover={{ 
        y: -3,
        scale: 1.05,
        transition: { duration: 0.2, ease: 'easeOut' }
      }}
    >
      <div className="relative p-6 rounded-2xl glass glass-hover transition-all duration-300 group-hover:bg-white/5">
        <div className="w-12 h-12 mx-auto mb-4 rounded-xl glass-light flex items-center justify-center">
          <div className="text-foreground/70">
            {achievement.icon}
          </div>
        </div>
        <div className="text-3xl font-bold text-foreground mb-2">
          {achievement.number}
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {achievement.title}
        </h3>
        <p className="text-sm text-foreground/70">
          {achievement.description}
        </p>
      </div>
    </motion.div>
  )
}