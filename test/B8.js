
import assert from 'assert/strict'
import { MBP } from '../src/index.js'

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
})
