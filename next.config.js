/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  exportPathMap: async function () {
    return {
      "/": { page: "/" },
    };
  },
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
