import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@/test-utils';
import { Work } from '../Work';
import type { Project, WorkData } from '@/types';

const mockUseProjects = jest.fn();
const mockUseSideProjects = jest.fn();
const mockUseWork = jest.fn();

jest.mock('@/contexts/PortfolioDataContext', () => ({
  useProjects: () => mockUseProjects(),
  useSideProjects: () => mockUseSideProjects(),
  useWork: () => mockUseWork(),
}));

jest.mock('@/contexts/LanguageContext', () => ({
  useLanguage: () => ({ isRTL: false }),
}));

// The card renders next/image, markdown, and a Radix dialog - none of which this
// suite is exercising. Stub it so the test isolates the tab/panel wiring.
jest.mock('../projects/ProjectCard', () => ({
  ProjectCard: ({ project }: { project: Project }) => <div>{project.title}</div>,
}));

const makeProject = (id: number, title: string): Project => ({
  id,
  title,
  company: 'Acme',
  role: 'Engineer',
  description: 'Description',
  image: { url: 'https://example.com/image.png' },
  technologies: ['TypeScript'],
});

const work: WorkData = {
  title: 'Projects',
  description: 'Fallback description',
  tabs: {
    client: { label: 'Client Work', description: 'Enterprise-scale delivery.' },
    personal: { label: 'Personal Projects', description: 'Open-source side builds.' },
  },
};

const clientProjects = [makeProject(1, 'Bankerise'), makeProject(2, 'BNA Retail')];
const personalProjects = [makeProject(101, 'Automedon')];

function setup({
  projects = clientProjects,
  sideProjects = personalProjects,
  workData = work as WorkData | null,
  loading = false,
  error = null as string | null,
} = {}) {
  mockUseProjects.mockReturnValue({ projects, loading, error });
  mockUseSideProjects.mockReturnValue({ sideProjects, loading, error });
  mockUseWork.mockReturnValue({ work: workData, loading, error });
  return render(<Work />);
}

describe('Work', () => {
  beforeEach(() => {
    mockUseProjects.mockReset();
    mockUseSideProjects.mockReset();
    mockUseWork.mockReset();
  });

  it('opens on client work with its projects and description', () => {
    setup();

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Projects');
    expect(screen.getByText('Enterprise-scale delivery.')).toBeInTheDocument();
    expect(screen.getByText('Bankerise')).toBeInTheDocument();
    expect(screen.getByText('BNA Retail')).toBeInTheDocument();
    expect(screen.queryByText('Automedon')).not.toBeInTheDocument();
  });

  it('swaps grid and description when the personal tab is selected', async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByRole('tab', { name: /personal projects/i }));

    expect(screen.getByText('Automedon')).toBeInTheDocument();
    expect(screen.queryByText('Bankerise')).not.toBeInTheDocument();
    // AnimatePresence uses mode="wait", so the outgoing paragraph unmounts first.
    expect(await screen.findByText('Open-source side builds.')).toBeInTheDocument();
  });

  it('links the visible grid to its tab for assistive tech', async () => {
    const user = userEvent.setup();
    setup();

    expect(screen.getByRole('tabpanel')).toHaveAttribute(
      'aria-labelledby',
      'projects-tab-client'
    );

    await user.click(screen.getByRole('tab', { name: /personal projects/i }));

    expect(screen.getByRole('tabpanel')).toHaveAttribute(
      'aria-labelledby',
      'projects-tab-personal'
    );
  });

  it('hides the tabs when a locale has no side projects', () => {
    setup({ sideProjects: [] });

    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    expect(screen.getByText('Bankerise')).toBeInTheDocument();
    expect(screen.getByText('Enterprise-scale delivery.')).toBeInTheDocument();
  });

  it('hides the tabs and shows the personal group when there are no client projects', () => {
    setup({ projects: [] });

    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    expect(screen.getByText('Automedon')).toBeInTheDocument();
    expect(screen.getByText('Open-source side builds.')).toBeInTheDocument();
    expect(screen.queryByText(/No personal projects yet/)).not.toBeInTheDocument();
  });

  it('drops tabpanel semantics when no tablist is rendered to label it', () => {
    const { unmount } = setup({ sideProjects: [] });
    expect(screen.queryByRole('tabpanel')).not.toBeInTheDocument();
    unmount();

    setup();
    expect(screen.getByRole('tabpanel')).toBeInTheDocument();
  });

  it('renders an empty state without tabs when both groups are empty', () => {
    setup({ projects: [], sideProjects: [] });

    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    expect(screen.getByText('No projects available')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Projects');
  });

  it('still renders when a locale omits sideProjects entirely', () => {
    // useSideProjects() falls back to [] when the key is absent from the JSON
    setup({ sideProjects: [], workData: { title: 'Projects', description: 'Fallback description' } });

    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    expect(screen.getByText('Bankerise')).toBeInTheDocument();
    expect(screen.getByText('Fallback description')).toBeInTheDocument();
  });

  it('falls back to work.description when a locale has no tab metadata', () => {
    setup({ workData: { title: 'Projects', description: 'Fallback description' } });

    expect(screen.getByText('Fallback description')).toBeInTheDocument();
  });

  it('shows the error message instead of the tabs when loading fails', () => {
    setup({ error: 'boom' });

    expect(screen.getByText(/Error loading projects: boom/)).toBeInTheDocument();
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
  });
});
