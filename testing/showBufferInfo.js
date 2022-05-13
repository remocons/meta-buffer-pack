import { MBP , Buffer } from '../src/index.js'
import { getFrame, getBuffer, getBufferSize, U8pack ,U8} from '../src/meta-buffer-pack.js'


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
console.log( 'getFrame', MBP.getFrame(pack1))
console.log( 'getFrame detail', MBP.getFrame(pack1, true))
console.log( 'getBufferSize', MBP.getBufferSize(pack1))
console.log( 'getFrameSize', MBP.getFrameSize(pack1))
console.log( 'pack.byteLength', pack1.byteLength )

console.log( '\npack2: rawBuffer')
console.log( 'getBuffer', MBP.getBuffer(pack2))
console.log( 'getFrame', MBP.getFrame(pack2))
console.log( 'getFrame detail', MBP.getFrame(pack2, true))
console.log( 'getBufferSize', MBP.getBufferSize(pack2))
console.log( 'getFrameSize', MBP.getFrameSize(pack2))
console.log( 'pack.byteLength', pack2.byteLength )


const mbo1 = MBP.unpack( pack1 )
console.log( 'mbo1', mbo1 )


const infoPack = MBP.pack(
  MBP.MB('v_u32', '32', 4 ),
  MBP.MB('v_float', 'f', 3.141592 ),
  MBP.MB('v_u16', '16', 2 )
  )

  const infoFrame = MBP.getFrame( infoPack )
  const mbo2 = MBP.unpack( pack1, infoFrame )
  console.log( 'mbo2', mbo2 )

  

 
  
  