/** @type {import('next').NextConfig} */
const nextConfig = {
  // Это помогает Cloudflare понять, что мы деплоим статику + функции
  output: 'export', 
  distDir: '.vercel/output', // Принудительно направляем Next сюда
  images: { unoptimized: true }
};

export default nextConfig;
