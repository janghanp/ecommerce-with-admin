/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
        domains: ["res.cloudinary.com"],
    },
    experimental: {
        optimizeCss: true,
    },
};

module.exports = nextConfig;
