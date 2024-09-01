import { describe, it } from 'node:test';
import assert from 'node:assert';
import MBP from 'meta-buffer-pack'

describe('MB : Meta Buffer', function () {
  describe('MB()', function () {
    it('should return Array which has 3 items.', function () {
      // ['title', 'type',  < buffer > ]
      assert.ok(Array.isArray(MBP.MB('title', '16', 65000)))
      assert.ok(MBP.MB('title', '16', 65000).length === 3)
    })
  })

  describe('for buffer => MB( title,  buffer ) ', function () {
    const title = 'bufferName'
    const buffer = new Uint8Array(12)

    const mb = MBP.MB(title, buffer)
    describe('should return mb items.', function () {
      it('mb[0] === title', function () {
        assert.equal(mb[0], title)
      })
      it('mb[1] === "B" ', function () {
        assert.equal(mb[1], 'B')
      })
      it('mb[2] === buffer ', function () {
        assert.ok(MBP.equal(mb[2], buffer))
      })
    })

    describe('should return', function () {
      it('mb[2].byteLength == TypedArray.BYTES_PER_ELEMENT * itemLength', function () {
        const len = 3
        assert.ok(MBP.MB('bufferTitle', new Uint8Array(len))[2].byteLength === Uint8Array.BYTES_PER_ELEMENT * len)
        assert.ok(MBP.MB('anyStringName', new Uint16Array(len))[2].byteLength === Uint16Array.BYTES_PER_ELEMENT * len)
        assert.ok(MBP.MB('bufferName', new Uint32Array(len))[2].byteLength === Uint32Array.BYTES_PER_ELEMENT * len)
      })
    })
  })

  describe('for arrayBuffer => MB( title,  arrayBuffer ) ', function () {
    const title = 'title'
    const buffer = new Uint8Array(12)
    const arraybuffer = buffer.buffer

    const mb = MBP.MB(title, arraybuffer)
    describe('should return mb items.', function () {
      it('mb[0] === title', function () {
        assert.equal(mb[0], title)
      })
      it('mb[1] === "B" ', function () {
        assert.equal(mb[1], 'B')
      })
      it('mb[2] === Uint8Array(arrayBuffer) ', function () {
        assert.ok(MBP.equal(mb[2], new Uint8Array(arraybuffer)))
      })
    })

    describe('for TypedArray.arraybuffer  should return', function () {
      it('mb[2].byteLength == TypedArray.BYTES_PER_ELEMENT * itemLength', function () {
        const len = 3
        assert.ok(MBP.MB('bufferTitle', new Uint8Array(len).buffer)[2].byteLength === Uint8Array.BYTES_PER_ELEMENT * len)
        assert.ok(MBP.MB('anyStringName', new Uint16Array(len).buffer)[2].byteLength === Uint16Array.BYTES_PER_ELEMENT * len)
        assert.ok(MBP.MB('bufferName', new Uint32Array(len).buffer)[2].byteLength === Uint32Array.BYTES_PER_ELEMENT * len)
      })
    })
  })

  describe('for String => MB( title,  string ) ', function () {
    const title = 'variableName'
    const str = 'hello 안녕하슈'
    const mb = MBP.MB(title, str)

    describe('should return', function () {
      it('mb[0] === title', function () {
        assert.equal(mb[0], title)
      })
      it('mb[1] === "S" ', function () {
        assert.equal(mb[1], 'S')
      })
      it('mb[2] === stringEncodedBuffer ', function () {
        assert.ok(MBP.equal(mb[2], new TextEncoder().encode(str)))
      })
    })
  })
  describe('for String => MB( title,  object ) ', function () {
    const title = 'variableName'
    const obj = { greeting: 'hello 안녕하슈'}
    const mb = MBP.MB(title, obj)

    describe('should return', function () {
      it('mb[0] === title', function () {
        assert.equal(mb[0], title)
      })
      it('mb[1] === "O" ', function () {
        assert.equal(mb[1], 'O')
      })
      it('mb[2] === JSON stringified and encoded buffer ', function () {
        assert.ok(MBP.equal(mb[2], new TextEncoder().encode( JSON.stringify( obj ) )  ) )
      })
    })
  })

  describe('for Typed Number => MB( title, type , number ) ', function () {
    const title = 'variableName'
    const type = '32i'
    const num = 255
    const mb = MBP.MB(title, type, num)

    describe('should return', function () {
      it('mb[0] === title', function () {
        assert.equal(mb[0], title)
      })
      it('mb[1] === "32I"  upperCase() ', function () {
        assert.equal(mb[1], '32I')
      })
      it('mb[2] === numberBuffer ', function () {
        assert.ok(MBP.equal(mb[2], Buffer.from('000000ff', 'hex')))
      })
    })
  })


  describe('for Float Typed Number => MB( title, type , number ) ', function () {

    describe('should return', function () {
      const title = "floatBE"
      const number = 3.141592
      let mb = MBP.MB( title , 'f', number )
      it('mb[0] === title', function () {
        assert.equal(mb[0], title);
      });
      it('mb[1] === "F"  upperCase() ', function () {
        assert.equal(mb[1], 'F');
      });
      it('mb[2] === buffer BE ', function () {
        assert.ok(MBP.equal(mb[2], Buffer.from([0x40,0x49,0x0f,0xd8 ]) ));
      });
    });

    describe('should return', function () {
      const title = "floatLE"
      const number = 3.141592
      let mb = MBP.MB( title , 'fl', number )

      it('mb[0] === title', function () {
        assert.equal(mb[0], title);
      });
      it('mb[1] === "FL"  upperCase() ', function () {
        assert.equal(mb[1], 'FL');
      });
      it('mb[2] === buffer LE ', function () {
        assert.ok(MBP.equal(mb[2], Buffer.from([0xd8,0x0f,0x49,0x40])));
      });

    });

  });

  
  describe('for size and initvalue => MB( title, size , initvalue ) ', function () {
    const title = 'variableName'
    const size = 4
    const num = 255
    const mb = MBP.MB(title, size, num)

    describe('should return', function () {
      it('mb[0] === title', function () {
        assert.equal(mb[0], title)
      })
      it('mb[1] === "B"', function () {
        assert.equal(mb[1], 'B')
      })

      it('mb[2].byteLenght === size ', function () {
        assert.equal(mb[2].byteLength, size)
      })

      it('mb[2] === bufferWithInitValue ', function () {
        assert.ok(MBP.equal(mb[2], Buffer.from('ffffffff', 'hex')))
      })
    })
  })

  describe('for size and initvalue => MB( title, size , initvalue 0 ) ', function () {
    const title = 'variableName'
    const size = 32
    const num = 0
    const mb = MBP.MB(title, size, num)

    describe('should return', function () {
      it('mb[0] === title', function () {
        assert.equal(mb[0], title)
      })
      it('mb[1] === "B"', function () {
        assert.equal(mb[1], 'B')
      })

      it('mb[2].byteLength === size ', function () {
        assert.equal(mb[2].byteLength, size)
      })

      it('mb[2] === bufferWithInitValue ', function () {
        const bufferFilled = Buffer.alloc( size )
        bufferFilled.fill(num )
        // console.log('filled', bufferFilled.toString('hex'))
        // console.log('mb[2]', mb[2].toString('hex'))
        assert.ok( MBP.equal(mb[2],  bufferFilled )  )
      })
    })
  })

  describe('for Number without initvalue => MB( title, number ) ', function () {
    const title = 'variableName'
    const num = 255
    const mb = MBP.MB(title, num)

    describe('should return', function () {
      it('mb[0] === title', function () {
        assert.equal(mb[0], title)
      })
      it('mb[1] === "N"', function () {
        assert.equal(mb[1], 'N')
      })

      it('mb[2].byteLength === numberStringEncoded.byteLength ', function () {
        const numberStringEncoded = new TextEncoder().encode(num)
        assert.equal(mb[2].byteLength, numberStringEncoded.byteLength)
      })

      it('mb[2] === numberStringEncoded ', function () {
        const numberStringEncoded = new TextEncoder().encode(num)
        assert.ok(MBP.equal(mb[2], numberStringEncoded))
      })
    })
  })
})
