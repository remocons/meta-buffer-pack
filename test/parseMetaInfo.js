import { describe, it } from 'node:test';
import assert from 'node:assert';
import MBP from 'meta-buffer-pack'

describe('parseMetaInfo', function () {

  describe('Valid JSON, but Invalid Meta.', function () {

    describe('Meta is array. but without child is invalid.', function () {
      it('should return undefined', function () {

        let jsonStr = '[1111111]'
        let jsonBuffer = MBP.B8( jsonStr )
        let pack = MBP.pack( MBP.MB('#json', jsonBuffer ) , MBP.MB('','16', jsonBuffer.byteLength ) )
        assert.ok( MBP.parseMetaInfo(pack ) === undefined)
      })
    })


    describe('child should not has 3 or 4 items.', function () {
      it('should return undefined', function () {
        let jsonStr = '[[1,2]]'
        let jsonBuffer = MBP.B8( jsonStr )
        let pack = MBP.pack( MBP.MB('#json', jsonBuffer ) , MBP.MB('','16', jsonBuffer.byteLength ) )
        // console.log('pack', pack)
        // console.log( MBP.parseMetaInfo(pack )  )
        assert.ok( MBP.parseMetaInfo(pack ) === undefined)
      })
    })
    
    describe('3 element. but first and second is not string', function () {
      it('should return undefined', function () {
        let jsonStr = '[[1,2,3]]'
        let jsonBuffer = MBP.B8( jsonStr )
        let pack = MBP.pack( MBP.MB('#json', jsonBuffer ) , MBP.MB('','16', jsonBuffer.byteLength ) )
        assert.ok( MBP.parseMetaInfo(pack ) === undefined)
      })
    })
    
  })

  describe('Valid Meta', function () {
    describe('has element. first,second :string, 3rd: number ', function () {
      it('should return object', function () {
        let jsonStr = '[["","",3]]'
        let jsonBuffer = MBP.B8( jsonStr )
        let pack = MBP.pack( MBP.MB('#json', jsonBuffer ) , MBP.MB('','16', jsonBuffer.byteLength ) )
        assert.ok( typeof MBP.parseMetaInfo(pack ) === 'object')
      })
    })
  })

})
