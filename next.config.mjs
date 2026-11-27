/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.VERCEL ? undefined : 'standalone',
  reactStrictMode: true,
  // Microphone is only needed on our own origin.
  async headers() {
    return [{ source: '/(.*)', headers: [{ key: 'Permissions-Policy', value: 'microphone=(self)' }] }];
  },
};
export default nextConfig;

