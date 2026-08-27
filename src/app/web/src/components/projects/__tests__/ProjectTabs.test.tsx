import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@/test-utils';
import { ProjectTabs, type ProjectTab } from '../ProjectTabs';

const mockUseLanguage = jest.fn();

jest.mock('@/contexts/LanguageContext', () => ({
  useLanguage: () => mockUseLanguage(),
}));

const tabs: ProjectTab[] = [
  { id: 'client', label: 'Client Work', count: 5 },
  { id: 'personal', label: 'Personal Projects', count: 1 },
];

function setup(value = 'client', isRTL = false) {
  mockUseLanguage.mockReturnValue({ isRTL });
  const onValueChange = jest.fn();
  const utils = render(
    <ProjectTabs tabs={tabs} value={value} onValueChange={onValueChange} />
  );
  return { onValueChange, ...utils };
}

describe('ProjectTabs', () => {
  beforeEach(() => {
    mockUseLanguage.mockReset();
  });

  it('renders one tab per group with its project count', () => {
    setup();

    const rendered = screen.getAllByRole('tab');
    expect(rendered).toHaveLength(2);
    expect(rendered[0]).toHaveTextContent('Client Work');
    expect(rendered[0]).toHaveTextContent('5');
    expect(rendered[1]).toHaveTextContent('Personal Projects');
    expect(rendered[1]).toHaveTextContent('1');
  });

  it('marks only the active tab as selected and keyboard-reachable', () => {
    setup('personal');

    const [client, personal] = screen.getAllByRole('tab');
    expect(client).toHaveAttribute('aria-selected', 'false');
    expect(client).toHaveAttribute('tabindex', '-1');
    expect(personal).toHaveAttribute('aria-selected', 'true');
    expect(personal).toHaveAttribute('tabindex', '0');
    expect(personal).toHaveAttribute('aria-controls', 'projects-panel-personal');
  });

  it('reports the clicked tab', async () => {
    const user = userEvent.setup();
    const { onValueChange } = setup();

    await user.click(screen.getByRole('tab', { name: /personal projects/i }));

    expect(onValueChange).toHaveBeenCalledWith('personal');
  });

  it('moves forward with ArrowRight in LTR', async () => {
    const user = userEvent.setup();
    const { onValueChange } = setup();

    screen.getByRole('tab', { name: /client work/i }).focus();
    await user.keyboard('{ArrowRight}');

    expect(onValueChange).toHaveBeenCalledWith('personal');
  });

  it('mirrors arrow direction in RTL', async () => {
    const user = userEvent.setup();
    const { onValueChange } = setup('client', true);

    screen.getByRole('tab', { name: /client work/i }).focus();
    await user.keyboard('{ArrowLeft}');

    expect(onValueChange).toHaveBeenCalledWith('personal');
  });
});
