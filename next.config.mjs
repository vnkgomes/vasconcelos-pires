import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  pageExtensions: ['ts', 'tsx', 'mdx'],
  experimental: { mdxRs: false }
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

export default withMDX(nextConfig);
