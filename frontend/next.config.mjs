/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    domains: [
      "raw.githubusercontent.com",
      "assets.coingecko.com",
      "tokens.1inch.io",
      "cdn.prod.website-files.com",
    ],
  },

  webpack: (config, { isServer }) => {
    // ── Server-side externals ────────────────────────────────────────────────
    config.externals.push("pino-pretty", "lokijs", "encoding")

    // ── Stub all optional/browser-only Privy v3 peer deps ───────────────────
    // Privy v3 bundles optional peer deps for Farcaster, Solana, Stripe fiat
    // on-ramp etc. These are client-only ESM modules — stub them everywhere
    // so Next.js doesn't error during SSR compilation.
    const privyStubs = {
      '@stripe/crypto':            false,
      '@farcaster/mini-app-solana': false,
      '@farcaster/frame-sdk':       false,
      '@solana/web3.js':            false,
      '@solana/wallet-adapter-base': false,
    }

    config.resolve.alias = {
      ...config.resolve.alias,
      '@react-native-async-storage/async-storage': false,
      ...privyStubs,
    }

    return config
  },
}

export default nextConfig
