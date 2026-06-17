import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Header } from '@/components/layout/Header';

describe('Header', () => {
  it('renders all 5 nav items as links', () => {
    render(<Header pathname="/" />);
    expect(screen.getByRole('link', { name: 'Escritório' })).toHaveAttribute('href', '/escritorio');
    expect(screen.getByRole('link', { name: 'Áreas' })).toHaveAttribute('href', '/areas-de-atuacao');
    expect(screen.getByRole('link', { name: 'Equipe' })).toHaveAttribute('href', '/equipe');
    expect(screen.getByRole('link', { name: 'Pareceres' })).toHaveAttribute('href', '/pareceres');
    expect(screen.getByRole('link', { name: 'Contato' })).toHaveAttribute('href', '/contato');
  });

  it('renders wordmark in two-line treatment', () => {
    render(<Header pathname="/" />);
    expect(screen.getByText('VASCONCELOS & PIRES')).toBeInTheDocument();
    expect(screen.getByText('Advogados Associados')).toBeInTheDocument();
  });

  it('marks active link with aria-current', () => {
    render(<Header pathname="/pareceres" />);
    expect(screen.getByRole('link', { name: 'Pareceres' })).toHaveAttribute('aria-current', 'page');
  });

  it('opens mobile menu when toggle clicked', async () => {
    const user = userEvent.setup();
    render(<Header pathname="/" />);
    await user.click(screen.getByLabelText('Menu'));
    expect(screen.getByRole('dialog', { name: 'Menu de navegação' })).toBeInTheDocument();
  });
});
