import React from 'react';
import { render, screen } from '@/test-utils';
import { RecommendationCard } from '../RecommendationCard';
import type { Recommendation } from '@/types';

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} data-testid="avatar" />
  ),
}));

const base: Recommendation = {
  id: 1,
  name: 'Salah GHARIANI',
  title: 'Product Owner | Business Analyst',
  quote: 'An opening sentence. The single best line. A closing sentence.',
};

describe('RecommendationCard', () => {
  it('shows the curated pull quote rather than the full text', () => {
    render(
      <RecommendationCard
        recommendation={{ ...base, highlight: 'The single best line.' }}
      />
    );
    expect(screen.getByText('The single best line.')).toBeInTheDocument();
    expect(screen.queryByText(/An opening sentence/)).not.toBeInTheDocument();
  });

  it('falls back to the full quote when no highlight is curated', () => {
    render(<RecommendationCard recommendation={base} />);
    expect(screen.getByText(/An opening sentence/)).toBeInTheDocument();
  });

  it('shows the headline alone when no company is recorded', () => {
    // LinkedIn exposes a single headline, not a separate employer, so most
    // transcribed recommendations have no company at all.
    render(<RecommendationCard recommendation={base} />);
    expect(screen.getByText('Product Owner | Business Analyst')).toBeInTheDocument();
  });

  it('joins headline and company when both are present', () => {
    render(<RecommendationCard recommendation={{ ...base, company: 'Proxym Group' }} />);
    expect(
      screen.getByText('Product Owner | Business Analyst · Proxym Group')
    ).toBeInTheDocument();
  });

  it('falls back to initials rather than a broken image when no avatar is set', () => {
    render(<RecommendationCard recommendation={base} />);
    expect(screen.queryByTestId('avatar')).not.toBeInTheDocument();
    expect(screen.getByText('SG')).toBeInTheDocument();
  });

  it('renders the avatar when one is supplied', () => {
    render(
      <RecommendationCard
        recommendation={{ ...base, avatar: { url: 'https://example.com/a.png' } }}
      />
    );
    expect(screen.getByTestId('avatar')).toHaveAttribute('src', 'https://example.com/a.png');
  });

  it('lets the browser resolve quote direction, so verbatim quotes survive an RTL page', () => {
    render(<RecommendationCard recommendation={base} />);
    const quote = screen.getByText(/An opening sentence/);
    expect(quote).toHaveAttribute('dir', 'auto');
    // text-align: right inherits from [dir="rtl"] in globals.css, so logical
    // alignment is what actually keeps the quote on the correct side.
    expect(quote).toHaveClass('text-start');
  });

  describe('linking', () => {
    it('makes the name itself the link, with no separate icon button', () => {
      render(
        <RecommendationCard
          recommendation={{ ...base, linkedinUrl: 'https://www.linkedin.com/in/example/' }}
        />
      );

      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(1);
      expect(links[0]).toHaveAccessibleName('Salah GHARIANI');
      expect(links[0]).toHaveAttribute('href', 'https://www.linkedin.com/in/example/');
      expect(links[0]).toHaveAttribute('rel', expect.stringContaining('noopener'));
    });

    it('renders the name as plain text when no profile URL is recorded', () => {
      render(<RecommendationCard recommendation={base} />);
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
      expect(screen.getByText('Salah GHARIANI')).toBeInTheDocument();
    });
  });

  it('joins relationship and date into a single meta line', () => {
    render(
      <RecommendationCard
        recommendation={{ ...base, relationship: 'Managed Mohamed directly', date: 'May 8, 2026' }}
      />
    );
    expect(screen.getByText('Managed Mohamed directly · May 8, 2026')).toBeInTheDocument();
  });
});
