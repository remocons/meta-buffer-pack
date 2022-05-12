import { Buffer } from 'buffer/index.js'
export { Buffer } // for iife reference MBP.Buffer
const encoder = new TextEncoder()
const decoder = new TextDecoder()


export const NB = numberBuffer
export function numberBuffer(type, initValue = 0) {
  let buffer
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
  } else if (type.includes('F')) {
    buffer = Buffer.alloc(4)
    if (type.includes('L')) {
      buffer.writeFloatLE(initValue)
    } else {
      buffer.writeFloatBE(initValue)
    }
  } else if (type.includes('N')) { // number as string
    buffer = Buffer.from(String(initValue))
  } else {
    console.log(`invalid type: ${type} or initvalue: ${initValue}`)
  }
  return buffer
}


export const MB = metaBuffer
export function metaBuffer(name, typeOrData, initValue) {
  let buffer
  let bufferType = 'B'
  if (typeof typeOrData === 'number') {
    if (initValue) {
      buffer = Buffer.alloc(typeOrData)
      buffer.fill(initValue)
      bufferType = 'B'
    } else {
      buffer = Buffer.from(String(typeOrData))
      bufferType = 'N'
    }
  } else if (typeof typeOrData === 'string' && typeof initValue === 'number') { // number with type.
    bufferType = typeOrData.toUpperCase() // use explicit type name
    buffer = numberBuffer(typeOrData, initValue) // notice.  two categories.  n: number string.  8, 16, 32: typed number.
  } else if (typeof typeOrData === 'string' && initValue === undefined) { //  string buffer
    buffer = Buffer.from(typeOrData)
    bufferType = 'S'
  } else if (typeOrData instanceof Uint8Array && initValue === undefined) { // buffer | Uint8Array
    // Buffer.from:  Copies the passed buffer data onto a new Buffer instance.
    // typecasting Uint8Array to Buffer.
    buffer = (typeOrData instanceof Buffer) ? typeOrData : Buffer.from(typeOrData)
  } else if (typeOrData instanceof ArrayBuffer && initValue === undefined) { // arrayBuffer
    // Notice. typedArray is recommended instead of arrayBuffer
    buffer = Buffer.from(typeOrData)
  } else if (ArrayBuffer.isView(typeOrData)) { // typedarray buffer
    buffer = Buffer.from(typeOrData.buffer, typeOrData.byteOffset, typeOrData.byteLength)
  } else if (typeof typeOrData === 'object' && initValue === undefined) { //   object. like array. stringify
    buffer = Buffer.from(JSON.stringify(typeOrData))
    bufferType = 'O'
  } else if (typeof typeOrData === 'boolean' && initValue === undefined) { //   object. like array. stringify
    const v = typeOrData ? 1 : 0
    buffer = Buffer.from([v])
    bufferType = '!'
  } else {
    throw TypeError('invalid meta buffer type')
  }

  if (typeof name === 'string' && name.includes('#')) name = '' //

  return [name, bufferType, buffer]
}

export const MBA = metaBufferArguments
export function metaBufferArguments(...args) {
  let i = 0
  const mba = args.map(
    data => {
      const argsIndex = i++
      // tip. MBA use index number as metabuffer's property name.
      if (typeof data === 'number') {
        // * JS's primitive Number stored as string.
        return MB(argsIndex, 'N', data)
      } else {
        // typedarray, dataview, array, object, boolean
        return MB(argsIndex, data)
      }
    })

  // add parameter length. limit 255.
  mba.push(MB('$', '8', mba.length))
  return mba
}

export function parseTypeName(type) {
  type = type.toUpperCase()

  if (type.includes('8')) {
    if (type.includes('I')) {
      return 'int8'
    } else {
      return 'uint8'
    }
  } else if (type.includes('16')) {
    if (type.includes('I')) {
      if (type.includes('L')) {
        return 'int16_le'
      } else {
        return 'int16_be'
      }
    } else {
      if (type.includes('L')) {
        return 'uint16_le'
      } else {
        return 'uint16_be'
      }
    }
  } else if (type.includes('32')) {
    if (type.includes('I')) {
      if (type.includes('L')) {
        return 'int32_le'
      } else {
        return 'int32_be'
      }
    } else {
      if (type.includes('L')) {
        return 'uint32_le'
      } else {
        return 'uint32_be'
      }
    }
  } else if (type.includes('F')) {
    if (type.includes('L')) {
      return 'float_le'
    } else {
      return 'float_be'
    }
  } else if (type === 'B') {
    return 'buffer'
  } else if (type === 'S') { // string or arguments
    return 'string'
  } else if (type === 'N') { // number encoded as string
    return 'number'
  } else if (type === 'O') { // object encoded string
    return 'object'
  } else if (type === '!') { // boolean  1:true 0:false
    return 'boolean'
  } else {
    throw TypeError('invalid data type')
  }

}

export function readTypedBuffer(simpleType, buffer, offset, length) {

  const type = parseTypeName(simpleType)

  if (type == 'int8') return buffer.readInt8(offset)
  else if (type === 'uint8') return buffer.readUint8(offset)
  else if (type === 'int16_le') return buffer.readInt16LE(offset)
  else if (type === 'int16_be') return buffer.readInt16BE(offset)
  else if (type === 'uint16_le') return buffer.readUint16LE(offset)
  else if (type === 'uint16_be') return buffer.readUint16BE(offset)
  else if (type === 'int32_le') return buffer.readInt32LE(offset)
  else if (type === 'int32_be') return buffer.readInt32BE(offset)
  else if (type === 'uint32_le') return buffer.readUint32LE(offset)
  else if (type === 'uint32_be') return buffer.readUint32BE(offset)
  else if (type === 'float_le') return buffer.readFloatLE(offset)
  else if (type === 'float_be') return buffer.readFloatBE(offset)

  else if (type === 'buffer') {
    return buffer.slice(offset, offset + length)
  } else if (type === 'string') {
    const strBuffer = buffer.slice(offset, offset + length)
    return decoder.decode(strBuffer)
  } else if (type === 'number') {
    const strNumber = buffer.slice(offset, offset + length)
    return Number(decoder.decode(strNumber))
  } else if (type === 'object') {
    const objEncoded = buffer.slice(offset, offset + length)
    try {
      return JSON.parse(decoder.decode(objEncoded))
    } catch (error) {
      console.log('err. obj parse')
    }
  } else if (type === 'boolean') {
    const v = buffer.readInt8(offset)
    return v === 1
  } else {
    throw TypeError('invalid data')
  }
}

function flatSubArray(args) {
  let subArr = []
  const mainArr = args.filter(item => {
    if (Array.isArray(item[0])) subArr = subArr.concat(item)
    else return item
  })
  return mainArr.concat(subArr)
}

export function pack(...args) {
  const bufArr = flatSubArray(args)
  let size = 0
  const info = []
  let offset = 0

  bufArr.forEach(bufPack => {
    const [name, type, data] = bufPack
    size += data.byteLength
    if (typeof name === 'number' || name.length > 0) {
      if (type.includes('N') || type.includes('B') || type.includes('S') || type.includes('O')) {
        info.push([name, type, offset, data.byteLength])
      } else {
        info.push([name, type, offset])
      }
    }
    offset = size
  })

  let infoEncoded
  let infoSize

  if (info.length > 0) {
    infoEncoded = encoder.encode(JSON.stringify(info))
    infoSize = infoEncoded.byteLength
    size = size + infoSize + 2
  }

  const buffer = Buffer.alloc(size)
  offset = 0
  bufArr.forEach(bufPack => {
    const buf = bufPack[2]
    buffer.set(buf, offset)
    offset += buf.byteLength
  })

  if (info.length > 0) {
    buffer.set(infoEncoded, offset)
    const infoSizeBuff = NB('16', infoSize)
    buffer.set(infoSizeBuff, offset + infoSize)
    return buffer
  } else {
    return buffer
  }
}


export function getRawBuffer( binPack ) {
  const rawBufferSize = getRawBufferSize( binPack)
  return binPack.subarray(0,rawBufferSize)
}

// Meta buffer pack
// include TAIL(two bytes) size info at the end if it has JSON info.
// if it has not JSON JSON info then TAIL(two bytes) is ommited.
export const TAIL_LEN = 2

export function getRawBufferSize(binPack) {
  if (getInfoSize(binPack) === 0) {
    return binPack.byteLength
  } else {
    return binPack.byteLength - getInfoSize(binPack) - TAIL_LEN
  }

}

/*
  success: return infoObject 
  fail: undefiend 
*/
export function getBufferInfo(binPack) {
  const infoSize = readTAIL(binPack)
  if (infoSize === 0) return
  return parseInfo(binPack, infoSize)
}

// # internal use
function parseInfo(binPack, infoSize) {
  try {
    const buffer = new Uint8Array(binPack.buffer, binPack.byteOffset, binPack.byteLength)
    const infoFrom = buffer.byteLength - infoSize - 2
    const infoEncoded = buffer.subarray(infoFrom, buffer.byteLength - 2)
    const decoded = decoder.decode(infoEncoded)
    const info = JSON.parse(decoded)
    return info
  } catch (error) {
  }
}


function readTAIL(binPack) {
  try {
    const dv = new DataView(binPack.buffer, binPack.byteOffset, binPack.byteLength)
    const infoSize = dv.getUint16(binPack.byteLength - TAIL_LEN)  // last 2 bytes for json-info-length.

    // Tip. some MBP has not jsonInfo. It has only raw Buffer.
    // Or broken MBP buffer will return 0.
    if (infoSize > binPack.byteLength || binPack.byteLength < TAIL_LEN) return 0
    return infoSize

  } catch (error) {
    return 0
  }

}


// accept Uint8Array binPack.
export function getInfoSize(binPack) {
  //1. size check
  const infoSize = readTAIL(binPack)
  if (infoSize === 0) return 0
  //2. try parse JSON 
  const success = parseInfo(binPack, infoSize)
  //3. success: infoObject
  if (success) return infoSize
}


/*
* Add additional buffer item info:  
* 1. item's byteLength. parse from type name.
* 2. add more meaningful type name.    i32L => int32_le 
*/
export function getBufferInfoDetail(binPack) {

  const infoArr = getBufferInfo(binPack)
  if (!infoArr) return
  infoArr.forEach(bufPack => {
    const len = bufPack[3]
    if (len == undefined) { // when typedvalue
      if (bufPack[1].includes('8')) bufPack[3] = 1
      else if (bufPack[1].includes('16')) bufPack[3] = 2
      else if (bufPack[1].includes('32')) bufPack[3] = 4
      else if (bufPack[1].includes('F')) bufPack[3] = 4
      else if (bufPack[1].includes('!')) bufPack[3] = 1
    }
    bufPack[4] = parseTypeName(bufPack[1])
  })
  return infoArr
}

// return object when success.
// return undefined when fail.
export function unpack(binPack) {

  const infoArr = getBufferInfo(binPack)
  if (!infoArr) return

  const buffer = Buffer.from(binPack)
  const binObj = {}
  infoArr.forEach(bufPack => {
    const [name, type, offset, length] = bufPack
    binObj[name] = readTypedBuffer(type, buffer, offset, length)
  })

  // set args with values
  if (binObj.$) {
    const argLen = binObj.$
    const args = []
    for (let n = 0; n < argLen; n++) {
      args.push(binObj[n])
    }
    binObj.args = args
    binObj.$ = binObj.args // alias
  }
  return binObj

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
export const U8 = parseUint8Array
export function parseUint8Array(data, shareArrayBuffer = false) {
  if (data === undefined) throw TypeError('Invalid data type: Undefined')
  if (typeof data === 'string') {
    return encoder.encode(data)
  } else if (typeof data === 'number') { // number -> 1 byte uint8array(number)
    return Uint8Array.from([data])
  } else if (data instanceof ArrayBuffer) { // arraybuffer -> wrap uint8array(ab)
    if (shareArrayBuffer) {
      return new Uint8Array(data)
    } else {
      const originData = new Uint8Array(data)
      const dataCopy = new Uint8Array(data.byteLength)
      dataCopy.set(originData)
      return dataCopy
    }
  } else if (ArrayBuffer.isView(data)) { // accept Buffer too.
    if (shareArrayBuffer) {
      return new Uint8Array(data.buffer, data.byteOffset, data.byteLength) // DataView, TypedArray >  uint8array( use offset, length )
    } else {
      // new memory to protect origin arraybuffer.
      const originData = new Uint8Array(data.buffer, data.byteOffset, data.byteLength)
      const dataCopy = new Uint8Array(data.byteLength)
      dataCopy.set(originData)
      return dataCopy
    }
  } else { // array, object
    return encoder.encode(JSON.stringify(data)) // object(array.. )  > JSON.str > encode > unint8array
  }
}

export const B8 = parseBuffer
export function parseBuffer(data, shareArrayBuffer = false) {
  const u8 = parseUint8Array(data, shareArrayBuffer)
  return Buffer.from(u8)
}

export const B8pack = parseBufferThenConcat
export function parseBufferThenConcat(...dataArray) {
  try {
    let bufferSize = 0
    let offset = 0
    const buffers = dataArray.map(data => parseBuffer(data))
    buffers.forEach(buf => { bufferSize += buf.byteLength })
    const buffer = Buffer.alloc(bufferSize)
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
export const U8pack = parseUint8ThenConcat
export function parseUint8ThenConcat(...dataArray) {
  try {
    let bufferSize = 0
    let offset = 0
    const buffers = dataArray.map(data => parseUint8Array(data))
    buffers.forEach(buf => { bufferSize += buf.byteLength })
    const buffer = new Uint8Array(bufferSize)
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
  if (buf1.byteLength !== buf2.byteLength) return false
  for (let i = 0; i < buf1.byteLength; i++) {
    if (buf1[i] !== buf2[i]) return false
  }
  return true
}
