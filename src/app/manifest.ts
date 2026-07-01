import type { MetadataRoute } from 'next';
import { AppConfig } from '@/utils/AppConfig';

// Web App Manifest (/manifest.webmanifest) — иконки для «добавить на главный экран»
// и базовые сведения о приложении.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${AppConfig.name} — бактерицидные УФ-лампы`,
    short_name: AppConfig.name,
    description: 'Бактерицидные УФ-лампы BAIMED: обеззараживание воздуха и поверхностей.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0284c7',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  };
}
