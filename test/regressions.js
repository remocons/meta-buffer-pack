import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import esm from 'meta-buffer-pack';
import * as source from '../src/meta-buffer-pack.js';
const cjs = createRequire(import.meta.url)('meta-buffer-pack');

for (const [name, MBP] of Object.entries({ source, esm, cjs })) {
  describe(`${name} regressions`, () => {
    it('preserves falsy arguments, null and following arguments', () => {
      const values = [0, false, '', null, NaN, 'last'];
      const result = MBP.unpack(MBP.pack(MBP.MBA(...values)));
      assert.deepEqual(result.args, values);
      assert.equal(result.$, result.args);
      assert.equal(result[3], null);
      assert.deepEqual(MBP.unpack(MBP.pack(MBP.MB('value', null))), { value: null });
    });
    it('preserves special property names as own data properties', () => {
      const result = MBP.unpack(MBP.pack(MBP.MB('__proto__', { safe: true })));
      assert.equal(Object.getPrototypeOf(result), Object.prototype);
      assert.deepEqual(result.__proto__, { safe: true });
    });
    it('rejects every malformed metadata entry and bounds violation', () => {
      const raw = MBP.Buffer.from([1, 2, 3, 4]);
      const invalid = [null, {}, new Array(1), [['x', 'B', 99, 1]], [['x', 'B', -1, 1]],
        [['x', 'B', 0.5, 1]], [['x', 'B', 0, -1]], [['x', 'B', 0, 5]],
        [['x', 'B', 0]], [['x', '16', 0, 1]], [['x', '16', 3]],
        [['x', '?', 0, 1]], [['x', 'B', 0, 1], null],
        [['x', 'B', 0, 1], [null, 'B', 0, 1]]];
      for (const meta of invalid) assert.equal(MBP.unpack(raw, meta), undefined);
      assert.equal(MBP.readTypedBuffer('B', raw, 99, 1), undefined);
      assert.equal(MBP.readTypedBuffer('16', raw, 0, 1), undefined);
    });
    it('rejects embedded metadata that reads into its own JSON or has a bad later entry', () => {
      for (const meta of [[['x', 'B', 0, 2]], [['x', '8', 0, 1], null]]) {
        const json = MBP.Buffer.from(JSON.stringify(meta));
        const packet = MBP.Buffer.concat([MBP.Buffer.from([1]), json, MBP.NB('16', json.length)]);
        assert.equal(MBP.getMeta(packet), undefined);
        assert.equal(MBP.unpack(packet), undefined);
      }
    });
    it('uses the final field end for trailing bytes and infers fixed widths', () => {
      const raw = MBP.Buffer.from([1, 2, 3, 4, 5]);
      const result = MBP.unpack(raw, [['later', '8', 2], ['first', '8', 0]]);
      assert.equal(result.first, 1);
      assert.equal(result.later, 3);
      assert.deepEqual([...result.$OTHERS], [4, 5]);
      assert.deepEqual(MBP.unpack(raw, []).$OTHERS, raw);
    });
    it('rejects undecodable objects without returning partial results', () => {
      assert.equal(MBP.unpack(MBP.Buffer.from('x'), [['bad', 'O', 0, 1]]), undefined);
    });
    it('throws for unsupported number types', () => {
      assert.throws(() => MBP.NB('?'), TypeError);
    });
    it('retains empty fields and TypedArray byte representation', () => {
      const result = MBP.unpack(MBP.pack(MBP.MB('empty', ''), MBP.MB('bytes', new Uint16Array([258]))));
      assert.equal(result.empty, '');
      assert.deepEqual([...result.bytes], [...new Uint8Array(new Uint16Array([258]).buffer)]);
    });
  });
}
