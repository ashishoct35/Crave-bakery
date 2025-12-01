import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                menu: resolve(__dirname, 'menu.html'),
                locations: resolve(__dirname, 'locations.html'),
                gallery: resolve(__dirname, 'gallery.html'),
                about: resolve(__dirname, 'about.html'),
                contact: resolve(__dirname, 'contact.html'),
            },
        },
    },
});
