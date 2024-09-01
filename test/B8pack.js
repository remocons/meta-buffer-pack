import { describe, it } from 'node:test';
import assert from 'node:assert';
import MBP from 'meta-buffer-pack'

describe('B8pack', function () {

  describe('should return Buffer', function () {
    
    it('sum of source buffer length', function () {
      // text return utf8encoded buffer.  
      const pack = MBP.B8pack( 1,255, 'abc' )
      assert.equal( pack.byteLength , 5 )
    })
    
    
    describe('type of arguments', function () {

      it('Number return one byte with init value. max value is 255', function () {
        const pack = MBP.B8pack( 1,255, 256, 257  )
        assert.equal(pack.toString('hex'), '01ff0001')  // 255-> 255(0xff)  256 -> 0  257 -> 1
      })

      it('String return. UTF8 encoded buffer ', function () {
        const pack = MBP.B8pack('head')
        assert.equal(pack.toString('hex'), '68656164')
      })

      it('Object return. JSON.stringify() and UTF8 encoded buffer ', function () {
        const jsonInfo = { key:'value' } 
        const pack = MBP.B8pack(jsonInfo ) //same result:  Buffer.from( JSON.stringify( {key:'value'}) 

        const json = JSON.stringify( jsonInfo)
        const jsonBuffer = Buffer.from( json )
        assert.equal(pack.toString('hex'), jsonBuffer.toString('hex'))
      })
      
    })
    
    
    describe('merge', function () {
      it('multiple arguments will return one merged buffer', function () {
        const pack = MBP.B8pack("head", 1,2  )
        //same result: Buffer.concat([ Buffer.from('head'), Buffer.from([1,2,3])] )
        assert.equal(pack.toString('hex'), '686561640102') 
      })
    })
  })


})
