import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(({ command, mode }) => {
  // Determine correct base path for GitHub Pages vs Local/AI Studio dev server
  const repoName = 'junidemaktabah';
  const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';
  const isGhDeploy = process.env.BUILD_FOR_GH === 'true';
  const isBuild = command === 'build' || mode === 'production';

  let base = './';
  if (process.env.BASE_PATH) {
    base = process.env.BASE_PATH;
  } else if (isGitHubActions && process.env.GITHUB_REPOSITORY) {
    base = `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/`;
  } else if (isGitHubActions || isGhDeploy || isBuild) {
    base = `/${repoName}/`;
  }

  return {
    base,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve('.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
