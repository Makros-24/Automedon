import React from 'react';
import { motion, type Variants } from 'motion/react';
import { type Achievement as AchievementType } from '@/types';

interface AchievementProps {
  achievement: AchievementType;
  variants: Variants;
}

export const Achievement = ({ achievement, variants }: AchievementProps) => {
  return (
    <motion.div
      className="text-center group"
      variants={variants}
      whileHover={{
        y: -3,
        scale: 1.05,
        transition: { duration: 0.2, ease: 'easeOut' },
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
  );
};