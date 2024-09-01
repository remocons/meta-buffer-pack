import { describe, it } from 'node:test';
import assert from 'node:assert';
import MBP from 'meta-buffer-pack'

describe('NB : Numbered Buffer', function () {
  describe('when type include:', function () {
    it('"8" should return 1 byte unsigned', function () {
      assert.ok(MBP.NB('8', 222).byteLength === 1)
    })
    it('"16" should return 2 byte unsigned', function () {
      assert.ok(MBP.NB('16', 222).byteLength === 2)
    })
    it('"32" should return 4 byte unsigned', function () {
      assert.ok(MBP.NB('32', 222).byteLength === 4)
    })
  })

  describe('when type include:', function () {
    it(' "i" or "I" then Signed', function () {
      const n = -1000
      const NB16i = MBP.NB('16i', n)
      const int16be = Buffer.alloc(2)
      int16be.writeInt16BE(n)
      assert.ok(MBP.equal(NB16i, int16be))
    })

    it(' "l" or "L" then LittleEndian', function () {
      const n = 0x1234
      const NB16L = MBP.NB('16L', n)
      assert.ok(MBP.equal(NB16L, Buffer.from('3412', 'hex')))
    })

    it('defaut is UnSigned BigEndian.', function () {
      const n = 0x1234
      const NB16 = MBP.NB('16', n)
      assert.ok(MBP.equal(NB16, Buffer.from('1234', 'hex')))
    })
  })

  describe('when type is float:', function () {
    it('should return 4 byte buffer', function () {
      assert.ok(MBP.NB('f', 222.1234).byteLength === 4);
    });

    it('BE', function () {
      assert.ok(MBP.equal(MBP.NB('f', 3.141592), Buffer.from([0x40, 0x49, 0x0f, 0xd8])));
    });

    it('LE', function () {
      assert.ok(MBP.equal(MBP.NB('fl', 3.141592), Buffer.from([0xd8, 0x0f, 0x49, 0x40])));
    });
  });

})
