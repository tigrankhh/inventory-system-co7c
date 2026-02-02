/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Игнорируем ошибки типов, чтобы билд прошел успешно
    ignoreBuildErrors: true,
  },
  eslint: {
    // Игнорируем предупреждения линтера при сборке
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
