// Tiny static server on an OS-picked port, so tests and screenshots never fight over ports
// and never see dev-tool overlays a local proxy might inject.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.mp4': 'video/mp4' };

export function serve(root, host = '127.0.0.1', extra = {}) {
  const server = createServer(async (req, res) => {
    const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (extra[path]) {
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
      return res.end(extra[path]());
    }
    const file = normalize(join(root, path));
    if (!file.startsWith(normalize(root))) return res.writeHead(403).end();
    try {
      const body = await readFile(file);
      res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404).end('not found');
    }
  });
  return new Promise((resolve) =>
    server.listen(0, host, () => resolve({ url: `http://${host}:${server.address().port}`, close: () => server.close() })),
  );
}
