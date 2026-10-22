import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function localFileSyncPlugin() {
  const dataDir = path.resolve(__dirname, 'data');
  const storageFile = path.resolve(dataDir, 'tracker_data.json');

  const handleStorageRequest = (req, res) => {
    if (req.method === 'GET') {
      if (fs.existsSync(storageFile)) {
        try {
          const content = fs.readFileSync(storageFile, 'utf-8');
          res.setHeader('Content-Type', 'application/json');
          res.end(content);
          return;
        } catch (err) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'Failed to read data file' }));
          return;
        }
      } else {
        const defaultContent = JSON.stringify({
          applications: [],
          settings: { weeklyGoal: 10, theme: 'dark', viewMode: 'table' },
          dailyTasks: null,
          celebratedMilestones: [],
          lastUpdated: new Date().toISOString()
        }, null, 2);
        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true });
        }
        fs.writeFileSync(storageFile, defaultContent, 'utf-8');
        res.setHeader('Content-Type', 'application/json');
        res.end(defaultContent);
        return;
      }
    } else if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
          }
          // Validate it's valid JSON before writing
          const parsed = JSON.parse(body);
          const prettyJson = JSON.stringify(parsed, null, 2);
          fs.writeFileSync(storageFile, prettyJson, 'utf-8');
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, path: storageFile }));
        } catch (err) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: err.message }));
        }
      });
    } else {
      res.statusCode = 405;
      res.end('Method Not Allowed');
    }
  };

  return {
    name: 'local-file-sync',
    configureServer(server) {
      server.middlewares.use('/api/storage', handleStorageRequest);
      server.middlewares.use('/api/sync', handleStorageRequest);
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    localFileSyncPlugin()
  ],
  server: {
    port: 5173,
    strictPort: true,
    open: false
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts'],
          icons: ['lucide-react']
        }
      }
    }
  }
});
