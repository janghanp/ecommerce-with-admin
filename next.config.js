/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["res.cloudinary.com"],
    },
    experimental: {
        optimizeCss: true,
    },
};

module.exports = nextConfig;
