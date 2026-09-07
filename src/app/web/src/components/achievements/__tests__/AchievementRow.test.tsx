import React from 'react';
import { render, screen } from '@/test-utils';
import { AchievementRow } from '../AchievementRow';
import type { Achievement } from '@/types';

const mockUseAchievements = jest.fn();
const mockUseAbout = jest.fn();

jest.mock('@/contexts/PortfolioDataContext', () => ({
  useAchievements: () => mockUseAchievements(),
  useAbout: () => mockUseAbout(),
}));

const makeAchievement = (overrides: Partial<Achievement> = {}): Achievement => ({
  icon: 'Award',
  number: '6',
  title: 'Years Experience',
  description: 'Building regulated financial platforms',
  ...overrides,
});

const six: Achievement[] = [
  makeAchievement(),
  makeAchievement({ number: '5', title: 'Major Projects', description: 'Banking and DevOps' }),
  makeAchievement({ number: '7', title: 'Financial Institutions', description: 'One codebase' }),
  makeAchievement({ number: '20K+', title: 'Users Served', description: 'Across platforms' }),
  makeAchievement({ number: '80%', title: 'Code Coverage', description: 'Quality first' }),
  makeAchievement({ number: '3', title: 'Certifications', description: 'AWS, NVIDIA, Anthropic' }),
];

function setup({ achievements = six }: { achievements?: Achievement[] } = {}) {
  mockUseAchievements.mockReturnValue({ achievements, loading: false, error: null });
  mockUseAbout.mockReturnValue({ about: { achievementsTitle: 'Key Achievements' } });
  return render(<AchievementRow />);
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('AchievementRow', () => {
  it('renders one figure per achievement', () => {
    setup();
    expect(screen.getAllByRole('listitem')).toHaveLength(6);
    expect(screen.getByText('20K+')).toBeInTheDocument();
    expect(screen.getByText('Code Coverage')).toBeInTheDocument();
  });

  it('labels the list instead of adding a heading inside the hero', () => {
    setup();
    expect(screen.getByRole('list', { name: 'Key Achievements' })).toBeInTheDocument();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('renders nothing when there are no achievements', () => {
    setup({ achievements: [] });
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  describe('descriptions', () => {
    it('keeps every description in the DOM for screen readers', () => {
      setup();
      // Revealed visually on hover/focus, but never aria-hidden - a reader
      // going through the list gets the context regardless of pointer.
      const description = screen.getByText('One codebase');
      expect(description).toBeInTheDocument();
      expect(description.closest('[aria-hidden="true"]')).toBeNull();
    });

    it('makes each figure focusable so the description is reachable without a pointer', () => {
      setup();
      screen.getAllByRole('listitem').forEach((figure) => {
        expect(figure).toHaveAttribute('tabindex', '0');
      });
    });

    it('opens the reveal upward, centred on its own number', () => {
      setup();
      const reveal = screen.getByText('One codebase');
      // Upward: downward landed the text on the CTA row below.
      expect(reveal).toHaveClass('bottom-full');
      // Centred by translating off a 50% offset, NOT by `inset-x-0 mx-auto`.
      // The reveal is wider than its grid column, and auto margins only centre a
      // box that fits - once it overflows, margin-left resolves to 0 and the
      // right margin absorbs the excess, throwing every one of them off-centre.
      expect(reveal).toHaveClass('left-1/2', '-translate-x-1/2');
      expect(reveal).not.toHaveClass('mx-auto');
    });

    it('omits the reveal entirely when an achievement has no description', () => {
      setup({ achievements: [makeAchievement({ description: '' })] });
      expect(screen.getAllByRole('listitem')).toHaveLength(1);
      expect(screen.getByText('Years Experience')).toBeInTheDocument();
    });
  });

  it('tones the numbers to match the hero job-title line, not full foreground', () => {
    setup();
    // Hero.tsx renders the job title at text-foreground/80. The figures support
    // that line, so they sit in the same tier rather than out-weighting it.
    expect(screen.getByText('20K+')).toHaveClass('text-foreground/80');
  });

  it('pins numbers to LTR so RTL locales do not reorder "20K+" into "+20K"', () => {
    setup();
    expect(screen.getByText('20K+')).toHaveAttribute('dir', 'ltr');
    expect(screen.getByText('80%')).toHaveAttribute('dir', 'ltr');
  });
});
