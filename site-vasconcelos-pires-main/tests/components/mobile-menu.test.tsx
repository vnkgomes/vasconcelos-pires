import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { MobileMenu } from '@/components/layout/MobileMenu';

describe('MobileMenu', () => {
  it('does not render menu items when closed', () => {
    render(<MobileMenu open={false} onClose={() => {}} pathname="/" />);
    expect(screen.queryByRole('link', { name: /Pareceres/ })).not.toBeInTheDocument();
  });

  it('renders 5 menu items when open, each preceded by a roman numeral', () => {
    render(<MobileMenu open={true} onClose={() => {}} pathname="/" />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(5);
    expect(items[0]).toHaveTextContent(/i\..*Escritório/);
    expect(items[4]).toHaveTextContent(/v\..*Contato/);
    expect(screen.getByRole('link', { name: 'Escritório' })).toHaveAttribute('href', '/escritorio');
    expect(screen.getByRole('link', { name: 'Contato' })).toHaveAttribute('href', '/contato');
  });

  it('calls onClose when close button clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<MobileMenu open={true} onClose={onClose} pathname="/" />);
    await user.click(screen.getByRole('button', { name: 'Fechar menu' }));
    expect(onClose).toHaveBeenCalled();
  });
});
