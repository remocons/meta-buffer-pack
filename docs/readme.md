# Meta Buffer Pack


`Meta Buffer Pack` : A binary data packaging helper.

## features
- pack : multiple meta-buffers into one buffer.
- unpack : parse meta-buffer-pack buffer into one Object(MBO).
- MBA: bundle function arguments as a buffer.
- It contains [ Node's Buffer](https://www.npmjs.com/package/buffer).  It's useful in the web browser.

## Support 
- Node: CJS (require), ESM (import),  
- browser: IIFE, ESM.


## Usage

### Node.js

```js
npm i meta-buffer-pack
```

```js
// Node ES Module
import { MBP } from 'meta-buffer-pack'

// Node commonJS
const { MBP } = require('meta-buffer-pack')

```


### Browser

### use script tag  (IIFE)

- You can find mata-buffer-pack.min.js file in the dist/ folder.
- You can use CDN: [jsdelivr](https://www.jsdelivr.com/package/npm/meta-buffer-pack)  

```html
/* 1. load script first */
<script src="./path/meta-buffer-pack.min.js"></script>

/* or you can use global CDN url */
<script src="https://cdn.jsdelivr.net/npm/meta-buffer-pack@1.1.0/dist/meta-buffer-pack.min.js"></script>

<script>
  // 2. Use global reference name: MBP 
  // 3. Use MBP.Buffer for Node Buffer.
  const Buffer = MBP.Buffer
</script>
```


### Browser ES Module. 

```js
// Do not forget the file path and extension '.js'
import { MBP, Buffer } from './path/meta-buffer-pack.esm.js'

```




### MBP.pack()
- Use function MB() to make a meta buffer. (name, type, value)
- Use function pack( ) to merge the MB list. 

```js
  let buf1 = new Uint8Array(32);

  let pack = MBP.pack(
    // typed number. strict byteLength & Endian.
    MBP.MB('anyName','8',123),  // uint8 (default. Unsgined, BigEndian)
    MBP.MB('v2','i16',-31234),  //int16 ( Signed value include i)
    MBP.MB('v3','16L', 0x1234),  //Uint16 ( LittleEndian include L)
    MBP.MB('v4','32', 4200000000),   // uint32
    MBP.MB('pi','f', 3.141592),   // float as 4bytes buffer

    // Nnumbers
    MBP.MB('v5','n', 123.456),   //  Number as string buffer (include float number.)
    MBP.MB('numberString', 123.456),   // MB('name', number) same with above. wihtout 3rd parameter. it's stored number as string.

    // define size of Uint8Array with initValue(0~255).
    MBP.MB('sizeBufferWithInitValue', 4,1),   // MB('name',size, init) 
    MBP.MB('vStr','abcde'),  // buffer string (UTF8 encoded)

    // raw buffers. with name. No 'type' parameter.    
    MBP.MB('buf1', buf1 ), // Uint8Array reference.
    MBP.MB('buf2', Buffer.alloc(32) ), // Using Buffer.alloc()
    MBP.MB('buf3', Buffer.from([1,2,3]) ), // Using Buffer.from()

    MBP.MB('#omitInfo','bufferConatinsThisData')  
    // if name includes # then omitted from info object. *reduce pack size.
  )
    //now pack is a buffer.

```



### MBP.unpack( bufferPack ) : Object

- unpack() function receive buffer Pack.
- return object {}
- This object has property names that defined by meta buffer.

```js

    let obj = MBP.unpack( pack )

    // unpack check.
    if( obj ){
      // success  return Object {}
    }else{
      // fail return undefined.
    }

    //obj key and values.
    {
      "anyName": 123,
      "v2": -31234,
      "v3": 4660,
      "v4": 4200000000,
      "pi": 3.141592025756836,
      "v5": 123.456,
      "numberString": 123.456,
      "sizeBufferWithInitValue": {
        "type": "Buffer",
        "data": [1,1,1,1]
      },
      "vStr": "abcde",
      "buf1": {
        "type": "Buffer",
        "data": [ ... ]
      },
      "buf2": {
        "type": "Buffer",
        "data": [ ... ]
      },
      "buf3": {
        "type": "Buffer",
        "data": [ 1, 2, 3 ]
    }
    
    console.log( obj.anyName ) // 123


```

## MBA example.
Convert multiple parameters into MB list. 

```js

function packFunctionParams( ...args){
  return MBP.pack(  MBP.MBA(...args) )
}

let mbaPack = packFunctionParams( 'hi', 2332, 22.2, [1, 2, 3], { 'hi': 'yeh' }, true )


// Now mbaPack is Buffer which contains function arguments.
<Buffer 68 69 32 33 33 32 32 32 2e 32 5b 31 2c 32 2c 33 5d 7b 22 68 69 22 3a 22 79 65 68 22 7d 01 06 5b 5b 30 2c 22 53 22 2c 30 2c 32 5d 2c 5b 31 2c 22 4e 22 ... >


let mbaObj = MBP.unpack( mbaPack )

// use reserved property names:  args ( or $ )

// mbaObj.args is an array of parameter values.

 [ 'hi', 2332, 22.2, [ 1, 2, 3 ], { hi: 'yeh' }, true ]

// use args prop with index number
 mbaObj.args[0] => hi
 mbaObj.$[1] => 2332  // $ is alias name.  
 mbaObj.args[2] => 22.2
 mbaObj.args[3] => [1,2,3]
 mbaObj.args[4] => { hi: 'yeh' }
 mbaObj.args[5] => true

```

### Property name of MB and MBA.

- MB: You can define 'VariableName' of MB.  
  - The name will be MBO.property name.
- MBA: can't define variable name. 
  - You can use reserved property name with index number: 
  - use `$` or `args` ( array of MBA values)
  - It will use index number (same order of MBA parameters).
  - ex:  `args`[0], `args`[1] , `args`[n]
  - ex:  `$`[0], `$`[1] , `$`[n]  `$` is alias of `args`.

```js
// MB property
let mb = MBP.MB('devId','32', 4200000000 )
let mbo = MBP.unpack( MBP.pack(mb) )
 console.log( mbo.devId  === 4200000000 ) // true

// MBA argument
  let mbao = MBP.unpack( MBP.pack( MBP.MBA( 'hi', 2332, 22.2 ) ))
 console.log( mbao.args[2] ) // 22.2   [2] => third argument.
 console.log( mbao.$[2] ) // 22.2  equal.

```

### pack() MB and MBA together.

You can make a buffer package with MB and MBA together.

- multiple MB available.
- one MBA at one pack. 
  - reson: MBA use index number as property name.
  - multiple MBA will lose information.



```js

let mixed = MBP.pack( 
    // one or multiple MB supported.
    MBP.MB('greeting','hello'),  
    MBP.MB('coffee','mocha'),      
    MBP.MBA('a1','a2',3)  // only one MBA at one pack. 
    ) 

let mboMix = MBP.unpack( mixed)

// MB property
console.log( mboMix.greeting ) //  "hello"
console.log( mboMix.coffee ) //  "mocha

//MBA array
console.log( mboMix.args ) // [  "a1", "a2", 3 ]
console.log( mboMix.args[1] ) // "a2"

```



## Teminology

- `MB`: Meta Buffer :  [ "name", "type", < buffer > ] :Array
  - name : string : user defined variable name.
  - type : string : declare variable data type and endian.
  - buffer: Buffer : Uint8Array binary Data.
  - MB function generate Meta Buffer.

- `MBA`: Meta Buffer Arguments :  ...args => ...MB

- Meta Buffer Pack:  One buffer contains [...buffers + Meta buffer Info + Tail]

- `pack` :  Merge multiple MB or MBA then return  one MBP

- `unpack` :  unpack MBP then return MBO.

- `MBO`: Meta Buffer Object 
  - unpack(MB Pack) =>{ "name1": Buffer, "name2": Number ,,,}
  - unpack(MBA pack ) =>{ "args": [12,22.2 ,,,] ,,}  
  If MBP contains MBA then unpacked MBO has 'args' and '$' properties.

## Alias Name

 - MBP.MB == MBP.metaBuffer
 - MBP.MBA == MBP.metaBufferArguments

### node & browser example
please check example/ folder. There are commonJS and ES Module example code.


### online demo
You can simply evaluate some test code by online page.  
- [Modern ES Module demo link](https://congtrol.github.io/meta-buffer-pack/example/index-esm.html)
- [IIFE demo link](https://congtrol.github.io/meta-buffer-pack/example/index-iife.html)


### license
[ISC](LICENSE) Dongeun Lee 이동은 <sixgen@gmail.com>
