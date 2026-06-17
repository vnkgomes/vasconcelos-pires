import type { MDXComponents } from 'mdx/types';
import { ParecerQuote } from '@/components/page-blocks/ParecerQuote';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Quote: ParecerQuote,
    ...components,
  };
}
