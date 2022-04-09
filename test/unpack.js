import assert from 'assert/strict';
import { MBP, Buffer } from '../src/index.js'

describe('unpack', function () {

  describe('when unpack() fail. ', function () {
    it('should return udefined', function () {
      const pack = MBP.pack(
        MBP.MB('buffer', Buffer.from([1,2,3,4]) )
        )
      // modify bufferInfoSize zero.  
      pack[ pack.byteLength -1 ] = 0
      pack[ pack.byteLength -2 ] = 0

      const unpack = MBP.unpack( pack )
      assert.ok( unpack === undefined);
    });
  });


  describe('when unpack() success. ', function () {


    it('should return object', function () {
      const pack = MBP.pack(
        MBP.MB('buffer', Buffer.from([1,2,3,4]) )
      )

      const unpack = MBP.unpack( pack )
      assert.ok( typeof unpack === 'object' );
    });

    it('should return value from object.keyName', function () {
      const keyName = 'bufferKeyName'
      const bufferData = Buffer.from([1,2,3,4])
      const pack = MBP.pack(
        MBP.MB( keyName, bufferData )
       )
      const unpack = MBP.unpack( pack )

      assert.ok(  MBP.equal( unpack[keyName] , bufferData ) )

    });


  });






});





function prn(tag, v) {
  console.log(v)
}
function prnObj(tag, v) {
  v = JSON.stringify(v, null, 2)
  console.log(v)
}

function hex(title, data) {
  console.log(title, MBP.hex(data));
}

