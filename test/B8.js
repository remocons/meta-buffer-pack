import { describe, it } from 'node:test';
import assert from 'node:assert';
import MBP from 'meta-buffer-pack'

describe('B8', function () {
  describe('should return nodeJS Buffer', function () {
    const num = 16

    it('buffer is instance of Uint8Array', function () {
      assert.ok(MBP.B8(num) instanceof Uint8Array)
    })

    it('has Buffer method', function () {
      const b8 = MBP.B8('hello world')
      assert.equal(b8.toString('hex'), '68656c6c6f20776f726c64')
      assert.equal(b8.toString('base64'), 'aGVsbG8gd29ybGQ=')
    })
  })


  describe('for number', function () {
    const num = 16
    it('should return Uint8Array', function () {
      assert.ok(MBP.B8(num) instanceof Uint8Array)
    })

    it('should return one byte length', function () {
      assert.ok(MBP.B8(num).byteLength === 1)
    })
  })

  describe('for string', function () {
    it('should return UTF8 encoded Buffer', function () {
      const str = 'hello 안녕'
      const encodedStr = new TextEncoder().encode(str)
      assert.ok(MBP.equal(MBP.B8(str), encodedStr))
    })
  })

  describe('for TypedArray', function () {
    it('should return byteLength == TypedArray.BYTES_PER_ELEMENT', function () {
      assert.ok(MBP.B8(new Uint8Array(1)).byteLength === Uint8Array.BYTES_PER_ELEMENT)
      assert.ok(MBP.B8(new Uint16Array(1)).byteLength === Uint16Array.BYTES_PER_ELEMENT)
      assert.ok(MBP.B8(new Uint32Array(1)).byteLength === Uint32Array.BYTES_PER_ELEMENT)
    })

    it('should return byteLength == TypedArray.BYTES_PER_ELEMENT * itemLength', function () {
      const len = 3
      assert.ok(MBP.B8(new Uint8Array(len)).byteLength === Uint8Array.BYTES_PER_ELEMENT * len)
      assert.ok(MBP.B8(new Uint16Array(len)).byteLength === Uint16Array.BYTES_PER_ELEMENT * len)
      assert.ok(MBP.B8(new Uint32Array(len)).byteLength === Uint32Array.BYTES_PER_ELEMENT * len)
    })
  })

  describe('for ArrayBuffer', function () {
    it('should same byteLength ', function () {
      const len = 3
      const arraybuffer = new ArrayBuffer(len)
      assert.ok(MBP.B8(arraybuffer).byteLength === arraybuffer.byteLength)
    })
  })

  describe('shareArrayBuffer option', function () {
    // B8( arraybuffer, false)
    it('if false(default). return new memory(arraybuffer)  ', function () {
      const input = new Uint32Array(1)
      input[0] = 0xffffffff
      const b8 = MBP.B8(input, false)
      input[0] = 0x12345678 // modify input data after B8 converting.

      // if sharedArrayBuffer === false. there is no dependency.
      assert.ok(MBP.equal(b8, Buffer.from([255, 255, 255, 255])))
    })

    it('if true.  memory is shared ', function () {
      const input = new Uint32Array(1)
      input[0] = 0xffffffff
      const b8 = MBP.B8(input, true)
      input[0] = 0x12345678 // modify input data after B8 converting.

      // if sharedArrayBuffer === true. It depend on input data.
      assert.ok(MBP.equal(b8, Buffer.from('78563412', 'hex')))
    })
  })
})
