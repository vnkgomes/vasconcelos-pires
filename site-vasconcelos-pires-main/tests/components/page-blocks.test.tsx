import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { StatsRow } from '@/components/page-blocks/StatsRow';
import { PracticeAreaRow } from '@/components/page-blocks/PracticeAreaRow';
import { PartnerCard } from '@/components/page-blocks/PartnerCard';
import { OperationsBlock } from '@/components/page-blocks/OperationsBlock';
import { TypographicTile } from '@/components/page-blocks/TypographicTile';
import { ContactForm } from '@/components/page-blocks/ContactForm';
import { partners } from '@/content/partners';
import { operations } from '@/content/operations';

vi.mock('next/image', () => ({
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    const { fill, sizes, priority, ...rest } = props;
    return <img {...rest} />;
  },
}));

describe('StatsRow', () => {
  const items = [
    { value: '27', label: 'anos de atuação' },
    { value: '24', label: 'advogados em quadro fixo' },
  ];
  it('renders each stat with display value and mono label', () => {
    render(<StatsRow items={items} />);
    expect(screen.getByText('27').className).toMatch(/font-display/);
    expect(screen.getByText('anos de atuação').className).toMatch(/font-mono/);
  });
});

describe('PracticeAreaRow', () => {
  const area = {
    id: 'societario-ma',
    slug: 'societario-ma',
    number: '1.1',
    title: 'Direito Societário e M&A',
    summary: 'Estruturação de operações.',
    description: '',
    services: [],
    partnerSlugs: [],
  } as any;

  it('renders number, title, summary, and link to area', () => {
    render(<PracticeAreaRow area={area} />);
    expect(screen.getByText('1.1')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Direito Societário e M&A/ })).toHaveAttribute('href', '/areas-de-atuacao/societario-ma');
    expect(screen.getByText(/Estruturação de operações/)).toBeInTheDocument();
  });
});

describe('PartnerCard', () => {
  it('renders partner name, practice, and link to detail page', () => {
    render(<PartnerCard partner={partners[0]} />);
    expect(screen.getByText('Eduardo Vasconcelos')).toBeInTheDocument();
    expect(screen.getByText(/M&A · Direito Societário/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Página completa/ })).toHaveAttribute('href', '/equipe/eduardo-vasconcelos');
  });

  it('reverses layout when reverse prop is true', () => {
    const { container } = render(<PartnerCard partner={partners[0]} reverse />);
    expect(container.firstChild).toHaveClass('md:flex-row-reverse');
  });
});

describe('OperationsBlock', () => {
  it('renders heading and one entry per operation', () => {
    render(<OperationsBlock operations={[operations[0]]} />);
    expect(screen.getByText(/OPERAÇÕES REPRESENTATIVAS/i)).toBeInTheDocument();
    expect(screen.getByText(/Reorganização societária multinacional/)).toBeInTheDocument();
  });

  it('falls back to representativePractice copy when no operations', () => {
    render(<OperationsBlock operations={[]} representativePractice="Texto descritivo." />);
    expect(screen.getByText(/Texto descritivo/)).toBeInTheDocument();
  });
});

describe('TypographicTile', () => {
  it('renders eyebrow, body, meta', () => {
    render(<TypographicTile eyebrow="Itaim Bibi" body="Avenida Faria Lima, 4221" meta="19º andar" />);
    expect(screen.getByText('Itaim Bibi')).toBeInTheDocument();
    expect(screen.getByText('Avenida Faria Lima, 4221')).toBeInTheDocument();
    expect(screen.getByText('19º andar')).toBeInTheDocument();
  });
});

describe('ContactForm', () => {
  it('renders all required fields', () => {
    render(<ContactForm />);
    expect(screen.getByLabelText(/Nome/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Empresa/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Cargo/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email corporativo/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Telefone/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Natureza da consulta/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Descreva brevemente/)).toBeInTheDocument();
  });

  it('shows confirmation message after submit, without making any network call', async () => {
    const user = userEvent.setup();
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    render(<ContactForm />);
    await user.type(screen.getByLabelText(/Nome/), 'Maria Silva');
    await user.type(screen.getByLabelText(/Email corporativo/), 'maria@empresa.com');
    await user.click(screen.getByRole('button', { name: /Solicitar agendamento/ }));
    expect(await screen.findByText(/Recebemos sua solicitação/)).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
