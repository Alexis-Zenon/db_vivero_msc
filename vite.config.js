import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    VitePWA({
registerType: 'autoUpdate',
manifest: {
name: 'MSC',
short_name: 'MiPWA',
description: 'Aplicación Web Progresiva con React y Vite',
theme_color: '#ffffff',
background_color: '#ffffff',
display: 'standalone',
start_url: '/',
icons: [
{
src: 'logotipo.png',
sizes: '192x192',
type: 'image/png'
},
{
src: 'icon-512.png',
sizes: '512x512',
type: 'image/png'
}
]
}
})
  ],
})
