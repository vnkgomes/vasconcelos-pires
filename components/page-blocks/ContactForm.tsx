'use client';
import { useState, FormEvent } from 'react';
import { DocArrow } from '@/components/primitives/DocArrow';

const NATURES = ['Societário · M&A', 'Contratos Empresariais', 'Tributário', 'Compliance', 'Arbitragem'];

const FIELD_BASE =
  'block w-full bg-transparent border-0 border-b border-ink/30 px-0 py-2 font-sans text-body-m text-ink ' +
  'focus:border-gold focus:outline-none focus:ring-0 transition-colors';

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="border-l-2 border-gold pl-6 py-6">
        <p className="font-display text-display-m text-ink">Recebemos sua solicitação.</p>
        <p className="mt-4 font-sans text-body-l text-stone max-w-editorial">
          Um sócio entrará em contato em até dois dias úteis, no endereço corporativo informado, para confirmar o agendamento.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8">
      {[
        { id: 'name', label: 'Nome', type: 'text', required: true },
        { id: 'company', label: 'Empresa', type: 'text', required: false },
        { id: 'role', label: 'Cargo', type: 'text', required: false },
        { id: 'email', label: 'Email corporativo', type: 'email', required: true },
        { id: 'phone', label: 'Telefone', type: 'tel', required: false },
      ].map((f) => (
        <div key={f.id}>
          <label htmlFor={f.id} className="font-mono text-mono-s uppercase tracking-[0.16em] text-stone">{f.label}</label>
          <input id={f.id} name={f.id} type={f.type} required={f.required} className={FIELD_BASE + ' mt-2'} />
        </div>
      ))}

      <div>
        <label htmlFor="nature" className="font-mono text-mono-s uppercase tracking-[0.16em] text-stone">Natureza da consulta</label>
        <select id="nature" name="nature" className={FIELD_BASE + ' mt-2'}>
          {NATURES.map((n) => <option key={n}>{n}</option>)}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="font-mono text-mono-s uppercase tracking-[0.16em] text-stone">Descreva brevemente</label>
        <textarea id="message" name="message" rows={4} className={FIELD_BASE + ' mt-2 resize-none'} />
      </div>

      <button type="submit" className="inline-flex items-center gap-3 mt-4 font-sans text-body-m text-ink hover:text-bordeaux transition-colors">
        <DocArrow />
        Solicitar agendamento
      </button>
    </form>
  );
}
