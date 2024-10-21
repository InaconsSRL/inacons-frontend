import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteFaviconsPlugin } from 'vite-plugin-favicon'

export default defineConfig({
    plugins: [
        react(),
        ViteFaviconsPlugin({
            logo: 'public/logo.png',
            favicons: {
              appName: 'INACONS',
              appDescription: 'INACONS application',
              icons: {
                favicons: true,
                appleIcon: true,
                appleStartup: false,
                android: true,
                windows: false
              }
            }
        })
    ],
    envPrefix: 'VITE_', 
    server: {
        hmr: true, 
    },
    build: {
        sourcemap: true, 
    },
});