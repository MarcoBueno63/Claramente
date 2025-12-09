const path = require('path');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  
  // Excluir diretórios desnecessários do build
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  
  // Ignorar arquivos/pastas durante o build
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // ⚡ OTIMIZAÇÕES CRÍTICAS DE PERFORMANCE
  compress: true,
  poweredByHeader: false,
  
  // 📦 Bundle Optimization - Configuração simplificada e estável
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Ignorar diretórios de backup
    config.module.rules.push({
      test: /\.(ts|tsx|js|jsx)$/,
      exclude: /backups/,
    });
    
    // Ignorar completamente a pasta backups
    config.resolve.alias = {
      ...config.resolve.alias,
      'backups': false,
    };
    //  CHUNK SPLITTING BÁSICO (sem conflitos)
    if (config.optimization.splitChunks) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10,
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: 5,
        },
      };
    }

    // 🔧 ALIASES SIMPLES
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'app'),
      '@components': path.resolve(__dirname, 'components'),
      '@lib': path.resolve(__dirname, 'lib'),
      '@hooks': path.resolve(__dirname, 'hooks'),
    };
    
    return config;
  },
  
  // 🚀 Experimental performance features
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      '@heroicons/react',
      'react',
      'react-dom'
    ],
  },
  
  // 🖼️ Image optimization avançada
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 86400, // 24 horas de cache
    dangerouslyAllowSVG: true,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: [], // Adicionar domínios externos se necessário
    loader: 'default',
    unoptimized: false, // Sempre otimizar imagens
  },
  
  // 🗜️ Compression
  compress: true,
  
  // 📊 Performance monitoring
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  
  // ⚡ Fast Refresh optimization
  reactStrictMode: false, // Temporarily disable for faster dev
};

module.exports = withBundleAnalyzer(nextConfig);
