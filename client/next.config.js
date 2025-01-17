/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.experiments = {
            ...config.experiments,
            asyncWebAssembly: true,
            topLevelAwait: true,
            layers: true,
        };
        return config;
    },
    pageExtensions: ["js", "jsx", "ts", "tsx"],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'ipfs.io',
                port: '',
                pathname: '/ipfs/**',
            },
        ],
    },
};

module.exports = nextConfig;
