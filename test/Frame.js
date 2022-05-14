import assert from 'assert/strict'
import { MBP, Buffer } from '../src/index.js'


describe('Frame', function () {

  describe('when Valid Frame Info(JSON) included)', function () {

    const packWithInfo = MBP.pack(
      MBP.MB('v32', '32', 0xffff ),
      MBP.MB('I have Frame info', Buffer.from([1, 2, 3, 4]))
    )

    describe('getFrame basic', function () {
      // frame object's first child is array that has 3 or 4 elements.
      // [ name:string, type:string, offset:number [,length:number] ]

      const frameInfo = MBP.getFrame(packWithInfo)

      it('should return object', function () {
        assert.ok(typeof frameInfo === 'object')
      })

      it('should first child: with 1st element is string type', function () {
        assert.ok(typeof frameInfo[0][0] === 'string') // name
      })
      it('should first child: with 2nd element is string type', function () {
        assert.ok(typeof frameInfo[0][1] === 'string') // type
      })
      it('should first child: with 3rd element is number', function () {
        assert.ok(typeof frameInfo[0][2] === 'number') // offset
      })

    })

    describe('getFrameDetail', function () {
      // frameDetail object's first child is array which has 5 elements.
      // [ name:string, type:string, offset:number, length:number , fullTypeName:string ]

      it('should return object', function () {
        assert.ok(typeof MBP.getFrameDetail(packWithInfo) === 'object')
      })
      it('should return object. same above', function () {
        assert.ok(typeof MBP.getFrame(packWithInfo , true ) === 'object')
      })

      it('should return child which has 5 child elements.', function () {
        const frameDetail = MBP.getFrameDetail(packWithInfo)
        assert.ok( frameDetail[0].length === 5 )
      })

      it('should return object with byteLength', function () {
        const frameDetail = MBP.getFrameDetail(packWithInfo)
        assert.ok( frameDetail[0][3] === Uint32Array.BYTES_PER_ELEMENT )
      })

      it('should return object with full-type-name', function () {
        const frameDetail = MBP.getFrameDetail(packWithInfo)
        assert.ok( frameDetail[0][4] === 'uint32_be' )
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

  describe('when Buffer has not JSON Frame Info', function () {

    const packWithoutInfo = MBP.pack(
      MBP.MB('#noBufferInfo', Buffer.from([1, 2, 3, 4]))
    )

    describe('getFrame', function () {
      it('should return undefined', function () {
        assert.ok(MBP.getFrame(packWithoutInfo) === undefined)
      })
    })

    describe('getFrame detail', function () {
      it('should return undefined', function () {
        assert.ok(MBP.getFrameDetail(packWithoutInfo) === undefined)
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
