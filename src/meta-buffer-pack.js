import { Buffer } from 'buffer/index.js'
export { Buffer } 

const encoder = new TextEncoder()
const decoder = new TextDecoder()


export const NB = numberBuffer
/**
 * Create a typed buffer with a specific type and initial value
 * @param {string} type - Buffer type (8, 16, 32, F, N)
 * @param {number} [initValue=0] - Initial value for the buffer
 * @returns {Buffer} Typed buffer
 * @throws {TypeError} If invalid type or initValue is provided
 */
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
/**
 * Create a meta buffer with name, type, and initial value
 * @param {string} name - Name of the buffer
 * @param {number|string|Uint8Array|ArrayBuffer|Object|boolean} typeOrData - Data type or value
 * @param {number|string|undefined} [initValue] - Initial value for numeric types
 * @returns {[string, string, Buffer]} metaBufferTuple containing name, buffer type, and buffer
 * @throws {TypeError} If invalid meta buffer type is provided
 */
export function metaBuffer(name, typeOrData, initValue) {
  let buffer
  let bufferType = 'B'
  if (typeof typeOrData === 'number') {
    if (typeof initValue === 'number') {  // initValue 0 should be passed.
      buffer = Buffer.alloc(typeOrData)
      if (initValue !== 0) buffer.fill(initValue)
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
/**
 * Create meta buffers from arguments
 * @param {...any} args - Arguments to create meta buffers
 * @returns {Array<[string, string, Buffer]>} Array of meta buffer tuples
 */
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
  try {
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
      return buffer.subarray(offset, offset + length)
    } else if (type === 'string') {
      const strBuffer = buffer.subarray(offset, offset + length)
      return decoder.decode(strBuffer)
    } else if (type === 'number') {
      const strNumber = buffer.subarray(offset, offset + length)
      return Number(decoder.decode(strNumber))
    } else if (type === 'object') {
      const objEncoded = buffer.subarray(offset, offset + length)
      return JSON.parse(decoder.decode(objEncoded))
    } else if (type === 'boolean') {
      const v = buffer.readInt8(offset)
      return v === 1
    } else {
      return
    }
  } catch (error) {
    // console.log('MBP:readTypedBuffer obj decoding error.', error)
  }
  // any error and invalid data return undefined 
  return
}

// to join MBA or MB meta list.
function flatArray(args) {
  let subArr = []
  const mainArr = args.filter(item => {
    if (Array.isArray(item[0])) subArr = subArr.concat(item)
    else return item
  })
  return mainArr.concat(subArr)
}

/**
 * Pack data with metadata
 * @param {...any} args - Data to pack
 * @returns {Buffer} Packed buffer with metadata
 */
export function pack(...args) {
  const bufArr = flatArray(args)
  // console.log('MBP.pack: flat MB or MBA list', bufArr)
  let size = 0
  const info = []
  let offset = 0

  bufArr.forEach(bufPack => {
    const [name, type, data] = bufPack
    size += data.byteLength

    if (typeof name === 'number' || name.length > 0) {
      // if the item has property name then add meta JSON info.
      // type of name is Number in MBA.(index number)
      // type of name is String in MB. except null string.
      // add additional informative meta info.  
      info.push([name, type, offset, data.byteLength])
    }
    offset = size
  })


  // console.log('MBP.pack meta:', info )
  let infoEncoded
  let infoSize

  if (info.length > 0) {
    let infoStr = JSON.stringify(info)
    // console.log('pack infoStr , size:', infoStr , infoStr.length )
    infoEncoded = encoder.encode(infoStr)
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


/**
 * unpack() will use embeded meta info from the binary pack.  
 * You can specify (optional) meta obejct. 
 * (It's useful to read pure buffer data.)
 * 
 * You can get the meta object from:  getFrame(pack) , meta()
 * @param {Buffer|Uint8Array} binPack binaryData
 * @param {Object} meta *OPTION*  
 * @returns {Object|undefined} success: return Object (include buffer data).   fail: return undefined
 */
/**
 * Unpack data from buffer using metadata
 * @param {Buffer|Uint8Array} binPack - Binary data to unpack
 * @param {Object} [meta] - Optional metadata object
 * @returns {Object|undefined} Unpacked data or undefined if failed
 */
export function unpack(binPack, meta) {

  const infoArr = meta || getMeta(binPack)
  if (!infoArr) return

  const buffer = Buffer.from(binPack)
  const binObj = {}
  let readCounter = 0
  infoArr.forEach(bufPack => {
    const [name, type, offset, length] = bufPack
    let result = readTypedBuffer(type, buffer, offset, length)
    if (result == undefined) return
    binObj[name] = result
    if (length) readCounter += length
  })

  // Can not define meta for variable size buffer 
  // unpacker support automatic property to read left(did't read) buffers.
  // console.log("######, unpack: buffer " , readCounter, buffer ,buffer.byteLength)
  if (meta && buffer.byteLength !== readCounter) {
    let leftSize = buffer.byteLength - readCounter
    // console.log('total,left buffer size', buffer.byteLength, leftSize )
    let result = readTypedBuffer('b', buffer, readCounter, leftSize)
    if (result == undefined) return
    binObj["$OTHERS"] = result
  }

  // set args with values if exist.
  let mbaIndex = 0;
  let args = [];
  while (binObj[mbaIndex]) {
    args.push(binObj[mbaIndex++])
  }

  if (args.length > 0) {
    binObj.args = args
    binObj.$ = binObj.args
  }
  return binObj
}


export const U8 = parseUint8Array   //alias
/**
 * 
 * @param {any} data 
 * @param {Boolean} shareArrayBuffer false(default):  return new( or copied) ArrayBuffer.    true: share the input data's arrayBuffer.
 * @returns {Uint8Array}
 */
/**
 * Parse data into Uint8Array
 * @param {any} data - Data to parse
 * @param {boolean} [shareArrayBuffer=false] - Whether to share the input data's array buffer
 * @returns {Uint8Array} Parsed Uint8Array
 */
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
/**
 * Parse data into Buffer
 * @param {any} data - Data to parse
 * @param {boolean} [shareArrayBuffer=false] - Whether to share the input data's array buffer
 * @returns {Buffer} Parsed Buffer
 */
export function parseBuffer(data, shareArrayBuffer = false) {

  const u8 = parseUint8Array(data, shareArrayBuffer)
  if (shareArrayBuffer) {
    return Buffer.from(u8.buffer, u8.byteOffset, u8.byteLength)
  } else {
    return Buffer.from(u8)
  }
}

export const B8pack = parseBufferThenConcat
export function parseBufferThenConcat(...dataArray) {
  const buffers = dataArray.map(data => parseBuffer(data))
  return Buffer.concat(buffers)
}


export const U8pack = parseUint8ThenConcat // alias
/**
 * 1. parse list of data into U8 list
 * 2. return new Uint8Array merged.
 * @param  {...any} dataArray 
 * @returns 
 */
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


export function getBufferSize(binPack) {
  if (getMetaSize(binPack) === 0) {
    return binPack.byteLength
  } else {
    return binPack.byteLength - getMetaSize(binPack) - TAIL_LEN
  }
}

// MB and MBA 
export function parseMetaInfo(binPack, infoSize) {
  let info;
  try {
    const buffer = new Uint8Array(binPack.buffer, binPack.byteOffset, binPack.byteLength)
    const infoFrom = buffer.byteLength - infoSize - 2
    const infoEncoded = buffer.subarray(infoFrom, buffer.byteLength - 2)
    const decoded = decoder.decode(infoEncoded)
    const info = JSON.parse(decoded)

    if (!Array.isArray(info) || !Array.isArray(info[0])) return

    let firstItem = info[0]
    if (!firstItem) return

    if (firstItem.length < 3) return
    const [name, type, offset] = firstItem

    if (typeof type !== 'string' || typeof offset !== 'number') return

    return info
  } catch (error) {
    // return undefined
  }
}


/** 
 * Meta buffer pack Tail:
 * binary Pack include TAIL(two bytes size) info at the end if it has JSON info.
 * not include TAIL if it has not JSON.
 */
export const TAIL_LEN = 2

/**
 * 
 * @param {Buffer|Uint8Array|ArrayBuffer} binPack 
 * @returns {Number} last two byte value( read Uint16 bigendian )
 */
export function readTail(binPack) {
  if (binPack instanceof ArrayBuffer) {
    binPack = Buffer.from(binPack) // creates a view for ArrayBuffer, without copying.
  }
  if (binPack instanceof Uint8Array) {
    if (binPack.byteLength <= TAIL_LEN) return 0

    const dv = new DataView(binPack.buffer, binPack.byteOffset, binPack.byteLength)
    const infoSize = dv.getUint16(binPack.byteLength - TAIL_LEN)  // last 2 bytes for json-info-length.
    return infoSize

  } else {
    // throw TypeError('invalid data type.')
    return 0
  }

}


// binay data pack is not always Buffer.  
// It should accept Uint8Array binPack.
// This function don't use Buffer method.

export function getMetaSize(binPack) {
  if (binPack instanceof ArrayBuffer) {
    binPack = Buffer.from(binPack) // creates a view for ArrayBuffer, without copying.
  }
  if (binPack instanceof Uint8Array) {

    const size = binPack.byteLength
    if (size <= TAIL_LEN) return 0

    //1. tail size check
    const infoSize = readTail(binPack)
    if (infoSize === 0 || infoSize > size) return 0
    //2. try parse JSON 
    const success = parseMetaInfo(binPack, infoSize)
    //3. return success: jsonInfoSize,  fail: 0
    if (success) return infoSize
    else return 0
  } else {
    return 0
  }
}


/**
 * 
 * @param {Buffer|Uint8Array} binPack 
 * @returns {Buffer} 
 */
export function getBuffer(binPack) {
  const rawBufferSize = getBufferSize(binPack)
  return binPack.subarray(0, rawBufferSize)
}



/**
 * extract Meta info object if it has.
 * 
 * @param {Buffer|Uint8Array|ArrayBuffer} binPack 
 * @param {Boolean} showDetail add additional item info: full data type name and bytelength.
 * @returns {Object|undefined} success: return MetaInfo Object.   fail: return undefined.(No valid JSON included.)
 */
/**
 * Extract metadata from buffer
 * @param {Buffer|Uint8Array|ArrayBuffer} binPack - Binary data to extract metadata from
 * @param {boolean} [showDetail=false] - Whether to show detailed information
 * @returns {Object|undefined} Metadata object or undefined if no valid JSON included
 */
export function getMeta(binPack, showDetail = false) {
  if (binPack instanceof ArrayBuffer) {
    binPack = Buffer.from(binPack) // creates a view for ArrayBuffer, without copying.
  }
  const infoSize = readTail(binPack)
  if (infoSize === 0) return

  // check valid Meta
  let metaInfo = parseMetaInfo(binPack, infoSize)
  if (!metaInfo) return

  if (!showDetail) {
    return metaInfo
  } else {
    // add additional info
    metaInfo.forEach(bufPack => {
      const len = bufPack[3]
      if (len == undefined) {  // add size info.
        if (bufPack[1].includes('8')) bufPack[3] = 1
        else if (bufPack[1].includes('16')) bufPack[3] = 2
        else if (bufPack[1].includes('32')) bufPack[3] = 4
        else if (bufPack[1].includes('F')) bufPack[3] = 4
        else if (bufPack[1].includes('!')) bufPack[3] = 1
      }
      bufPack[4] = parseTypeName(bufPack[1])  // add full-type-name.
    })
    return metaInfo
  }
}

export function rawPack(...args) {
  return getBuffer(pack(...args))
}

export function meta(...args) {
  return getMeta(pack(...args))
}

export function metaDetail(...args) {
  return getMeta(pack(...args), true)
}

export function getMetaDetail(binPack) {
  return getMeta(binPack, true)
}
