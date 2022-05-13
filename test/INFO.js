import assert from 'assert/strict'
import { MBP, Buffer } from '../src/index.js'


describe('RAW Buffer VS. Frame info included Buffer', function () {

  describe('when Valid Frame Info(JSON) included)', function () {

    const packWithInfo = MBP.pack(
      MBP.MB('IthasBufferInfo', Buffer.from([1, 2, 3, 4]))
    )

    describe('getFrame', function () {
      it('should return object', function () {
        assert.ok(typeof MBP.getFrame(packWithInfo) === 'object')
      })
    })

    describe('getFrameSize', function () {
      it('should return number greater then zero', function () {
        assert.ok(MBP.getFrameSize(packWithInfo) > 0)
      })
    })

    describe('getBufferSize', function () {
      it('should equal : totalSize - infoSize - TAIL_LEN', function () {
        const infoSize = MBP.getFrameSize(packWithInfo)
        const rawBufferSize = MBP.getBufferSize(packWithInfo)
        const tailSize = MBP.TAIL_LEN //2
        assert.equal(rawBufferSize, packWithInfo.byteLength - infoSize - tailSize)
      })
    })

    describe('getBuffer size', function () {
      it('should  equal: rawBuffer.byteLength === totalSize - infoSize - TAIL_LEN', function () {
        const infoSize = MBP.getFrameSize(packWithInfo)
        const rawBuffer = MBP.getBuffer(packWithInfo)
        const tailSize = MBP.TAIL_LEN //2
        assert.equal(rawBuffer.byteLength, packWithInfo.byteLength - infoSize - tailSize)
      })
    })

  })

  describe('when raw Buffer( No JSON Frame Info)', function () {

    const packWithoutInfo = MBP.pack(
      MBP.MB('#noBufferInfo', Buffer.from([1, 2, 3, 4]))
    )

    describe('getFrame', function () {
      it('should return undefined', function () {
        assert.ok(MBP.getFrame(packWithoutInfo) === undefined)
      })
    })

    describe('getFrameSize', function () {
      it('should return 0', function () {
        assert.ok(MBP.getFrameSize(packWithoutInfo) === 0)
      })
    })

    describe('getBufferSize', function () {
      it('should equal : totalSize', function () {
        const rawBufferSize = MBP.getBufferSize(packWithoutInfo)
        assert.equal(rawBufferSize, packWithoutInfo.byteLength)
      })
    })

    describe('getBuffer', function () {
      it('should equal rawBuffer.byteLength === binPack.byteLength', function () {
        const rawBuffer = MBP.getBuffer(packWithoutInfo)
        assert.equal(rawBuffer.byteLength, packWithoutInfo.byteLength)
      })

      it('should equal rawBuffer ==  binPack', function () {
        const rawBuffer = MBP.getBuffer(packWithoutInfo)
        assert.ok(MBP.equal(rawBuffer, packWithoutInfo))
      })

    })

  })



})
