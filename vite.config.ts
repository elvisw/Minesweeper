import { defineConfig } from 'vite'
import { execSync } from 'node:child_process'
import pkg from './package.json'
import { cloudflare } from '@cloudflare/vite-plugin'

const gitHash = execSync('git rev-parse --short HEAD').toString().trim()

export default defineConfig({
  plugins: [cloudflare()],
  define: {
    __VERSION__: JSON.stringify(pkg.version),
    __GIT_HASH__: JSON.stringify(gitHash),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
})
