/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // TODO: Replace with exact Wix image domains once known
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      // Keep wildcard for development as mock fallback until exact hosts are known, but document this needs fixing for strict production
      // {
      //   protocol: 'https',
      //   hostname: '**',
      // },
    ],
  },
}

module.exports = nextConfig
