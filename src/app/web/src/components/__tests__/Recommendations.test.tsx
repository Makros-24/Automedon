import React from 'react';
import userEvent from '@testing-library/user-event';
import { fireEvent, render, screen } from '@/test-utils';
import { Recommendations } from '../Recommendations';
import type { Recommendation, RecommendationsData } from '@/types';

const mockUseRecommendations = jest.fn();
const mockUseLanguage = jest.fn();

jest.mock('@/contexts/PortfolioDataContext', () => ({
  useRecommendations: () => mockUseRecommendations(),
}));

jest.mock('@/contexts/LanguageContext', () => ({
  useLanguage: () => mockUseLanguage(),
}));

// The card renders next/image and its own markup; this suite is about the
// track, the dots and the loop.
jest.mock('../recommendations/RecommendationCard', () => ({
  RecommendationCard: ({ recommendation }: { recommendation: Recommendation }) => (
    <div>{recommendation.name}</div>
  ),
}));

const makeRecommendation = (id: number, name: string): Recommendation => ({
  id,
  name,
  title: 'Engineering Manager',
  quote: `Quote from ${name}`,
});

const three = [
  makeRecommendation(1, 'First Person'),
  makeRecommendation(2, 'Second Person'),
  makeRecommendation(3, 'Third Person'),
];

function setup({
  items = three,
  loading = false,
  error = null as string | null,
  isRTL = false,
  data,
}: {
  items?: Recommendation[];
  loading?: boolean;
  error?: string | null;
  isRTL?: boolean;
  data?: RecommendationsData | null;
} = {}) {
  const recommendations =
    data === undefined
      ? ({ title: 'Recommendations', description: 'What people said.', items } as RecommendationsData)
      : data;

  mockUseRecommendations.mockReturnValue({ recommendations, loading, error });
  mockUseLanguage.mockReturnValue({ isRTL });
  return render(<Recommendations />);
}

/** The active slide is whichever dot is marked aria-current. */
function activeIndex(): number {
  return screen
    .getAllByRole('button', { name: /Go to recommendation/ })
    .findIndex((dot) => dot.getAttribute('aria-current') === 'true');
}

const carousel = () => screen.getByRole('group', { name: 'Recommendations' });

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Recommendations', () => {
  // The section is absent, not merely empty: the test-utils render wraps
  // everything in ThemeProvider, which injects its own script tag, so the
  // container is never literally empty.
  const expectSectionAbsent = () => {
    expect(screen.queryByRole('heading', { name: 'Recommendations' })).not.toBeInTheDocument();
    expect(screen.queryByRole('group', { name: 'Recommendations' })).not.toBeInTheDocument();
  };

  it('renders nothing when the locale has no recommendations key', () => {
    setup({ data: null });
    expectSectionAbsent();
  });

  it('renders nothing when the items list is empty', () => {
    setup({ items: [] });
    expectSectionAbsent();
  });

  it('still renders while loading, so the section does not pop in and shift the page', () => {
    setup({ items: [], loading: true });
    expect(screen.getByRole('heading', { name: 'Recommendations' })).toBeInTheDocument();
  });

  describe('infinite track', () => {
    it('repeats the items so the wrap has runway in both directions', () => {
      setup();
      // Three copies in the DOM, resting in the middle one: two copies only
      // loops forwards, because browsers clamp scrollLeft at 0.
      expect(screen.getAllByText('First Person')).toHaveLength(3);
    });

    it('exposes each recommendation to assistive tech exactly once', () => {
      setup();
      // ...but only once in the accessibility tree, because the second copy is
      // aria-hidden. Otherwise every name would be announced twice.
      expect(screen.getAllByRole('group', { name: /of 3$/ })).toHaveLength(3);
    });

    it('labels each slide with its position', () => {
      setup();
      expect(screen.getByRole('group', { name: '1 of 3' })).toBeInTheDocument();
      expect(screen.getByRole('group', { name: '3 of 3' })).toBeInTheDocument();
    });
  });

  describe('controls', () => {
    it('has no arrow buttons', () => {
      setup();
      expect(screen.queryByRole('button', { name: /Next recommendation/ })).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /Previous recommendation/ })
      ).not.toBeInTheDocument();
    });

    it('shows one dot per recommendation, the first current', () => {
      setup();
      expect(screen.getAllByRole('button', { name: /Go to recommendation/ })).toHaveLength(3);
      expect(activeIndex()).toBe(0);
    });

    it('jumps to a recommendation when its dot is pressed', async () => {
      setup();
      await userEvent.click(
        screen.getByRole('button', { name: 'Go to recommendation 3 of 3' })
      );
      expect(activeIndex()).toBe(2);
    });
  });

  describe('keyboard', () => {
    it('moves forward on ArrowRight in LTR', () => {
      setup();
      fireEvent.keyDown(carousel(), { key: 'ArrowRight' });
      expect(activeIndex()).toBe(1);
    });

    it('wraps past the last recommendation rather than stopping', () => {
      setup();
      fireEvent.keyDown(carousel(), { key: 'End' });
      expect(activeIndex()).toBe(2);

      fireEvent.keyDown(carousel(), { key: 'ArrowRight' });
      expect(activeIndex()).toBe(0);
    });

    it('wraps backwards from the first recommendation', () => {
      setup();
      fireEvent.keyDown(carousel(), { key: 'ArrowLeft' });
      expect(activeIndex()).toBe(2);
    });

    it('moves backward on ArrowRight in RTL, matching visual order', () => {
      setup({ isRTL: true });
      fireEvent.keyDown(carousel(), { key: 'ArrowRight' });
      expect(activeIndex()).toBe(2);
    });

    it('jumps to the first and last with Home and End', () => {
      setup();
      fireEvent.keyDown(carousel(), { key: 'End' });
      expect(activeIndex()).toBe(2);

      fireEvent.keyDown(carousel(), { key: 'Home' });
      expect(activeIndex()).toBe(0);
    });
  });

  describe('source link', () => {
    it('sits on its own line under the description, not in a button below the track', () => {
      setup({
        data: {
          title: 'Recommendations',
          description: 'What people said.',
          ctaLabel: 'See them on LinkedIn',
          ctaUrl: 'https://www.linkedin.com/in/example/',
          items: three,
        },
      });

      const link = screen.getByRole('link', { name: 'See them on LinkedIn' });
      expect(link).toHaveAttribute('href', 'https://www.linkedin.com/in/example/');
      expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
      // Its own line: it no longer trails the description sentence, which made
      // it wrap mid-phrase and read as part of the prose.
      expect(link.closest('p')).not.toHaveTextContent('What people said.');
      // But still in the section header - not a CTA button under the carousel.
      expect(carousel()).not.toContainElement(link);
    });

    it('omits the link when no source URL is configured', () => {
      setup();
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });
  });
});
