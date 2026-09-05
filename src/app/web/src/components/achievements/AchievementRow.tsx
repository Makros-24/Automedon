import { useAbout, useAchievements } from '@/contexts/PortfolioDataContext';
import { AchievementStat } from './AchievementStat';

/**
 * The hero's row of hard numbers.
 *
 * Renders bare into the hero's own stack - no section, no heading, no surface.
 * Earlier passes gave this its own band under the hero, first as a card grid
 * and then as a glass bar; both read as a separate component competing with
 * the hero rather than as part of its claim.
 *
 * No loading branch: Hero gates on the same context and shows a spinner until
 * the fetch resolves, so this only ever renders with data in hand.
 */
export function AchievementRow() {
  const { achievements } = useAchievements();
  const { about } = useAbout();

  if (achievements.length === 0) {
    return null;
  }

  return (
    <ul
      // No visible heading - a labelled list keeps the figures findable for
      // screen readers without putting a section header inside the hero.
      aria-label={about?.achievementsTitle || 'Key Achievements'}
      // Fills the hero's own max-w-4xl at md so the longest label
      // ("Financial Institutions") still fits on one line and the row stays
      // level; at 3xl it wrapped and left that column ragged.
      className="mx-auto grid max-w-2xl grid-cols-3 gap-x-4 gap-y-6 md:max-w-4xl md:grid-cols-6 md:gap-x-5"
    >
      {achievements.map((achievement) => (
        <AchievementStat key={achievement.title} achievement={achievement} />
      ))}
    </ul>
  );
}
