import Link from 'next/link';
import { DocArrow } from '@/components/primitives/DocArrow';
import { FadeRise } from '@/components/motion/FadeRise';
import { StaggerLines } from '@/components/motion/StaggerLines';

export function Hero() {
  return (
    <section className="bg-ink text-ivory">
      <div className="container py-section">
        <FadeRise mode="mount">
          <p className="font-mono text-mono-s uppercase tracking-[0.16em] text-gold">Estab. 1998 · São Paulo</p>
        </FadeRise>
        <StaggerLines mode="mount" className="mt-12 font-display text-display-xl text-balance">
          <span className="block">Direito empresarial,</span>
          <span className="block">conduzido com rigor</span>
          <span className="block">e discrição.</span>
        </StaggerLines>
        <FadeRise mode="mount" delay={0.3}>
          <p className="mt-12 max-w-editorial font-sans text-body-l text-ivory/80">
            Escritório boutique de São Paulo dedicado a companhias brasileiras e estrangeiras de médio e grande porte. Atuação consultiva e contenciosa nas áreas societária, tributária, compliance e arbitragem.
          </p>
        </FadeRise>
        <FadeRise mode="mount" delay={0.4}>
          <div className="mt-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6 font-mono text-mono">
            <Link href="/contato" className="inline-flex items-center gap-3 text-ivory hover:text-gold">
              <DocArrow /> Solicitar agendamento
            </Link>
            <span className="text-ivory/60">Av. Brigadeiro Faria Lima, 4221 · Itaim Bibi</span>
          </div>
        </FadeRise>
      </div>

      <div className="border-t border-ivory/15">
        <div className="container py-12">
          <FadeRise mode="mount" delay={0.5}>
            <p className="font-display italic text-body-l text-ivory/70 max-w-editorial">
              &quot;A natureza do bem digital, quando licenciado sem transferência de propriedade, afasta a incidência do ICMS, mantendo-se o ISS como tributo aplicável.&quot;
              <span className="block mt-3 font-mono not-italic text-mono text-gold">— RE 688.223 · Parecer Nº 047/2025</span>
            </p>
          </FadeRise>
        </div>
      </div>
    </section>
  );
}
