import { describe, it } from 'node:test';
import assert from 'node:assert';
import MBP from 'meta-buffer-pack'

describe('parseTypeName', function () {
  describe('should return', function () {

    const typeList = {
      '8':'uint8',
      '8i':'int8',
      'I8':'int8',
      '16':'uint16_be',
      '16l':'uint16_le',
      '16i':'int16_be',
      '16il':'int16_le',
      '16LI':'int16_le',
      '32':'uint32_be',
      '32l':'uint32_le',
      '32i':'int32_be',
      '32iL':'int32_le',
      'I32L':'int32_le',
      'f':'float_be',
      'fl':'float_le',
      'b':'buffer',
      's':'string',
      'n':'number',
      'o':'object',
      '!':'boolean'
    }

    for( let type in typeList){
      it( type + ' -> '+ typeList[type], function () {
        const typeName = MBP.parseTypeName( type )
        assert.equal( typeName , typeList[type]  )
      })
    }

  })

})
