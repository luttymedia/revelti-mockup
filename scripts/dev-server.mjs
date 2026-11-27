import http from 'node:http';
import fsSync from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PORT = Number(process.env.PORT || 3001);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff'
};

let rebuildTimer = null;
let isBuilding = false;
let pendingBuild = false;

function runBuild(reason) {
  if (isBuilding) {
    pendingBuild = true;
    return;
  }
  isBuilding = true;
  console.log(`[dev-server] Change detected (${reason}) — rebuilding blog...`);
  execFile(process.execPath, [path.join(ROOT_DIR, 'scripts', 'build-blog.mjs')], { cwd: ROOT_DIR }, (err, stdout, stderr) => {
    isBuilding = false;
    if (stdout) process.stdout.write(stdout);
    if (stderr) process.stderr.write(stderr);
    if (err) {
      console.error('[dev-server] Blog rebuild error:', err.message);
    }
    if (pendingBuild) {
      pendingBuild = false;
      runBuild('queued change');
    }
  });
}

function scheduleRebuild(reason) {
  if (rebuildTimer) clearTimeout(rebuildTimer);
  rebuildTimer = setTimeout(() => runBuild(reason), 200);
}

function startWatchers() {
  const watchSpecs = [
    { dir: path.join(ROOT_DIR, 'content', 'blog'), recursive: true },
    { dir: path.join(ROOT_DIR, 'templates'), recursive: true },
    { dir: path.join(ROOT_DIR, 'css'), recursive: false, filter: name => !name || name === 'blog.css' },
    { dir: path.join(ROOT_DIR, 'scripts'), recursive: false, filter: name => !name || name === 'build-blog.mjs' }
  ];

  for (const spec of watchSpecs) {
    try {
      const watcher = fsSync.watch(spec.dir, { recursive: spec.recursive }, (eventType, filename) => {
        if (spec.filter && !spec.filter(filename)) return;
        const label = filename ? `${path.basename(spec.dir)}/${filename}` : path.basename(spec.dir);
        scheduleRebuild(`${eventType}: ${label}`);
      });
      watcher.on('error', err => {
        console.warn(`[dev-server] Watcher warning (${path.basename(spec.dir)}): ${err.message}`);
      });
    } catch (err) {
      console.warn(`[dev-server] Could not watch ${spec.dir}: ${err.message}`);
    }
  }
}

async function resolveFile(urlPathname) {
  const decoded = decodeURIComponent(urlPathname.split('?')[0]);
  const safePath = path.normalize(decoded).replace(/^(\.\.[/\\])+/, '');
  let candidate = path.join(ROOT_DIR, safePath);

  if (!candidate.startsWith(ROOT_DIR)) {
    return null;
  }

  try {
    const stat = await fs.stat(candidate);
    if (stat.isDirectory()) {
      candidate = path.join(candidate, 'index.html');
      await fs.access(candidate);
    }
    return candidate;
  } catch {
    return null;
  }
}

const server = http.createServer(async (req, res) => {
  const filePath = await resolveFile(req.url || '/');
  if (!filePath) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
    return;
  }

  try {
    const ext = path.extname(filePath).toLowerCase();
    const data = await fs.readFile(filePath);
    res.writeHead(200, {
      'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
      'Cache-Control': 'no-cache'
    });
    res.end(data);
  } catch {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('500 Internal Server Error');
  }
});

server.listen(PORT, '127.0.0.1', () => {
  startWatchers();
  console.log(`Revelti local server running at http://localhost:${PORT}`);
  console.log(`  Landing page: http://localhost:${PORT}/`);
  console.log(`  Blog (EN):    http://localhost:${PORT}/blog/`);
  console.log(`  Blog (ES):    http://localhost:${PORT}/es/blog/`);
  console.log('  Watching content/blog/, templates/, css/blog.css, scripts/build-blog.mjs');
});
