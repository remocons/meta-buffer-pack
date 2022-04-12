import assert from 'assert/strict';
import { MBP, Buffer } from '../src/index.js'

describe('MB : Meta Buffer', function () {

  describe('MB()', function () {
    it('should return Array which has 3 items.', function () {
      // ['title', 'type',  < buffer > ]
      assert.ok(Array.isArray(MBP.MB('title', '16', 65000)));
      assert.ok(MBP.MB('title', '16', 65000).length === 3);
    });
  });


  describe('for buffer => MB( title,  buffer ) ', function () {
    const title = 'bufferName'
    const buffer = new Uint8Array(12)

    let mb = MBP.MB(title, buffer)
    describe('should return mb items.', function () {

      it('mb[0] === title', function () {
        assert.equal(mb[0], title);
      });
      it('mb[1] === "B" ', function () {
        assert.equal(mb[1], 'B');
      });
      it('mb[2] === buffer ', function () {
        assert.ok(MBP.equal(mb[2], buffer));
      });

    });

    describe('should return', function () {
      it('mb[2].byteLength == TypedArray.BYTES_PER_ELEMENT * itemLength', function () {
        const len = 3
        assert.ok(MBP.MB('bufferTitle', new Uint8Array(len))[2].byteLength === Uint8Array.BYTES_PER_ELEMENT * len)
        assert.ok(MBP.MB('anyStringName', new Uint16Array(len))[2].byteLength === Uint16Array.BYTES_PER_ELEMENT * len)
        assert.ok(MBP.MB('bufferName', new Uint32Array(len))[2].byteLength === Uint32Array.BYTES_PER_ELEMENT * len)
      });
    });

  });


  describe('for arrayBuffer => MB( title,  arrayBuffer ) ', function () {
    const title = 'title'
    const buffer = new Uint8Array(12)
    const arraybuffer = buffer.buffer;

    let mb = MBP.MB(title, arraybuffer)
    describe('should return mb items.', function () {

      it('mb[0] === title', function () {
        assert.equal(mb[0], title);
      });
      it('mb[1] === "B" ', function () {
        assert.equal(mb[1], 'B');
      });
      it('mb[2] === Uint8Array(arrayBuffer) ', function () {
        assert.ok(MBP.equal(mb[2],  new Uint8Array(arraybuffer) ));
      });

    });

    describe('for TypedArray.arraybuffer  should return', function () {
      it('mb[2].byteLength == TypedArray.BYTES_PER_ELEMENT * itemLength', function () {
        const len = 3
        assert.ok(MBP.MB('bufferTitle', new Uint8Array(len).buffer )[2].byteLength === Uint8Array.BYTES_PER_ELEMENT * len)
        assert.ok(MBP.MB('anyStringName', new Uint16Array(len).buffer )[2].byteLength === Uint16Array.BYTES_PER_ELEMENT * len)
        assert.ok(MBP.MB('bufferName', new Uint32Array(len).buffer )[2].byteLength === Uint32Array.BYTES_PER_ELEMENT * len)
      });
    });

  });



  describe('for String => MB( title,  string ) ', function () {
    const title = 'variableName'
    const str = 'hello 안녕하슈'
    let mb = MBP.MB(title, str)

    describe('should return', function () {

      it('mb[0] === title', function () {
        assert.equal(mb[0], title);
      });
      it('mb[1] === "S" ', function () {
        assert.equal(mb[1], 'S');
      });
      it('mb[2] === stringEncodedBuffer ', function () {
        assert.ok(MBP.equal(mb[2], new TextEncoder().encode(str)));
      });

    });

  });

  describe('for Typed Number => MB( title, type , number ) ', function () {
    const title = 'variableName'
    const type = '32i'
    const num = 255
    let mb = MBP.MB(title, type, num)

    describe('should return', function () {

      it('mb[0] === title', function () {
        assert.equal(mb[0], title);
      });
      it('mb[1] === "32I"  upperCase() ', function () {
        assert.equal(mb[1], '32I');
      });
      it('mb[2] === numberBuffer ', function () {
        assert.ok(MBP.equal(mb[2], Buffer.from('000000ff', 'hex')));
      });

    });

  });

  describe('for size and initvalue => MB( title, size , initvalue ) ', function () {
    const title = 'variableName'
    const size = 4
    const num = 255
    let mb = MBP.MB(title, size, num)

    describe('should return', function () {

      it('mb[0] === title', function () {
        assert.equal(mb[0], title);
      });
      it('mb[1] === "B"', function () {
        assert.equal(mb[1], 'B');
      });

      it('mb[2].byteLenght === size ', function () {
        assert.equal(mb[2].byteLength, size);
      });

      it('mb[2] === bufferWithInitValue ', function () {
        assert.ok(MBP.equal(mb[2], Buffer.from('ffffffff', 'hex')));
      });

    });

  });

  describe('for Number without initvalue => MB( title, number ) ', function () {
    const title = 'variableName'
    const num = 255
    let mb = MBP.MB(title, num)
    console.log('mb', mb )

    describe('should return', function () {

      it('mb[0] === title', function () {
        assert.equal(mb[0], title);
      });
      it('mb[1] === "N"', function () {
        assert.equal(mb[1], 'N');
      });

      it('mb[2].byteLength === numberStringEncoded.byteLength ', function () {
        const numberStringEncoded = new TextEncoder().encode( num )
        assert.equal(mb[2].byteLength, numberStringEncoded.byteLength );
      });

      it('mb[2] === numberStringEncoded ', function () {
        const numberStringEncoded = new TextEncoder().encode( num )
        assert.ok(MBP.equal(mb[2], numberStringEncoded ));
      });

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

