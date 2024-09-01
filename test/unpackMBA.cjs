const { describe, it } = require('node:test');
const assert = require('node:assert');
let MBP = require( 'meta-buffer-pack')

describe('unpack MB+MBA or MBA only', function () {

  describe('MBA only pack', function () {
    it('should return object', function () {
      const pack = MBP.pack(
        MBP.MBA('aaa','bbb') 
      )
      const unpack = MBP.unpack(pack)
      assert.ok( typeof unpack === 'object')
    })
  })

  describe('MB + MBA pack', function () {
    it('should return object', function () {
      const pack = MBP.pack(
        MBP.MB('name','32',0xffff),
        MBP.MBA('aaa','bbb') 
      )
      const unpack = MBP.unpack(pack)
      assert.ok( typeof unpack === 'object')
    })
  })

  describe('unpacked object', function () {
    const pack = MBP.pack(
      MBP.MBA('aaa','bbb') 
    )
    const mbaObject = MBP.unpack(pack)
    
    it('should have property: args', function () {
      assert.ok(  mbaObject.args )
    })
    
    it('should have property: $', function () {
      assert.ok(  mbaObject.$ )
    })

    it('should equal $.length and number of MBA arguments', function () {
      assert.equal(  mbaObject.$.length, 2  ) // 'aaa','bbb'  two arguments.
    })

  })

  describe('mixed MBA: object and text', function () {
    const pack = MBP.pack(
      MBP.MBA({a:1},'hello') 
    )
    const mbaObject = MBP.unpack(pack)

    it('should equal object values', function () {
      assert.equal(  mbaObject.$[0].a, 1  ) 
    })
    it('should equal text values', function () {
      assert.equal(  mbaObject.$[1], 'hello'  ) 
    })

  })

  describe('mixed MBA: object and buffer', function () {
    const buffer = new Uint8Array(12)
    const pack = MBP.pack(
      MBP.MB('counter','32',0xffff),
      MBP.MBA({a:1}, buffer) 
    )
    const mbaObject = MBP.unpack(pack)

    it('should equal object values', function () {
      assert.equal(  mbaObject.$[0].a, 1  ) 
    })
    it('should equal buffers', function () {
      assert.ok(MBP.equal(mbaObject.$[1], buffer ))
    })

    it('should equal prop values', function () {
      assert.equal(  mbaObject.counter, 0xffff  ) 
    })

  })


})
