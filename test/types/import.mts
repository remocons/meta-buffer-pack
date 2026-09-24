import MBP, { type MetaBufferTuple, type MetaInfo } from 'meta-buffer-pack';
// @ts-expect-error Runtime provides only a default value export.
import { pack } from 'meta-buffer-pack';
const tuple: MetaBufferTuple = MBP.MB('id', '16L', 7);
const [name, type, bytes] = tuple;
const metadata: MetaInfo | undefined = MBP.meta(tuple, MBP.MBA(null, false, 0));
MBP.metaDetail(tuple);
MBP.unpack(MBP.rawPack(tuple), metadata);
MBP.unpack(new ArrayBuffer(2), [['id', '16', 0]]);
MBP.Buffer.alloc(1);
MBP.U8(bytes);
MBP.getBuffer(bytes);
MBP.parseMetaInfo(MBP.pack(tuple));
MBP.parseTypeName(type);
const tail: 2 = MBP.TAIL_LEN;
// @ts-expect-error A meta buffer is a tuple, not an object.
tuple.buffer;
// @ts-expect-error Initial values must be numeric.
MBP.MB('id', '16', '7');
// @ts-expect-error meta() builds metadata from tuples, not packed bytes.
MBP.meta(bytes);
// @ts-expect-error Offsets must be numeric.
MBP.unpack(bytes, [['id', '8', '0', 1]]);
