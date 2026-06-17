import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SectionNumber } from '@/components/primitives/SectionNumber';
import { GoldRule } from '@/components/primitives/GoldRule';
import { InlineRoman } from '@/components/primitives/InlineRoman';
import { DocArrow } from '@/components/primitives/DocArrow';
import { Hairline } from '@/components/layout/Hairline';

describe('primitives', () => {
  it('SectionNumber renders mono gold number', () => {
    render(<SectionNumber>1.1</SectionNumber>);
    const el = screen.getByText('1.1');
    expect(el.className).toMatch(/font-mono/);
    expect(el.className).toMatch(/text-gold/);
  });

  it('GoldRule renders a gold hairline', () => {
    const { container } = render(<GoldRule />);
    const hr = container.querySelector('hr');
    expect(hr).not.toBeNull();
    expect(hr!.className).toMatch(/border-gold/);
  });

  it('InlineRoman converts numbers to lowercase roman', () => {
    render(<InlineRoman n={4} />);
    expect(screen.getByText('iv.')).toBeInTheDocument();
  });

  it('DocArrow renders the arrow character with mono gold', () => {
    render(<DocArrow />);
    expect(screen.getByText('→')).toHaveClass('font-mono');
    expect(screen.getByText('→').className).toMatch(/text-gold/);
  });

  it('Hairline accepts variant gold and renders gold border', () => {
    const { container } = render(<Hairline variant="gold" />);
    expect(container.querySelector('hr')!.className).toMatch(/border-gold/);
  });

  it('Hairline default variant uses ivory/30 sobre ink', () => {
    const { container } = render(<Hairline />);
    expect(container.querySelector('hr')!.className).toMatch(/border-ivory/);
  });
});
