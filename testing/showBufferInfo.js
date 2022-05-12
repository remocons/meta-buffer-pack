import { MBP , Buffer } from '../src/index.js'


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
console.log( 'getRawBuffer', MBP.getRawBuffer(pack1))
console.log( 'getBufferInfo', MBP.getBufferInfo(pack1))
console.log( 'getBufferInfoDetail', MBP.getBufferInfoDetail(pack1))
console.log( 'getRawBufferSize', MBP.getRawBufferSize(pack1))
console.log( 'getBufferInfoSize', MBP.getInfoSize(pack1))
console.log( 'pack.byteLength', pack1.byteLength )

console.log( '\npack2: rawBuffer')
console.log( 'getRawBuffer', MBP.getRawBuffer(pack2))
console.log( 'getBufferInfo', MBP.getBufferInfo(pack2))
console.log( 'getBufferInfoDetail', MBP.getBufferInfoDetail(pack2))
console.log( 'getRawBufferSize', MBP.getRawBufferSize(pack2))
console.log( 'getBufferInfoSize', MBP.getInfoSize(pack2))
console.log( 'pack.byteLength', pack2.byteLength )

// console.log('pack hex:', MBP.hex( rawBufferPack ) )
// console.log('pack byteLength:', rawBufferPack.byteLength )
// console.log('pack rawBufferSize:', MBP.getRawBufferSize(rawBufferPack)  )
// console.log('pack infoSize:', MBP.getInfoSize(rawBufferPack)  )

// const rawBufferItemList = MBP.getBufferInfoDetail( rawBufferPack )

// console.log( rawBufferItemList , "== undefined is correct. raw buffer has no buffer info." )
// // 8, 16,32,f,!