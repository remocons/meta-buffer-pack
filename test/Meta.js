import { describe, it } from 'node:test';
import assert from 'node:assert';
import MBP from 'meta-buffer-pack'

describe('Meta', function () {

  describe('when Valid Meta Info(JSON) included)', function () {

    const packWithInfo = MBP.pack(
      MBP.MB('v32', '32', 0xffff ),
      MBP.MB('I have Meta info', Buffer.from([1, 2, 3, 4]))
    )

    describe('getMeta basic', function () {
      
      const metaInfo = MBP.getMeta(packWithInfo)
      
      it('should return object', function () {
        assert.ok(typeof metaInfo === 'object')
      })
      
      // meta object's first child is array that has 3 or 4 elements.
      // [ name:string|number, type:string, offset:number [,length:number] ]
      it('should first child: with 2nd element is string type', function () {
        assert.ok(typeof metaInfo[0][1] === 'string') // type is string
      })
      it('should first child: with 3rd element is number', function () {
        assert.ok(typeof metaInfo[0][2] === 'number') // offset is number
      })

    })

    describe('getMetaDetail', function () {
      // metaDetail object's first child is array which has 5 elements.
      // [ name:string:number, type:string, offset:number, length:number , fullTypeName:string ]

      it('should return object', function () {
        assert.ok(typeof MBP.getMetaDetail(packWithInfo) === 'object')
      })
      it('should return object. same above', function () {
        assert.ok(typeof MBP.getMeta(packWithInfo , true ) === 'object')
      })

      it('should return child which has 5 child elements.', function () {
        const metaDetail = MBP.getMetaDetail(packWithInfo)
        assert.ok( metaDetail[0].length === 5 )
      })

      it('should return object with byteLength', function () {
        const metaDetail = MBP.getMetaDetail(packWithInfo)
        assert.ok( metaDetail[0][3] === Uint32Array.BYTES_PER_ELEMENT )
      })

      it('should return object with full-type-name', function () {
        const metaDetail = MBP.getMetaDetail(packWithInfo)
        assert.ok( metaDetail[0][4] === 'uint32_be' )
      })

    })

    describe('getMetaSize', function () {
      it('should return number greater then zero', function () {
        assert.ok(MBP.getMetaSize(packWithInfo) > 0)
      })
    })

    describe('getBufferSize', function () {
      it('should equal : totalSize - infoSize - TAIL_LEN', function () {
        const infoSize = MBP.getMetaSize(packWithInfo)
        const rawBufferSize = MBP.getBufferSize(packWithInfo)
        const tailSize = MBP.TAIL_LEN //2
        assert.equal(rawBufferSize, packWithInfo.byteLength - infoSize - tailSize)
      })
    })

    describe('getBuffer size', function () {
      it('should  equal: rawBuffer.byteLength === totalSize - infoSize - TAIL_LEN', function () {
        const infoSize = MBP.getMetaSize(packWithInfo)
        const rawBuffer = MBP.getBuffer(packWithInfo)
        const tailSize = MBP.TAIL_LEN //2
        assert.equal(rawBuffer.byteLength, packWithInfo.byteLength - infoSize - tailSize)
      })
    })

  })

  describe('when Buffer has not JSON Meta Info', function () {

    const packWithoutInfo = MBP.pack(
      MBP.MB('#noBufferInfo', Buffer.from([1, 2, 3, 4]))
    )

    describe('getMeta', function () {
      it('should return undefined', function () {
        assert.ok(MBP.getMeta(packWithoutInfo) === undefined)
      })
    })

    describe('getMeta detail', function () {
      it('should return undefined', function () {
        assert.ok(MBP.getMetaDetail(packWithoutInfo) === undefined)
      })
    })

    describe('getMetaSize', function () {
      it('should return 0', function () {
        assert.ok(MBP.getMetaSize(packWithoutInfo) === 0)
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



  describe('when Valid Meta Info(JSON) included)', function () {

    const packWithInfo = MBP.pack(
      MBP.MB('v32', '32', 0xffff ),
      MBP.MB('I have Meta info', Buffer.from([1, 2, 3, 4]))
    )
  })


})

