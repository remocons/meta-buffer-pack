import { MBP, Buffer } from 'meta-buffer-pack'
//const { MBP, Buffer } = require('meta-buffer-pack')   // CJS 

function prn(...data) {
  console.log(...data)
}
function prnObj( v) {
  v = JSON.stringify(v , null, 2)
  console.log(v)
}


// alias
const NB = MBP.numberBuffer;   //  (MBP.numberBuffer == MBP.NB)
const MB = MBP.metaBuffer;
const MBA = MBP.metaBufferArguments;
const U8 = MBP.parseUint8Array;
const U8pack = MBP.parseUint8ThenConcat;


function test() {

  //init numbers with types.
  prn(MB('uint8', '8', 1))
  prn(MB('uint16BE', '16', 0x0102))
  prn(MB('uint16LE', '16L', 0x0102))
  prn(MB('Int16BE +10', 'i16', 10))
  prn(MB('Int16BE -10', 'i16', -10))
  prn(MB('Int16LE +10', 'i16L', 10))
  prn(MB('Int16LE -10', 'i16L', -10))
  prn(MB('uint32be', '32', 0x0102))
  prn(MB('uint32le', '32l', 0x0102))

  // new buffers with size
  prn(MB('raw bytes', 8))

  // buffer reference
  let buf = Buffer.alloc(8)
  prn(MB('mid', buf))

  // buffer or typed array. 
  buf = new Uint8Array(8)
  prn(MB('mid', buf))

  // buffer with string
  prn(MB('greeting', 'hi bye'))


  // get Buffer with numbers
  prn(NB('8', 32))
  prn(NB('16', 32767))
  prn(NB('I16', -100))
  prn(NB('32', 32767))
  prn(NB('16L', 32767))
  prn(NB('32L', 32767))


  let counter = 1234;
  let binpack = MBP.pack(
    MB('cmd', '8', 0xff),
    MB('type', '8', 1),
    MB('chPath', 'channelInfo'),
    MB('msg', 'hihi'),
    MB('cnt', '16', counter),
    MB('hash', Buffer.from([244, 44, 33, 65, 255, 3, 77, 88])),
    MB('args', 'msg,cnt,hash')
  )
  prn(binpack)
  let binObj = MBP.unpack(binpack)
  prn(binObj)

}

// MBA: help packaging function parameters. 
function test3() {
  let mb = MBP.MBA('hi', 2332, 22.2, [1, 2, 3], { 'hi': 'yeh' }, true)
  prn(mb)
}


// MBA  pack, unpack
function test4() {
  let binpack = MBP.pack(
    MBA('hi', 2332, 22.2, [1, 2, 3], { 'hi': 'yeh' }, true), // spread args array
  )
  prn(binpack)
  let binObj = MBP.unpack(binpack)
  prn(binObj)
  prn('args', binObj.args)
  prn('$', binObj.$) //  $ is alias of args prop.
}



// how to pack meta-buffer.  how to use name tag & object.
function test5() {

  let counter = 1234;
  let binpack = MBP.pack(
    MB('cmd', '8', 0xff),   // uint8
    MB('chInfo', 'channelInfo'),  // string
    MB('counter', 'i16', -34),  // uint32 number
    MB('#count', '16', counter),  // uint32 number. no name.
    MB('buff', Buffer.from([1, 2, 3, 4])),  // buffer 
    MBA('args.first string', 2, 3.4, true, ['array', 1, 2], { 'objKey': 'objValue' })
  )
  prn('pack size', binpack.length)
  let binObj = MBP.unpack(binpack)
  prn('named counter', binObj.counter)
  prn('named #count', binObj.count)  //undefind.

}

test()
test3()
test4()
test5()


function testU8pack(){
  let pack = U8pack(
    U8(1),
    U8('hi')
  )

  prn(pack)
}
testU8pack();




function packFunctionParams( ...args){
  return MBP.pack(  MBP.MBA(...args) )
}

let mbaPack = packFunctionParams( 'hi', 2332, 22.2, [1, 2, 3], { 'hi': 'yeh' }, true )

prn( mbaPack.byteLength )
prn( mbaPack )
let mbaObj = MBP.unpack( mbaPack )

prn(mbaObj.args )  // or mbaObj.$ 

prn(mbaObj.args[0])
prn(mbaObj.$[1])
prn(mbaObj.args[2])
prn(mbaObj.args[3])
prn(mbaObj.args[4])
prn(mbaObj.args[5])