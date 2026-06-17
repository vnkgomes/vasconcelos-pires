import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SectionLabel } from '@/components/layout/SectionLabel';

describe('SectionLabel', () => {
  it('renders uppercase mono-s with leading dash', () => {
    const { container } = render(<SectionLabel>Em números</SectionLabel>);
    expect(screen.getByText(/EM NÚMEROS/)).toBeInTheDocument();
    const p = container.querySelector('p');
    expect(p?.className).toMatch(/font-mono/);
    expect(p?.className).toMatch(/uppercase/);
  });

  it('renders leading bullet characters', () => {
    render(<SectionLabel>Pareceres</SectionLabel>);
    expect(screen.getByText(/──/)).toBeInTheDocument();
  });
});
