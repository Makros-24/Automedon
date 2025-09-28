import React from 'react';
import { motion, type Variants } from 'motion/react';
import { Badge } from '@/components/ui/badge';
import { processSkillsWithIcons } from '@/utils/technologyIconManager';
import { type SkillCategory as SkillCategoryType } from '@/types';

interface SkillCategoryProps {
  category: SkillCategoryType;
  variants: Variants;
}

export const SkillCategory = ({ category, variants }: SkillCategoryProps) => {
  const IconComponent = category.icon;

  // Process skills with enhanced icons
  const processedSkills = React.useMemo(() =>
    processSkillsWithIcons(category.skills, 'w-3.5 h-3.5'),
    [category.skills]
  );

  return (
    <motion.div
      className="group/card relative"
      variants={variants}
      whileHover={{
        y: -5,
        scale: 1.02,
        transition: { duration: 0.2, ease: 'easeOut' },
      }}
    >
      <div className="relative p-6 rounded-2xl glass transition-all duration-300 h-full border border-white/10 hover:border-white/20 group-hover/card:bg-white/8 dark:group-hover/card:bg-white/5 group-hover/card:backdrop-blur-lg flex flex-col">
        <div className="flex flex-col flex-1 space-y-5">
          {/* Icon and title section */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl glass-light flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <IconComponent className="w-6 h-6 text-foreground/70 stroke-[1.5] group-hover:text-foreground transition-colors duration-300" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-foreground mb-1 group-hover:text-foreground transition-colors duration-300">
                {category.name}
              </h4>
              <div className="relative">
                <div className="w-20 h-0.5 bg-gradient-to-r from-foreground/40 via-foreground/60 to-transparent rounded-full" />
                {/* Hover highlight line */}
                <motion.div
                  className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-100"
                  initial={{ width: 0 }}
                  whileHover={{ width: '80px' }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>

          {/* Skills section */}
          <div className="flex flex-wrap gap-2 flex-1 content-start">
            {processedSkills.map((skill) => (
              <motion.div key={skill.name} variants={variants}>
                <Badge
                  variant="secondary"
                  className="bg-white/10 border border-foreground/8 dark:border-white/20 text-foreground/80 transition-colors duration-300 px-3 py-1 text-sm font-normal cursor-default flex items-center gap-1.5"
                >
                  <span className="group-hover/card:grayscale-0 grayscale transition-all duration-300 ease-out">
                    {skill.iconElement}
                  </span>
                  {skill.name}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};