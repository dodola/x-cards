// const isProd = process.env.NODE_ENV === 'production'
const isProd = false;
const bundleAnalyzer = require('@next/bundle-analyzer')
const withBundleAnalyzer = bundleAnalyzer({
    enabled: false,
    openAnalyzer: true,
})


module.exports = withBundleAnalyzer({
    swcMinify: true,
    crossOrigin: 'anonymous',
    reactStrictMode: true,
    
    env: {
        STATIC_URL: isProd ? STATIC_URL : "http://localhost:3000",
    },
    // typescript: {
    //     ignoreBuildErrors: true,
    // },
    // webpack: (config) => {
    //     config.externals = [...config.externals, { canvas: 'canvas' }];
    //     return config;
    // },
    // experimental: {
    //     serverActions: {
    //         allowedOrigins: []
    //     },
    // },

    // async redirects() {
    //     return [
    //         {
    //             source: "/home",
    //             destination: "/",
    //             permanent: false,
    //         }]
    // }


    typescript: {
        ignoreBuildErrors: true,
    },
    output: 'export',
    // 禁用图像优化，因为它需要 Next.js 服务器
    images: {
        unoptimized: true,
    },
    webpack: (config, { isServer }) => {
        if (isServer) {
            // 在服务器端构建时忽略 API 路由
            config.externals = config.externals || [];
            config.externals.push((context, request, callback) => {
                if (request.startsWith('pages/api/') || request.startsWith('app/api/')) {
                    return callback(null, `commonjs ${request}`);
                }
                callback();
            });
        }
        return config;
    },

})

