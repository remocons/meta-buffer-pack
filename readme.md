# Meta Buffer Pack


Meta buffer packaging helper.

## Support 
Node: CJS, ESM,  browser: IIFE, ESM.

## Teminology

- NB: Number Buffer:  Typed Number => < buffer >

- MB: Meta Buffer :  [ "name", "type", < buffer > ] :Array

- MBA: Meta Buffer Arguments :  ...args => ...MB

- Meta Buffer Pack:  one buffer contains [...buffer, bufferInfo ]

- pack() :  Merge multiple MB or MBA then return  one MBP

- unpack() :  unpack MBP then return MBO.

- Meta Buffer Object: { "name1": Buffer, "name2": Number ,,,}


```

import { MBP } from 'meta-buffer-pack'

// 1. pack()
    let pack = MBP.pack(
    MBP.MB('v1','8',123),  // uint8 (default. Unsgined, BigEndian)
    MBP.MB('v2','i16',-31234),  //int16 ( Signed value include i)
    MBP.MB('v3','16L', 0x1234),  //Uint16 ( LittleEndian include L)
    MBP.MB('v4','32', 4200000000),   // uint32
    MBP.MB('v5','n', 123.456),   // Normal Number as string buffer (include float)
    MBP.MB('vStr','abcde'),  // buffer string
    MBP.MB('#omitInfo','bufferConatinsThisData')  // if name includes # then omitted info data.
  )


// 2. unpack:  buffer -> object

    let obj = MBP.unpack( pack )

    //obj
    {
      "v1": 123,
      "v2": -31234,
      "v3": 4660,
      "v4": 4200000000,
      "v5": 123.456,
      "vStr": "abcde"
    }



```
