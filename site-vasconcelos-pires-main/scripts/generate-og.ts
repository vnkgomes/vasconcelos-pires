import satori from 'satori';
import sharp from 'sharp';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const OUT = 'public/og';

const PAGES = [
  { slug: 'home', number: '00', label: 'Vasconcelos & Pires' },
  { slug: 'escritorio', number: '01', label: 'O Escritório' },
  { slug: 'areas-de-atuacao', number: '02', label: 'Áreas de Atuação' },
  { slug: 'equipe', number: '03', label: 'Equipe' },
  { slug: 'pareceres', number: '04', label: 'Pareceres' },
  { slug: 'contato', number: '05', label: 'Contato' },
];

async function loadFont(url: string): Promise<ArrayBuffer> {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Failed to fetch font: ${url}`);
  return await r.arrayBuffer();
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  const cormorant = await loadFont(
    'https://cdn.jsdelivr.net/fontsource/fonts/cormorant-garamond@latest/latin-500-normal.ttf'
  );
  const mono = await loadFont(
    'https://cdn.jsdelivr.net/fontsource/fonts/jetbrains-mono@latest/latin-400-normal.ttf'
  );

  for (const p of PAGES) {
    const svg = await satori(
      {
        type: 'div',
        props: {
          style: {
            width: '100%',
            height: '100%',
            background: '#0C1220',
            color: '#EDE7DA',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '96px',
            fontFamily: 'Cormorant',
          },
          children: [
            {
              type: 'div',
              props: {
                style: {
                  fontFamily: 'Mono',
                  fontSize: 28,
                  color: '#B89968',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                },
                children: `${p.number} · ${p.label}`,
              },
            },
            {
              type: 'div',
              props: {
                style: { display: 'flex', flexDirection: 'column' },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: {
                        width: '96px',
                        height: '1px',
                        background: '#B89968',
                        marginBottom: '32px',
                      },
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      style: { fontSize: 88, lineHeight: 1.1, letterSpacing: '-0.02em' },
                      children: 'Vasconcelos & Pires',
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      style: {
                        fontFamily: 'Mono',
                        fontSize: 24,
                        color: 'rgba(237,231,218,0.6)',
                        marginTop: '24px',
                      },
                      children: 'Advogados Associados · São Paulo',
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      {
        width: 1200,
        height: 630,
        fonts: [
          { name: 'Cormorant', data: cormorant, weight: 500, style: 'normal' },
          { name: 'Mono', data: mono, weight: 400, style: 'normal' },
        ],
      }
    );
    await sharp(Buffer.from(svg)).png().toFile(path.join(OUT, `${p.slug}.png`));
    console.log('[generate-og] ✓', p.slug);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
