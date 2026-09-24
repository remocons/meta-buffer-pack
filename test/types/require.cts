import MBP = require('meta-buffer-pack');
const tuple: MBP.MetaBufferTuple = MBP.MB('value', null);
const buffer = MBP.pack(tuple, MBP.MBA(false, 0, ''));
MBP.unpack(buffer);
MBP.getMeta(buffer);
MBP.Buffer.alloc(MBP.TAIL_LEN);
// @ts-expect-error CommonJS directly exports the API, not a default wrapper.
MBP.default;
