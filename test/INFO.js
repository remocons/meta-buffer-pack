import assert from 'assert/strict'
import { MBP, Buffer } from '../src/index.js'


describe('INFO', function () {
  
  describe('when Valid JSON Info included)', function () {
    
    const packWithInfo = MBP.pack(
      MBP.MB('IthasBufferInfo', Buffer.from([1, 2, 3, 4]))
    )

    describe('getBufferInfo', function () {

      it('should return object', function () {
        assert.ok( typeof MBP.getBufferInfo( packWithInfo) === 'object')
      })

    })

    describe('getInfoSize', function () {
      it('should return number greater then zero', function () {
        assert.ok(  MBP.getInfoSize( packWithInfo) > 0 )
      })
    })

    describe('getRawBufferSize', function () {
      it('should equal : totalSize - infoSize - TAIL_LEN', function () {
        const infoSize = MBP.getInfoSize( packWithInfo )
        const rawBufferSize = MBP.getRawBufferSize( packWithInfo)
        const tailSize = MBP.TAIL_LEN //2
        assert.equal( rawBufferSize,  packWithInfo.byteLength - infoSize - tailSize )
      })
    })

    describe('getRawBuffer', function () {
      it('should  equal: rawBuffer.byteLength === totalSize - infoSize - TAIL_LEN', function () {
        const infoSize = MBP.getInfoSize( packWithInfo )
        const rawBuffer = MBP.getRawBuffer( packWithInfo)
        const tailSize = MBP.TAIL_LEN //2
        assert.equal( rawBuffer.byteLength ,  packWithInfo.byteLength - infoSize - tailSize )
      })

    })


  })
  
  describe('when rawBuffer( JSON not included)', function () {
    
    const packWithoutInfo = MBP.pack(
      MBP.MB('#noBufferInfo', Buffer.from([1, 2, 3, 4]))
    )

    describe('getBufferInfo', function () {

      it('should return undefined', function () {

        assert.ok( MBP.getBufferInfo( packWithoutInfo) === undefined)
      })

    })

    describe('getInfoSize', function () {
      it('should return 0', function () {
    
        assert.ok( MBP.getInfoSize( packWithoutInfo) === 0 )
      })
    })



    describe('getRawBufferSize', function () {
      it('should equal : totalSize', function () {
        const rawBufferSize = MBP.getRawBufferSize( packWithoutInfo)
        assert.equal( rawBufferSize,  packWithoutInfo.byteLength )
      })
    })



    describe('getRawBuffer', function () {
      it('should equal rawBuffer.byteLength === binPack.byteLength', function () {
        const rawBuffer = MBP.getRawBuffer( packWithoutInfo)
        assert.equal( rawBuffer.byteLength ,  packWithoutInfo.byteLength  )
      })
      
      it('should equal rawBuffer ==  binPack', function () {
        const rawBuffer = MBP.getRawBuffer( packWithoutInfo)
        assert.ok( MBP.equal( rawBuffer, packWithoutInfo ) )
      })

    })


  })

  






})
