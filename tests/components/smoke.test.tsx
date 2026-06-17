import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('test infrastructure', () => {
  it('renders a basic element and matches assertions', () => {
    render(<p data-testid="x">hello</p>);
    expect(screen.getByTestId('x')).toHaveTextContent('hello');
  });
});
