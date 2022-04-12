import { MBP , Buffer } from '../src/index.js'

const pack = MBP.pack(
    MBP.MB('#noInfoBuffer',Buffer.alloc(10))
)

console.log( pack , pack.byteLength )