import { describe, it } from 'node:test';
import assert from 'node:assert';
import MBP from 'meta-buffer-pack'

describe('unpack MB', function () {
  describe('when unpack() fail. ', function () {
    it('should return undefined', function () {
      const pack = MBP.pack(
        MBP.MB('buffer', Buffer.from([1, 2, 3, 4]))
      )
      // modify bufferInfoSize as zero.
      pack.writeUInt16BE(0, pack.byteLength - 2)
      const unpack = MBP.unpack(pack)
      assert.ok(unpack === undefined)
    })
  })

  describe('when pack has not any info data:', function () {
    it('should return undefined', function () {
      const pack = MBP.pack(
        MBP.MB('#bufferWithoutInfo', Buffer.from([1, 2, 3, 4]))
      )
      const unpack = MBP.unpack(pack)
      assert.ok(unpack === undefined)
    })
  })

  describe('when unpack() success. ', function () {
    it('should return object', function () {
      const pack = MBP.pack(
        MBP.MB('buffer', Buffer.from([1, 2, 3, 4]))
      )

      const unpack = MBP.unpack(pack)
      assert.ok(typeof unpack === 'object')
    })

    it('should return value from object.keyName', function () {
      const keyName = 'bufferKeyName'
      const bufferData = Buffer.from([1, 2, 3, 4])
      const pack = MBP.pack(
        MBP.MB(keyName, bufferData)
      )
      const unpack = MBP.unpack(pack)

      assert.ok(MBP.equal(unpack[keyName], bufferData))
    })
  })
})

function prn (tag, v) {
  console.log(v)
}
function prnObj (tag, v) {
  v = JSON.stringify(v, null, 2)
  console.log(v)
}

function hex (title, data) {
  console.log(title, MBP.hex(data))
}
