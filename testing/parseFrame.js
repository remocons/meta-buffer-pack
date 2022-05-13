import { MBP , Buffer } from '../src/index.js'


const MB = MBP.MB
const pack = MBP.pack 
const B8 = MBP.B8




let jsonStr = '[1111111]'
let jsonBuffer = B8( jsonStr )
console.log('json', jsonBuffer )

let frame = pack( MB('#json', jsonBuffer ) , MB('','16', jsonBuffer.byteLength ) )
console.log('frame', frame)
console.log( MBP.parseFrameInfo(frame )  )