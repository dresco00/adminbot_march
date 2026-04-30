import fs from 'fs/promises';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
  },
  plugins: [
    {
      name: 'custom-404-page',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.method !== 'GET') {
            return next();
          }

          const accept = req.headers.accept || '';
          if (!accept.includes('text/html')) {
            return next();
          }

          const requestPath = req.url.split('?')[0];
          if (
            requestPath === '/404.html' ||
            requestPath.startsWith('/@') ||
            requestPath.startsWith('/@vite/') ||
            requestPath.startsWith('/@fs/') ||
            requestPath.startsWith('/vite/') ||
            requestPath.startsWith('/node_modules/') ||
            requestPath.startsWith('/src/')
          ) {
            return next();
          }

          const root = server.config.root;
          const candidatePath = path.join(root, requestPath === '/' ? 'index.html' : requestPath.replace(/^\//, ''));
          let exists = false;

          try {
            await fs.stat(candidatePath);
            exists = true;
          } catch {
            exists = false;
          }

          if (exists) {
            return next();
          }

          try {
            const errorHtml = await fs.readFile(path.join(root, '404.html'), 'utf-8');
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.end(errorHtml);
          } catch (err) {
            next(err);
          }
        });
      },
    },
  ],
});
