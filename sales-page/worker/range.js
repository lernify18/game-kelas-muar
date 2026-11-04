// HTTP Range for media served from the ASSETS binding. Ported from Sellhiz server/lib/rangeResponse.ts (PR #463).
// Workers Static Assets answer a Range request with the whole file and a 200. Chrome copes, but Safari — and so every
// iPhone browser — will not play a video whose server does not return 206 Partial Content.

/** Parse a single `bytes=` range against a file of `size` bytes: {start,end}, 'unsatisfiable', or null (serve all). */
export function parseRange(header, size) {
  if (!header) return null;
  // Multi-range requests are legal but no media player sends them; the whole file is a valid answer to one.
  const m = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (!m || (m[1] === '' && m[2] === '')) return null;
  let start, end;
  if (m[1] === '') {
    const suffix = Number(m[2]);
    if (suffix === 0) return 'unsatisfiable';
    start = Math.max(0, size - suffix);
    end = size - 1;
  } else {
    start = Number(m[1]);
    end = m[2] === '' ? size - 1 : Math.min(Number(m[2]), size - 1);
  }
  if (start >= size || start > end) return 'unsatisfiable';
  return { start, end };
}

function slice(body, from, to) {
  const reader = body.getReader();
  let pos = 0;
  return new ReadableStream({
    async pull(controller) {
      for (;;) {
        if (pos >= to) {
          await reader.cancel();
          controller.close();
          return;
        }
        const { done, value } = await reader.read();
        if (done) {
          controller.close();
          return;
        }
        const chunkStart = pos;
        pos += value.byteLength;
        if (pos <= from) continue;
        controller.enqueue(value.subarray(Math.max(0, from - chunkStart), Math.min(value.byteLength, to - chunkStart)));
        return;
      }
    },
    cancel(reason) {
      return reader.cancel(reason);
    },
  });
}

// Without a FixedLengthStream the runtime sends a streamed body chunked, and players that size their buffer from
// Content-Length on a 206 stall. Node (unit tests) has no FixedLengthStream, so the plain stream is used there.
function fixedLength(body, length) {
  if (typeof FixedLengthStream === 'undefined') return body;
  const { readable, writable } = new FixedLengthStream(length);
  body.pipeTo(writable).catch(() => {});
  return readable;
}

export async function withRangeSupport(request, res) {
  const type = res.headers.get('content-type') ?? '';
  if (res.status !== 200 || !/^(video|audio)\//.test(type)) return res;

  const headers = new Headers(res.headers);
  headers.set('accept-ranges', 'bytes');
  const rangeHeader = request.headers.get('range');
  if (!rangeHeader) return new Response(res.body, { status: 200, headers });

  let body = res.body;
  let size = Number(res.headers.get('content-length'));
  if (!Number.isFinite(size) || size <= 0) {
    const buf = new Uint8Array(await res.arrayBuffer());
    size = buf.byteLength;
    body = new Response(buf).body;
  }

  const range = parseRange(rangeHeader, size);
  if (range === null) return new Response(body, { status: 200, headers });
  if (range === 'unsatisfiable') {
    await body?.cancel();
    headers.delete('content-length');
    headers.set('content-range', `bytes */${size}`);
    return new Response(null, { status: 416, headers });
  }

  const length = range.end - range.start + 1;
  headers.set('content-range', `bytes ${range.start}-${range.end}/${size}`);
  headers.set('content-length', String(length));
  if (request.method === 'HEAD') {
    await body?.cancel();
    return new Response(null, { status: 206, headers });
  }
  return new Response(fixedLength(slice(body, range.start, range.end + 1), length), { status: 206, headers });
}
