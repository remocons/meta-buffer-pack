import assert from 'assert/strict';
import { MBP, Buffer } from '../src/index.js'


describe('U8', function () {

  describe('for number', function () {

    it('should return Uint8Array', function () {
      assert.ok(  MBP.U8(1) instanceof Uint8Array ) 
    });

    it('should return one byte length Uint8Array', function () {
      assert.ok(  MBP.U8(1).byteLength === 1 ) 
    });

  });

  describe('for string', function () {

    it('should return UTF8 encoded Uint8Array UTF8 for string', function () {
      const str = 'hello 안녕하슈'
      const encodedStr = new TextEncoder().encode( str )
      assert.ok( MBP.equal(  MBP.U8( str ) , encodedStr ) );
    });


  });


});



describe('NB : Numbered Buffer', function () {

  describe('when type include:', function () {

    it('"8" should return 1 byte unsigned', function () {
      assert.ok(  MBP.NB('8', 222).byteLength === 1   ); 
    });
    it('"16" should return 2 byte unsigned', function () {
      assert.ok(  MBP.NB('16', 222).byteLength === 2   ); 
    });
    it('"32" should return 4 byte unsigned', function () {
      assert.ok(  MBP.NB('32', 222).byteLength === 4   ); 
    });

  });

  describe('when type include:', function () {

    it(' "i" or "I" then Signed', function () { 
      const n = -1000;
      const NB16i = MBP.NB('16i', n  )
      const int16be = Buffer.alloc(2);
      int16be.writeInt16BE(  n );
      // hex('NB16i', NB16i)
      // hex('int16be', int16be)
      assert.ok(  MBP.equal(  NB16i, int16be  ) ); 
    });

  });



});


  function prn(tag, v) {
    console.log(v)
  }
  function prnObj(tag, v) {
    v = JSON.stringify(v , null, 2)
    console.log(v)
  }

  function hex( title, data){
    console.log( title, MBP.hex( data) ) ;
  }

