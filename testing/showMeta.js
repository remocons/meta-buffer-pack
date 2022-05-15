import { MBP , Buffer } from '../src/index.js'
// import { MBP , Buffer } from 'meta-buffer-pack'


const pack1 = MBP.pack(
    MBP.MB('v_u32', '32', 0x11223344 ),
    MBP.MB('v_float', 'f', 3.141592 ),
    MBP.MB('v_u16', '16', 0x1122 ),
    MBP.MB('v_u16LittleEndian', '16L', 0x1122 ),
    MBP.MB('v_u8', '8', 0x11 ),
    MBP.MB('v_bool', true ),
    MBP.MB('v2', Buffer.from([1,2,3]) ),
    MBP.MB('v_num', 12345.67 )
)



const pack2 = MBP.pack(
    MBP.MB('#v_u32', '32', 0x11223344 ),
    MBP.MB('#v_u16', '16', 0x1122 ),
    MBP.MB('#v_u8', '8', 0x11 )
    // , MBP.MBA('a',2,3.4,[1,2,3])
)


console.log( '\npack1: buffer with meta info')
console.log( 'getBuffer', MBP.getBuffer(pack1))
console.log( 'getMeta', MBP.getMeta(pack1))
console.log( 'getMeta detail', MBP.getMeta(pack1, true))
console.log( 'getBufferSize', MBP.getBufferSize(pack1))
console.log( 'getMetaSize', MBP.getMetaSize(pack1))
console.log( 'pack.byteLength', pack1.byteLength )

console.log( '\npack2: rawBuffer')
console.log( 'getBuffer', MBP.getBuffer(pack2))
console.log( 'getMeta', MBP.getMeta(pack2))
console.log( 'getMeta detail', MBP.getMeta(pack2, true))
console.log( 'getBufferSize', MBP.getBufferSize(pack2))
console.log( 'getMetaSize', MBP.getMetaSize(pack2))
console.log( 'pack.byteLength', pack2.byteLength )


const mbo1 = MBP.unpack( pack1 )
console.log( 'mbo1', mbo1 )


const infoPack = MBP.pack(
  MBP.MB('v_u32', '32', 4 ),
  MBP.MB('v name with space', '32', 4 ),
  MBP.MB('v_float', 'f', 3.141592 ),
  MBP.MB('v_u16', '16', 2 )
  )

  const infoMeta = MBP.getMeta( infoPack )
  const mbo2 = MBP.unpack( pack1, infoMeta )
  console.log( 'mbo2', mbo2 )


  const metaDetail = MBP.getMetaDetail( infoPack )
  console.log( 'metaDetail', metaDetail )
  console.log( 'size', metaDetail[0][3] )
  console.log( 'full-type-name', metaDetail[0][4] )
  console.log( 'bytes', Uint32Array.BYTES_PER_ELEMENT )


  const meta1 = MBP.meta( 
    MBP.MB('v_u32', '32', 4 ),
    MBP.MB('v name with space', '32', 4 ),
    MBP.MB('v_float', 'f', 3.141592 ),
    MBP.MB('v_u16', '16', 2 )
  )
  const meta2 = MBP.metaDetail( 
    MBP.MB('v_u32', '32', 4 ),
    MBP.MB('v name with space', '32', 4 ),
    MBP.MB('v_float', 'f', 3.141592 ),
    MBP.MB('v_u16', '16', 2 )
  )

console.log( 'defined Meta1', meta1 )
console.log( 'defined Meta2', meta2 )

console.log( 'unpack using meta1', MBP.unpack(pack1, meta1))
console.log( 'unpack using meta2', MBP.unpack(pack1, meta2))
  

 
  
  