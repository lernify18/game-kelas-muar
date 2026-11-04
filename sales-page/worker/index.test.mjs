// node --test worker/  — the Worker in front of the static assets, driven with a fake ASSETS binding that, like
// Cloudflare Static Assets, ignores Range and always answers 200 with the whole file.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker from './index.js';

const VIDEO = Uint8Array.from({ length: 1000 }, (_, i) => i % 251);
const env = {
  ASSETS: {
    async fetch(req) {
      const path = new URL(req.url).pathname;
      if (path === '/assets/img/kelas.mp4') return new Response(VIDEO, { headers: { 'content-type': 'video/mp4', 'content-length': String(VIDEO.length), etag: '"v1"' } });
      if (path === '/') return new Response('<!doctype html>', { headers: { 'content-type': 'text/html' } });
      return new Response('not found', { status: 404 });
    },
  },
};
const get = (path, headers = {}, method = 'GET') => worker.fetch(new Request('https://x.test' + path, { method, headers }), env);
const bytes = async (res) => new Uint8Array(await res.arrayBuffer());

test('no Range: 200, whole file, advertises byte ranges', async () => {
  const res = await get('/assets/img/kelas.mp4');
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('accept-ranges'), 'bytes');
  assert.deepEqual(await bytes(res), VIDEO);
});

test('bytes=0-99: 206 with the first 100 bytes', async () => {
  const res = await get('/assets/img/kelas.mp4', { range: 'bytes=0-99' });
  assert.equal(res.status, 206);
  assert.equal(res.headers.get('content-range'), 'bytes 0-99/1000');
  assert.equal(res.headers.get('content-length'), '100');
  assert.equal(res.headers.get('content-type'), 'video/mp4');
  assert.deepEqual(await bytes(res), VIDEO.subarray(0, 100));
});

test('Safari probe bytes=0-1 and an open range bytes=990-', async () => {
  const probe = await get('/assets/img/kelas.mp4', { range: 'bytes=0-1' });
  assert.equal(probe.status, 206);
  assert.deepEqual(await bytes(probe), VIDEO.subarray(0, 2));
  const open = await get('/assets/img/kelas.mp4', { range: 'bytes=990-' });
  assert.equal(open.headers.get('content-range'), 'bytes 990-999/1000');
  assert.deepEqual(await bytes(open), VIDEO.subarray(990));
});

test('suffix range bytes=-10 and an end past the file are clamped', async () => {
  const suf = await get('/assets/img/kelas.mp4', { range: 'bytes=-10' });
  assert.equal(suf.headers.get('content-range'), 'bytes 990-999/1000');
  assert.deepEqual(await bytes(suf), VIDEO.subarray(990));
  const big = await get('/assets/img/kelas.mp4', { range: 'bytes=500-5000' });
  assert.equal(big.headers.get('content-range'), 'bytes 500-999/1000');
  assert.equal((await bytes(big)).length, 500);
});

test('a range past the end is 416 with the real size', async () => {
  const res = await get('/assets/img/kelas.mp4', { range: 'bytes=1000-' });
  assert.equal(res.status, 416);
  assert.equal(res.headers.get('content-range'), 'bytes */1000');
});

test('a malformed or multi-part Range falls back to the whole file', async () => {
  for (const range of ['bytes=abc', 'items=0-5', 'bytes=0-1,5-9', 'bytes=-']) {
    const res = await get('/assets/img/kelas.mp4', { range });
    assert.equal(res.status, 200, range);
    assert.equal((await bytes(res)).length, 1000, range);
  }
});

test('HEAD with Range: 206 headers, no body', async () => {
  const res = await get('/assets/img/kelas.mp4', { range: 'bytes=0-99' }, 'HEAD');
  assert.equal(res.status, 206);
  assert.equal(res.headers.get('content-length'), '100');
  assert.equal(res.body, null);
});

test('pages and missing files pass through untouched', async () => {
  const page = await get('/', { range: 'bytes=0-3' });
  assert.equal(page.status, 200);
  assert.equal(page.headers.get('accept-ranges'), null);
  assert.equal(await page.text(), '<!doctype html>');
  assert.equal((await get('/assets/img/tiada.mp4', { range: 'bytes=0-3' })).status, 404);
});
