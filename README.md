# Meta Buffer Pack (MBP)

Meta Buffer Pack is a JavaScript library that combines binary data with metadata describing each field's name, type, offset, and length. It can restore a packed buffer as an object, or separate the raw bytes from their metadata.

Use it to bundle binary payloads with attributes, exchange application-specific messages, or build simple binary layouts with explicit integer sizes and byte order. MBP provides serialization utilities; transport, message framing, compression, and encryption are outside its scope.

## Installation and runtime support

```sh
npm install meta-buffer-pack
```

Builds are provided for Node.js (ESM and CommonJS) and browsers (UMD and ESM). The browser builds include a Node.js-compatible Buffer implementation exposed as `MBP.Buffer`. Runtimes must provide `TextEncoder` and `TextDecoder`.

## Quick start

```js
import MBP from 'meta-buffer-pack';

const packet = MBP.pack(
  MBP.MB('id', '16L', 7),
  MBP.MB('message', 'hello'),
  MBP.MB('payload', MBP.Buffer.from([1, 2, 3])),
  MBP.MB('optional', null)
);

const result = MBP.unpack(packet);
if (result === undefined) throw new Error('Invalid packet');

console.log(result.id);                  // 7
console.log(result.message);             // 'hello'
console.log([...result.payload]);        // [1, 2, 3]
console.log(result.optional);            // null
console.log(MBP.Buffer.isBuffer(result.payload)); // true
```

### CommonJS

Use this import in a CommonJS file, such as `example.cjs`:

```js
const MBP = require('meta-buffer-pack');
const packet = MBP.pack(MBP.MB('message', 'hello'));
console.log(MBP.unpack(packet).message); // 'hello'
```

### Browser: UMD

Copy `dist/meta-buffer-pack.min.js` into your site and adjust the path as needed:

```html
<script src="./dist/meta-buffer-pack.min.js"></script>
<script>
  const packet = MBP.pack(MBP.MB('payload', MBP.Buffer.from([1, 2, 3])));
  console.log([...MBP.unpack(packet).payload]); // [1, 2, 3]
</script>
```

The UMD build exposes the global `MBP`. The package is also available through [jsDelivr](https://www.jsdelivr.com/package/npm/meta-buffer-pack); pin the package version when choosing a CDN URL.

### Browser: ES module

Serve the files over HTTP and retain the `.js` extension in the import:

```html
<script type="module">
  import MBP from './dist/meta-buffer-pack.js';
  const packet = MBP.pack(MBP.MB('message', 'hello'));
  console.log(MBP.unpack(packet).message); // 'hello'
</script>
```

## Creating fields with MB

`MB` is an alias for `metaBuffer`. It returns a tuple: `[name, type, buffer]`.

| Call | Meaning |
| --- | --- |
| `MB(name, value)` | Infer the storage type from the value |
| `MB(name, type, number)` | Encode a number using an explicit type |
| `MB(name, size, fill)` | Allocate a Buffer of `size` bytes, filled with `fill` (use 0–255) |

The third argument changes the meaning of a numeric second argument:

```js
import MBP from 'meta-buffer-pack';

const packet = MBP.pack(
  MBP.MB('count', 4),          // Number 4, stored as text
  MBP.MB('zeros', 4, 0),      // Four zero bytes
  MBP.MB('signed', 'i16', -31234),
  MBP.MB('littleEndian', '16L', 0x1234),
  MBP.MB('large', '32', 4200000000),
  MBP.MB('pi', 'f', 3.141592)
);

const result = MBP.unpack(packet);
console.log(result.count);              // 4
console.log([...result.zeros]);         // [0, 0, 0, 0]
console.log(result.signed);             // -31234
console.log(result.littleEndian);       // 4660
console.log(result.large);              // 4200000000
console.log(result.pi);                 // 3.141592025756836
```

### Supported values and decoded types

| Input | Storage | Decoded value |
| --- | --- | --- |
| `number`, or explicit `N` | UTF-8 text from `String(value)` | JavaScript number |
| Explicit `8`, `16`, `32` | Unsigned integer, 1/2/4 bytes | JavaScript number |
| Explicit `I8`, `I16`, `I32` | Signed integer, 1/2/4 bytes | JavaScript number |
| Explicit `F` | IEEE 754 Float32, 4 bytes | JavaScript number, with Float32 precision |
| `string` | UTF-8 (`S`) | string |
| `boolean` | One byte (`!`): 0 or 1 | boolean |
| `null` | JSON text (`O`) | null |
| Array or JSON-compatible object | JSON text (`O`) | Parsed array or object |
| Buffer, Uint8Array, ArrayBuffer, other TypedArray, DataView | Raw bytes (`B`) | Buffer |

Numeric type codes are case-insensitive. `I` selects signed integers, and `L` selects little endian for 16/32-bit integers and Float32. Without `L`, those values use big endian. For example, `16L`, `I32L`, and `FL` are supported. Endianness does not affect single-byte values.

Type codes such as `S`, `B`, `O`, and `!` describe inferred fields in metadata; use `MB(name, value)` to create those fields. The explicit three-argument type form is for numbers.

Important limits:

- Explicit numeric binary types do not include Float64 or 64-bit integers. Integer values must fit the selected range.
- Plain numbers preserve `NaN` and infinities through their text representation, but `-0` becomes `0`.
- Objects use JSON semantics: Date values become strings, Map and Set contents are not preserved by default, and class prototypes are lost. Nested `undefined` values follow JSON's omission/null rules.
- BigInt, functions, symbols, and `undefined` are not supported as direct MB/MBA values. Objects containing BigInt or circular references cannot be encoded through ordinary JSON serialization.
- TypedArray element types are not retained. Multi-byte TypedArrays store their existing memory bytes without endian conversion and decode as Buffer.

### Buffer copying and sharing

`MB(name, uint8Array)` copies a plain Uint8Array. An instance of `MBP.Buffer` is reused when creating the tuple; ArrayBuffer and other typed views share their underlying memory at that stage. In Node.js, the native Buffer and `MBP.Buffer` are distinct implementations, so a native Buffer can take the Uint8Array copy path.

`pack()` copies field bytes into a new buffer. `unpack()` copies Buffer/Uint8Array inputs, while ArrayBuffer input is wrapped without copying. Decoded binary fields are views of that decoding buffer. `getBuffer()` returns a view of the supplied packet.

## Packing arguments with MBA

`MBA(...args)` creates fields named with numeric indices. After decoding, values are available through numeric properties and the `args` array; `$` is an alias for the same array.

```js
import MBP from 'meta-buffer-pack';

const values = ['hi', 2332, 22.2, [1, 2, 3], { hi: 'yeh' }, true, 0, false, '', null];
const packet = MBP.pack(MBP.MBA(...values));
const result = MBP.unpack(packet);

console.log(result.args[0]); // 'hi'
console.log(result.$[1]);    // 2332
console.log(result.args[6]); // 0
console.log(result.args[7]); // false
console.log(result.args[8]); // ''
console.log(result.args[9]); // null
console.log(result.args === result.$); // true
```

You can combine named fields with one MBA list:

```js
import MBP from 'meta-buffer-pack';

const packet = MBP.pack(
  MBP.MB('greeting', 'hello'),
  MBP.MB('coffee', 'mocha'),
  MBP.MBA('a1', 'a2', 3)
);
const result = MBP.unpack(packet);
console.log(result.greeting); // 'hello'
console.log(result.coffee);   // 'mocha'
console.log(result.args);     // ['a1', 'a2', 3]
```

Use one MBA list per packet: multiple lists restart at index 0 and overwrite earlier values. An empty MBA list does not create `args` or `$`.

## Field names and omitted metadata

- Names may be strings or nonnegative safe integer indices. Use unique string names for ordinary named fields.
- Duplicate names overwrite earlier decoded values. Numeric names and their string equivalents, such as `0` and `'0'`, refer to the same object property.
- Avoid `args` and `$` when using indexed fields: the generated argument array overwrites them. Avoid `$OTHERS` when decoding raw bytes with external metadata: generated trailing bytes overwrite it.
- Numeric properties beginning at 0 form the argument array, stopping at the first missing index. Avoid these names for unrelated fields when using MBA.
- An empty string name, or a string containing `#` anywhere, omits that field's metadata. Its data bytes remain in the packet, but `unpack()` cannot automatically restore that field.
- If every field omits metadata, `pack()` emits only raw bytes, without a metadata footer. Supply external metadata to decode such bytes reliably.

## Raw bytes and external metadata

`meta(...fields)` builds metadata from MB tuples. `getMeta(packet)` extracts metadata from an existing packet. `rawPack(...fields)` produces only the data bytes, while `getBuffer(packet)` extracts them from a packet.

Metadata entries have the form `[name, type, offset, length]`. Offsets and lengths are measured in bytes. Length may be omitted for fixed-width numeric and boolean fields; variable-width fields require it.

```js
import MBP from 'meta-buffer-pack';

const fields = [MBP.MB('id', '16L', 7), MBP.MB('label', 'hello')];
const metadata = MBP.meta(...fields);
const raw = MBP.rawPack(...fields);
console.log(MBP.unpack(raw, metadata).label); // 'hello'

// Decode a known header followed by a variable-size payload.
const incoming = MBP.Buffer.from([0, 7, 10, 20, 30]);
const result = MBP.unpack(incoming, [['id', '16', 0]]);
console.log(result.id);           // 7
console.log([...result.$OTHERS]); // [10, 20, 30]
```

With external metadata, `$OTHERS` contains trailing bytes after the highest field end. It does not collect gaps between fields. No `$OTHERS` property is generated when no trailing bytes remain.

## Binary format and size limits

When at least one field has metadata, the format is:

```text
[concatenated field bytes]
[UTF-8 JSON array of [name, type, offset, length] entries]
[JSON byte length: unsigned 16-bit big endian]
```

For `MBP.pack(MBP.MB('x', '8', 1))`:

```text
Data:     01                          (1 byte)
Metadata: [["x","8",0,1]]             (15 UTF-8 bytes)
Footer:   00 0f                       (2 bytes)
Total:    18 bytes
```

The metadata length is limited to **65,535 bytes**, not the whole packet. Larger metadata causes packing to throw a RangeError. Payload size is also subject to runtime Buffer and memory limits.

Packet size is payload bytes plus metadata bytes plus two footer bytes. Small messages can be larger than JSON: the example above occupies 18 bytes, while `{"x":1}` occupies 7 UTF-8 bytes. MBP does not compress data.

Decoding embedded metadata requires the end of the packet. For a byte stream such as TCP, add a separate framing mechanism to identify packet boundaries. The format has no magic signature, version field, or checksum; metadata parsing is not an integrity or authenticity check.

## Decoding and error handling

`unpack()` returns an object on success and `undefined` if metadata is absent or invalid, a field extends outside its data region, or a field cannot be decoded. It does not return a partial object. `null`, `0`, `false`, and empty strings are preserved, including in MBA arguments.

Metadata validation checks every entry's name, recognized type, offset, and length. Fixed-width field lengths must match their type. Embedded metadata cannot point into the metadata/footer region.

Packing errors throw rather than returning `undefined`. Examples include unsupported direct values, unsupported numeric types passed to `NB()`, out-of-range integers, oversized metadata, and objects that JSON cannot serialize.

Decoded binary values are Buffer instances. An object displayed as `{"type":"Buffer","data":[1,2,3]}` is a Buffer's JSON representation, not the original runtime value. Use `MBP.Buffer.isBuffer(value)` or inspect its bytes directly.

## API reference

All runtime APIs are properties of `MBP`, the ESM default export or CommonJS module. There are no ESM named value exports.

| API | Purpose / result |
| --- | --- |
| `MB(name, value)` / `metaBuffer` | Create `[name, type, Buffer]`; also accepts the numeric three-argument forms described above |
| `MBA(...values)` / `metaBufferArguments` | Create an indexed list of MB tuples |
| `NB(type, value = 0)` / `numberBuffer` | Encode one number into a Buffer |
| `pack(...fieldsOrLists)` | Combine MB tuples and MB lists into a packet |
| `unpack(bytes, metadata?)` | Decode to an object, or return `undefined` |
| `meta(...fieldsOrLists)` | Build metadata from fields, or return `undefined` if none is present |
| `metaDetail(...fieldsOrLists)` | Build metadata with full type names |
| `getMeta(packet, showDetail = false)` | Extract metadata, or return `undefined` |
| `getMetaDetail(packet)` | Extract metadata with full type names |
| `rawPack(...fieldsOrLists)` | Pack fields and extract raw data bytes |
| `getBuffer(packet)` | Return a view of the raw data region; accepts Buffer/Uint8Array |
| `getBufferSize(packet)` | Return the detected raw data size |
| `getMetaSize(packet)` | Return valid metadata size, or 0 |
| `readTail(packet)` | Read the final two-byte length; does not validate metadata |
| `parseMetaInfo(packet, infoSize?)` | Parse and validate metadata; omitted size is read from the footer |
| `parseTypeName(type)` | Expand a type code, for example `16L` to `uint16_le` |
| `readTypedBuffer(type, buffer, offset, length?)` | Read one field, or return `undefined` |
| `U8(data, shareArrayBuffer = false)` / `parseUint8Array` | Convert to Uint8Array |
| `B8(data, shareArrayBuffer = false)` / `parseBuffer` | Convert to Buffer |
| `U8pack(...data)` / `parseUint8ThenConcat` | Convert and concatenate into Uint8Array; returns `undefined` on conversion failure |
| `B8pack(...data)` / `parseBufferThenConcat` | Convert and concatenate into Buffer |
| `hex(bytes)` | Return a hexadecimal string |
| `equal(a, b)` | Compare Buffer/Uint8Array bytes |
| `Buffer` | Bundled Buffer constructor |
| `TAIL_LEN` | Footer length: 2 |

Detailed metadata appends a full type name as the fifth tuple element. It can also be supplied to `unpack()`.

`U8` and `B8` are conversion utilities, not substitutes for MB serialization: a number is converted to a single byte, strings use UTF-8, and ordinary objects use JSON. With `shareArrayBuffer = true`, ArrayBuffer and view inputs share memory; the default copies them. Concatenation utilities do not add metadata.

## TypeScript

Declarations match the ESM default export and the direct CommonJS API. Use NodeNext resolution for Node.js projects or Bundler resolution with a compatible bundler. Buffer declarations reference Node types; projects without them may need `@types/node` as a development dependency.

```ts
// ESM (.mts, or .ts in an ESM package)
import MBP, { type MetaBufferTuple } from 'meta-buffer-pack';

const field: MetaBufferTuple = MBP.MB('id', '16L', 7);
const metadata = MBP.meta(field);
const value = MBP.unpack(MBP.rawPack(field), metadata);
if (value !== undefined) console.log(value.id); // 7
```

```ts
// CommonJS (.cts)
import MBP = require('meta-buffer-pack');

const field: MBP.MetaBufferTuple = MBP.MB('id', '16L', 7);
const value = MBP.unpack(MBP.pack(field));
if (value !== undefined) console.log(value.id); // 7
```

Type declarations describe the API but do not infer decoded field names and value types from a packet. Validate application-specific structures where needed.

## Examples and development

[example/index.html](example/index.html) demonstrates browser UMD and ESM usage. Node.js ESM and CommonJS examples appear above.

An [online demo](https://remocons.github.io/meta-buffer-pack/index.html) is also available; its deployed version may differ from the local checkout.

From a repository checkout:

```sh
npm install
npm run build
npm test
npm run test:types
```

Build before running tests so the distribution files reflect source changes. Tests cover the public builds and source regressions; type checks cover ESM and CommonJS imports.

## Terminology

| Term | Meaning |
| --- | --- |
| MB | Meta Buffer: `[name, type, buffer]` tuple |
| MBA | List of MB tuples generated from function-style arguments |
| MBP packet | Combined field bytes, optionally followed by metadata and a footer |
| MBO | Object returned by `unpack()` |

## License

[MIT](LICENSE)
