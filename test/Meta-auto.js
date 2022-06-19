import assert from 'assert/strict'
import { MBP, Buffer } from '../src/index.js'


describe('Meta Automatic property', function () {



  describe('unpack raw buffer using meta', function () {

    let variableBufferSize = 1 + Math.floor( Math.random() * 20 )
    let vBuffer = Buffer.alloc( variableBufferSize)
    vBuffer.fill(variableBufferSize)

    let rawBuffer = MBP.pack( 
      MBP.MB('#type','8', 1 ),
      MBP.MB('#len','8', 18 + variableBufferSize  ),
      MBP.MB('#otpSrc8', Buffer.from([1,2,3,4,5,6,7,8]) ),
      MBP.MB('#hmac8', Buffer.from([1,2,3,4,5,6,7,8]) ),
      MBP.MB('#vBuffer', vBuffer )
    )   

    let meta = MBP.meta( 
      MBP.MB('type','8', 0 ),
      MBP.MB('len','8', 0 ), 
      MBP.MB('otpSrc8', Buffer.alloc(8) ),
      MBP.MB('hmac8', Buffer.alloc(8) )
      // MBP.MB('vBuffer', vBuffer )  // meta structure doesn't know variable buffer size.
    )   

    let unpack = MBP.unpack( rawBuffer , meta)
    console.log( '######## unpack obj',unpack)
  
    it('automatic property name $LEFT to read left buffer', function () {
      assert.ok(  MBP.equal( unpack.$LEFT  , vBuffer ) ) 
    })
    it('automatic property name $LEFT : same buffer size', function () {
      assert.ok(  unpack.$LEFT.byteLength === variableBufferSize) 
    })


  })

})

