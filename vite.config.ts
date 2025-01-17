import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteFaviconsPlugin } from 'vite-plugin-favicon'

export default defineConfig({
    plugins: [
        react(),
        ViteFaviconsPlugin({
            logo: 'public/logo.png',
            favicons: {
                appName: 'Proyecto para INACONS',
                appShortName: 'App NUFAGO',
                appDescription: 'App NUFAGO - INACONS',
                icons: {
                    favicons: true,
                    appleIcon: true,
                    appleStartup: true,
                    windows: true,
                    android: true,
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