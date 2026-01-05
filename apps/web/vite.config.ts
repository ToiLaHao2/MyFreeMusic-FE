import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'shell',
      // Remote apps will be added here as the project grows
      // Example:
      // remotes: {
      //   mfePlayer: 'http://localhost:5001/assets/remoteEntry.js',
      //   mfePlaylist: 'http://localhost:5002/assets/remoteEntry.js',
      // },
      shared: ['react', 'react-dom']
    })
  ],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  }
})
