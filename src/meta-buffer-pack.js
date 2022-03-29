import { Buffer } from 'buffer/index.js'

const encoder = new TextEncoder();
const decoder = new TextDecoder();

/*
@params:
-type: It's string keyword that indicate datatype.
  8, 16, 32     default:  read and write as Uint. BigEndian.
  i8, i16,      includes 'I' then read and write as Int.
  16L , i16l    includes 'L  then read and write as LittleEndian.
-value:  number to store the buffer
return: Buffer
*/

export const NB = numberBuffer;
export function numberBuffer(type, initValue = 0) {
    let buffer;
    if (type === undefined || typeof type !== 'string' || typeof initValue !== 'number') {
        throw TypeError('invlaid init variablie type name. ')
    }
    type = type.toUpperCase()

    if (type.includes('8')) {
        buffer = Buffer.alloc(1)
        if (type.includes('I')) buffer.writeInt8(initValue)
        else buffer.writeUint8(initValue)

    } else if (type.includes('16')) {
        buffer = Buffer.alloc(2)
        if (type.includes('I')) {
            if (type.includes('L')) buffer.writeInt16LE(initValue)
            else buffer.writeInt16BE(initValue)
        } else {
            if (type.includes('L')) buffer.writeUint16LE(initValue)
            else buffer.writeUint16BE(initValue)
        }

    } else if (type.includes('32')) {
        buffer = Buffer.alloc(4)
        if (type.includes('I')) {
            if (type.includes('L')) buffer.writeInt32LE(initValue)
            else buffer.writeInt32BE(initValue)
        } else {
            if (type.includes('L')) buffer.writeUint32LE(initValue)
            else buffer.writeUint32BE(initValue)
        }
    } else if (type.includes('N')) {  // number as string
        buffer = Buffer.from(String(initValue))
    } else {
        console.log(`invalid type: ${type} or initvalue: ${initValue}`)
    }
    return buffer

}



/*
@name:  name of the buffer.  
  packer and unpacker use the name.
@type:
  8, 16, 32     default:  read and write as Uint. BigEndian.
  i8, i16,      includes 'I' then read and write as Int.
  16L , i16l    includes 'L  then read and write as LittleEndian.
@data:
  number : new buffer will be initilized with the value.
  buffer without type : use the buffer
  number without type : new buffer alloc with the size

  return  ['name', data:Buffer , 'type']
*/

/* 
 get buffer Object with initial value & meta info( name, data type, endian , length )
 
input:   name, type, initValue 
return:  return ['name',buffer, type ]  

ex. new buffer 4bytes with name.
  MB('bufname', 4)

ex. 
  MB('strBuffer', 'buffer store this text' )

ex.
  MB('uid', '16', 0x12EF )   => name: uid, type: uint16array, bigendian, init value 0x1234.   
  return ['uid', <Buffer 12 EF > , '16' ] 

ex.
  let buf = Buffer.alloc(8)
  MB('bufname', buf )  => name: 'bufname'   8byte buffer. 
  return ['bufname', <Buffer 00 00 00 00 00 00 00 00 > ,'b' ] 

*/

export const MB = metaBuffer
export function metaBuffer(name, typeOrData, initValue) {
    let buffer;
    let bufferType = 'B';
    if (typeof typeOrData === 'number') {  // this number is buffer size. not value.
        buffer = Buffer.alloc(typeOrData)
        if (initValue) buffer.fill(initValue)
        bufferType = 'B'
    } else if (typeof typeOrData === 'string' && typeof initValue === 'number') { // number with type.
        bufferType = typeOrData.toUpperCase()  //use explicit type name
        buffer = numberBuffer(typeOrData, initValue) // notice.  two categories.  n: number string.  8, 16, 32: typed number.  
    } else if (typeof typeOrData === 'string' && initValue === undefined) { //  string
        buffer = encoder.encode(typeOrData)
        bufferType = 'S';
    } else if (typeOrData instanceof Uint8Array && initValue === undefined) {  // buffer 
        buffer = typeOrData
    } else if (typeOrData.constructor.name === 'ArrayBuffer' && initValue === undefined) {
        buffer = new Uint8Array(typeOrData)
    } else if (ArrayBuffer.isView(typeOrData)) {
        buffer = new Uint8Array(typeOrData.buffer, typeOrData.byteOffset, typeOrData.byteLength)
    } else if (typeof typeOrData === 'object' && initValue === undefined) {  //   object. like array. stringify
        buffer = encoder.encode(JSON.stringify(typeOrData))
        bufferType = 'O'
    } else if (typeof typeOrData === 'boolean' && initValue === undefined) {  //   object. like array. stringify
        let v = typeOrData ? 1 : 0;
        buffer = Buffer.from([v])
        bufferType = '!'
    } else {
        prn('invalid metabuffer data err', name, typeOrData, initValue)
    }

    if (typeof name === 'string' && name.includes('#')) name = ''  // 

    return [name, bufferType, buffer]

}


export const MBA = metaBufferArguments
export function metaBufferArguments(...args) {
    let i = 0;
    let mba = args.map(
        data => {
            let argsIndex = i++;  // index number becom metabuffer's name.
            if (typeof data === 'number') {
                // * JS's primitive Number stored as string. 
                return MB(argsIndex, 'N', data)
            } else {
                // typedarray, dataview, array, object, boolean
                return MB(argsIndex, data)
            }
        })

    // add parameter length. 
    mba.push(MB('$', '8', mba.length))
    return mba
}



export function readTypedBuffer(type, buffer, offset, length) {
    // prn('RTB type',type)
    if (type.includes('8')) {
        if (type.includes('I')) {
            return buffer.readInt8(offset)
        } else {
            return buffer.readUint8(offset)
        }
    } else if (type.includes('16')) {
        if (type.includes('I')) {
            if (type.includes('L')) {
                return buffer.readInt16LE(offset)
            } else {
                return buffer.readInt16BE(offset)
            }
        } else {
            if (type.includes('L')) {
                return buffer.readUint16LE(offset)
            } else {
                return buffer.readUint16BE(offset)
            }
        }

    } else if (type.includes('32')) {
        if (type.includes('I')) {
            if (type.includes('L')) {
                return buffer.readInt32LE(offset)
            } else {
                return buffer.readInt32BE(offset)
            }
        } else {
            if (type.includes('L')) {
                return buffer.readUint32LE(offset)
            } else {
                return buffer.readUint32BE(offset)
            }
        }

    } else if (type === 'B') { //buffer
        return buffer.slice(offset, offset + length)
    } else if (type === 'S') { //string or arguments
        let strBuffer = buffer.slice(offset, offset + length)
        return decoder.decode(strBuffer)
    } else if (type === 'N') { // number encoded as string
        let strNumber = buffer.slice(offset, offset + length)
        return Number(decoder.decode(strNumber))
    } else if (type === 'O') { // object encoded string
        let objEncoded = buffer.slice(offset, offset + length)
        try {
            return JSON.parse(decoder.decode(objEncoded))
        } catch (error) {
            console.log('err. obj parse')
        }
    } else if (type === '!') { // boolean  1:true 0:false
        let v = buffer.readInt8(offset)
        return v === 1 ? true : false
    } else {
        throw TypeError('invalid data')

    }
}

function flatSubArray(args) {
    // prn('args',args)
    let subArr = []
    let mainArr = args.filter(item => {
        if (Array.isArray(item[0])) subArr = subArr.concat(item)
        else return item
    })
    return mainArr.concat(subArr)
}

export function pack(...args) {
    let bufArr = flatSubArray(args)
    let size = 0;
    let info = []
    let offset = 0

    bufArr.forEach(bufPack => {
        let [name, type, data] = bufPack
        size += data.byteLength
        if (typeof name === 'number' || name.length > 0) {
            if (type.includes('N') || type.includes('B') || type.includes('S') || type.includes('O')) {
                info.push([name, type, offset, data.byteLength])
            } else {
                info.push([name, type, offset])
            }
        }
        offset = size;
    })

    let infoEncoded = encoder.encode(JSON.stringify(info))
    let infoSize = infoEncoded.byteLength
    size = size + infoSize + 2

    let buffer = Buffer.alloc(size)
    offset = 0
    bufArr.forEach(bufPack => {
        let buf = bufPack[2]
        buffer.set(buf, offset)
        offset += buf.byteLength
    })

    buffer.set(infoEncoded, offset)
    let infoSizeBuff = NB('16', infoSize)
    buffer.set(infoSizeBuff, offset + infoSize)
    return buffer
}

export function unpack(binPack) {
    let buffer = Buffer.from(binPack)
    let infoSize = buffer.readUInt16BE(buffer.byteLength - 2)
    let infoFrom = buffer.byteLength - infoSize - 2;
    let infoEncoded = buffer.subarray(infoFrom, buffer.byteLength - 2)
    try {
        let decoded = decoder.decode(infoEncoded)
        let infoArr = JSON.parse(decoded)
        let binObj = {}
        infoArr.forEach(bufPack => {
            let [name, type, offset, length] = bufPack
            binObj[name] = readTypedBuffer(type, buffer, offset, length)
        })

        // set args with values
        if (binObj.$) {
            let argLen = binObj.$;
            let args = []
            for (let n = 0; n < argLen; n++) {
                args.push(binObj[n])
            }
            binObj.args = args
            binObj.$ = binObj.args  // same  .args or .$
        }
        // prn('binObj',binObj)
        return binObj
    } catch (error) {
        console.log('unpack: invalid data.', error)
    }

}




/* simple parser and packer */
// input: any
// return uint8Array.  
// *point*  if input number -> output is 1 byte Uint8Array that initialized by the input number.
export const U8 = parseUint8Array;
export function parseUint8Array(data) {

    if (data == undefined) throw 'Invalid data type: Undefined'
    if (typeof data === 'string') { // string > encode > uint8array
        return encoder.encode(data)
    } else if (typeof data === 'number') {  // number > 1 byte uint8array(number)
        return Uint8Array.from([data])
    } else if (data.constructor.name === 'ArrayBuffer') {  // arraybuffer > wrap uint8arra(ab)
        return new Uint8Array(data)
    } else if (ArrayBuffer.isView(data)) {
        if (data.constructor.name === 'Uint8Array') {  // uint8array > return same
            return data
        } else {
            return new Uint8Array(data.buffer, data.byteOffset, data.byteLength)  // DataView, TypedArray >  uint8array( use offset, length )
        }
    } else { // array, object 
        return encoder.encode(JSON.stringify(data))  // object(array.. )  > JSON.str > encode > unint8array
    }
}

// in:  arraybuffer,typedArray,DataView,number
// return: unint8array
// 1. normalize: any into Uint8array 
// 2. return new buffer merged.
export const U8pack = parseUint8ThenConcat;
export function parseUint8ThenConcat(...dataArray) {
    try {
        let bufferSize = 0
        let offset = 0;
        let buffers = dataArray.map(data => parseUint8Array(data))
        buffers.forEach(buf => { bufferSize += buf.byteLength })
        let buffer = new Uint8Array(bufferSize)
        buffers.forEach(buf => {
            buffer.set(buf, offset)
            offset += buf.byteLength
        })
        return buffer
    } catch (error) {
        console.log(error)
    }
}


export function hex(buffer) {
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('')
} // arraybuffer를 hex문자열로


function prn(...data) {
    console.log(...data)
}

