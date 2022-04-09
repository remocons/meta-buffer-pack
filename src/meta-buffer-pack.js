import { Buffer } from 'buffer/index.js'
export { Buffer }  //for iife reference MBP.Buffer
const encoder = new TextEncoder(); 
const decoder = new TextDecoder();

/* NB( type:String , number:Number) : Buffer
@params: 
-type: It's string keyword that indicate datatype.
  8, 16, 32 : use number for typedNumber bit size 

  default:  read and write as Unsigned BigEndian.
  include i or I for Signed number.
  include l or L for LittleEndian.

  examples
  32  : 32bits unsigend number (uint32)
  i16 : 16bits signed number (int16)     
  16L : 16bits unsigend number little endian. 

-value:  number to store

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
@name: title name( always string)

@typeOfData:  
-type string for TypedNumber
-string for textbuffer (without initValue)
-number for buffer size with initValue

@initValue:
-number for buffer with initValue
-empty for buffer and string data.

@return  Meta Buffer:  ['name', 'type', <buffer>:Buffer] : Array 

// use case
// typed number
MB('numberTitle','16i',-30000) 

// string buffer
MB('greeting', 'hello world' )


// buffer , arraybuffer or TypedArray
MB('bufferTitle', buffer )

// new buffer with init value(0~255)  and byteSize.
// MB( 'title', byteSize, initvalue )  
MB( 'buf32', 32, 0xff )  

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
    } else if (typeof typeOrData === 'string' && initValue === undefined) { //  string buffer
        buffer = Buffer.from(typeOrData)
        bufferType = 'S';
    } else if (typeOrData instanceof Uint8Array && initValue === undefined) {  // buffer | Uint8Array 
        // Buffer.from:  Copies the passed buffer data onto a new Buffer instance.
        // typecasting Uint8Array to Buffer.
        buffer = ( typeOrData instanceof Buffer ) ? typeOrData : Buffer.from( typeOrData )
    } else if (typeOrData instanceof ArrayBuffer && initValue === undefined) { // arrayBuffer
        // Notice. 
        // 1. using typedarray is recomended. arraybuffer should check byteOffset & byteLength
        // 2. Buffer will share the same allocated memory 
        buffer = Buffer.from(typeOrData)
    } else if (ArrayBuffer.isView(typeOrData)) {    // typedarray buffer
        buffer = Buffer.from(typeOrData.buffer, typeOrData.byteOffset, typeOrData.byteLength)
    } else if (typeof typeOrData === 'object' && initValue === undefined) {  //   object. like array. stringify
        buffer = Buffer.from(JSON.stringify(typeOrData))
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
            let argsIndex = i++;  // index number become metabuffer's name.
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


// return object when success.
// return undefined when fail.
export function unpack(binPack) {
    let buffer = Buffer.from(binPack)
    let infoSize = buffer.readUInt16BE(buffer.byteLength - 2)
    let infoFrom = buffer.byteLength - infoSize - 2;
    let infoEncoded = buffer.subarray(infoFrom, buffer.byteLength - 2)
    
    let decoded = decoder.decode(infoEncoded)
    try {
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
        return binObj  // Object {}
            
    } catch (error) {
        
    }

    

}





/*
@input: any
@shareArrayBuffer option:    false(default):  return new( or copied) ArrayBuffer.    true: share the input data's arrayBuffer. 
@return uint8Array.  

// use case
U8('str')     // string
U8( number )  // number is initvalue range 0~255.  return one byte. 
U8( buffer )  // buffer, typedArray or arrayBuffer 
U8( object )  // array ,object 

*/
export const U8 = parseUint8Array;
export function parseUint8Array(data , shareArrayBuffer = false) {  

    if (data == undefined) throw 'Invalid data type: Undefined'
    if (typeof data === 'string') { // string > encode > uint8array
        return encoder.encode(data)
    } else if (typeof data === 'number') {  // number > 1 byte uint8array(number)
        return Uint8Array.from([data])
    } else if (data instanceof ArrayBuffer) {  // arraybuffer > wrap uint8array(ab)
        if(shareArrayBuffer){
            return new Uint8Array(data)
        } 
        else {
            let originData = new Uint8Array(data) 
            let dataCopy = new Uint8Array( data.byteLength )
            dataCopy.set( originData )
            return dataCopy
        }
    } else if (ArrayBuffer.isView(data)) {   // accept Buffer too.
        if( shareArrayBuffer){
            return new Uint8Array(data.buffer, data.byteOffset, data.byteLength)  // DataView, TypedArray >  uint8array( use offset, length )
        }else{
            // new memory to protect origin arraybuffer.
            let originData = new Uint8Array(data.buffer, data.byteOffset, data.byteLength) 
            let dataCopy = new Uint8Array( data.byteLength)
            dataCopy.set( originData  ) 
            return dataCopy
        }
    } else { // array, object 
        return encoder.encode(JSON.stringify(data))  // object(array.. )  > JSON.str > encode > unint8array
    }
}

export const B8 = parseBuffer
export function parseBuffer( data, shareArrayBuffer = false ){
    const u8 = parseUint8Array( data, shareArrayBuffer)
    return Buffer.from( u8 )
}

export const B8pack = parseBufferThenConcat;
export function parseBufferThenConcat( ...dataArray ){
    try {
        let bufferSize = 0
        let offset = 0;
        let buffers = dataArray.map(data => parseBuffer(data))
        buffers.forEach(buf => { bufferSize += buf.byteLength })
        let buffer = Buffer.alloc(bufferSize)
        buffers.forEach(buf => { 
            buffer.set(buf, offset)
            offset += buf.byteLength
        })
        return buffer
    } catch (error) {
        console.log(error)
    }
}


// 1. normalize: Uint8array list 
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
} 


export function equal(buf1, buf2) {
    if (buf1.byteLength != buf2.byteLength) return false
    for (let i = 0; i < buf1.byteLength; i++) {
        if (buf1[i] != buf2[i]) return false
    }

    return true
}

function prn(...data) {
    console.log(...data)
}

