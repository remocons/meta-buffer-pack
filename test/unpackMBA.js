import assert from 'assert/strict'
import { MBP, Buffer } from '../src/index.js'

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
    // console.log( mbaObject )

    
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



})
