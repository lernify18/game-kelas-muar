// Unit tests for m3PakejIds (src/pakej-id.js): the embed URL carries each shop's own Sellhiz product ids, and only a
// product UUID or a positive add-to-cart number may reach the host's add-to-cart message.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const src = readFileSync(new URL('./pakej-id.js', import.meta.url), 'utf8');
const ctx = vm.createContext({ URLSearchParams });
vm.runInContext(src, ctx);
const ids = (search) => JSON.parse(JSON.stringify(ctx.m3PakejIds(search)));

const B = 'ca270bc1-2379-4fff-a70c-37b148cc6e5d';
const U = '4408a02f-2613-4903-afb3-d89db4021e0a';

test('reads a UUID or an add-to-cart number for each package', () => {
  assert.deepEqual(ids(`?basic=${B}&pro=53849&usahawan=${U}`), { basic: B, pro: '53849', usahawan: U });
  assert.deepEqual(ids(`basic=${B.toUpperCase()}`), { basic: B.toUpperCase() });
  assert.deepEqual(ids(`?pro=%20${B}%20`), { pro: B });
});

test('empty or missing values give no id, so the button falls back to scroll-to-payment', () => {
  assert.deepEqual(ids(''), {});
  assert.deepEqual(ids(undefined), {});
  assert.deepEqual(ids('?basic=&pro=%20&usahawan'), {});
});

test('too long values are dropped', () => {
  assert.deepEqual(ids('?pro=1234567890'), {});
  assert.deepEqual(ids(`?basic=${B}0`), {});
  assert.deepEqual(ids(`?basic=${'a'.repeat(5000)}`), {});
});

test('odd symbols, negatives and zero are dropped', () => {
  for (const v of ['%3Cscript%3Ealert(1)%3C%2Fscript%3E', '1%3Bdrop', '..%2F..%2Fadmin', 'javascript:alert(1)', '-5', '0', '007', '1.5', '1e3', `${B}%22`, B.replace(/-/g, '')]) {
    assert.deepEqual(ids(`?basic=${v}`), {}, v);
  }
});

test('only the three package keys are read', () => {
  assert.deepEqual(ids(`?premium=${B}&BASIC=${B}&basic[]=${B}`), {});
  assert.deepEqual(ids(`?basic=111&basic=222`), { basic: '111' });
});
