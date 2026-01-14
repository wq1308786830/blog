var path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'], // Ensure no unnecessary patterns
  images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'api.dujin.org',
                port: '',
                pathname: '/**',
            },
        ],
    },
    typescript: {
        ignoreBuildErrors: true,
    },
}

module.exports = nextConfig
