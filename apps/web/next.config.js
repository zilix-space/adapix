const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // compiler: {
  //   removeConsole: {
  //     exclude: ['info'],
  //   },
  // },

  webpack: function(config, { isServer }) {
    // @dqbd/tiktoken: enable asynchronous WebAssembly
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };

    // fix warnings for async functions in the browser (https://github.com/vercel/next.js/issues/64792)
    if (!isServer) {
      config.output.environment = { ...config.output.environment, asyncFunction: true };
    }
    
    // Adicionando alias para resolver o caminho correto
    config.resolve.alias = {
      ...config.resolve.alias,
      'scheduler': path.resolve(__dirname, '../../node_modules/scheduler'),
    };

    return config;
  },  
  transpilePackages: ['design-system/react', '@meshsdk/react'],
  logging: {
		fetches: {
			fullUrl: true,
		},
	},
  experimental: {
    esmExternals: true,
    serverComponentsExternalPackages: ['@meshsdk/core'],
    staleTimes: {
			dynamic: 0,
		},

  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig
