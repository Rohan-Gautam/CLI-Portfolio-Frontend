import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import Sitemap from 'vite-plugin-sitemap'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        Sitemap({
            // This tells the plugin the base URL of your live production site
            hostname: 'https://cli-portfolio.rohangautam.app',

            // Because your CLI portfolio operates entirely on a single screen,
            // the root URL ('/') is generated automatically by default.
            // If you ever add a router (like React Router) with new pages
            // in the future, you would list them here (e.g., ['/projects', '/about']).
            dynamicRoutes: []
        })
    ],
})