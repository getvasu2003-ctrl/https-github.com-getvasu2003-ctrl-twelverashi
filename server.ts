import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { handleApiRoute } from './src/server/apiRouter.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createServer() {
  const app = express();
  const PORT = 3000; // Nginx reverse proxy listens on 8080 and proxies to port 3000
  const isProduction = process.env.NODE_ENV === 'production' || fs.existsSync(path.join(__dirname, 'dist', 'index.html'));

  // Health check endpoint for Cloud Run and container probes
  app.get('/healthz', (_req, res) => {
    res.status(200).json({ status: 'ok', service: '12rashi-applet', timestamp: Date.now() });
  });

  // Mount server-side API Router for all /api endpoints, DLT, Cashfree, and webhooks
  app.use((req, res, next) => {
    if (req.url && (req.url.startsWith('/api') || req.url.startsWith('/webhook') || req.url.startsWith('/health'))) {
      handleApiRoute(req, res, next);
      return;
    }
    next();
  });

  if (!isProduction) {
    // In development mode, mount Vite middleware
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
      console.log('Mounted Vite development middleware.');
    } catch (e) {
      console.warn('Vite middleware fallback to static:', e);
      serveStatic(app);
    }
  } else {
    serveStatic(app);
  }

  function serveStatic(expressApp: express.Express) {
    const distPath = path.join(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      expressApp.use(express.static(distPath, {
        maxAge: '1h',
        etag: true,
      }));
      expressApp.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    } else {
      expressApp.get('*', (_req, res) => {
        res.status(200).send('<h1>12Rashi</h1><p>Building client assets... Please refresh shortly.</p>');
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`12Rashi Server running on http://0.0.0.0:${PORT} [${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}]`);
  });
}

createServer().catch((err) => {
  console.error('Fatal 12Rashi server startup error:', err);
  process.exit(1);
});
