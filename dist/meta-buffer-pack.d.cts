import type { Buffer as NodeBuffer } from 'buffer';

/** Binary packing API exposed as the CommonJS module and ESM default export. */
declare namespace MBP {
  type BinaryInput = Uint8Array | ArrayBuffer;
  type MetaValue = number | string | boolean | null | object;
  type MetaBufferTuple = [name: string | number, bufferType: string, buffer: NodeBuffer];
  /** Length may be omitted only for fixed-width numeric and boolean fields. */
  type MetaInfoTuple = [name: string | number, type: string, offset: number, length?: number, fullType?: string];
  type MetaInfo = MetaInfoTuple[];
  type PackItem = MetaBufferTuple | MetaBufferTuple[];
  interface unpackedObject {
    [key: string]: any;
    args?: unknown[];
    $?: unknown[];
    $OTHERS?: NodeBuffer;
  }
  interface MetaBufferOptions { showDetail?: boolean; }

  const Buffer: typeof import('buffer').Buffer;
  const TAIL_LEN: 2;
  function numberBuffer(type: string, initValue?: number): NodeBuffer;
  function metaBuffer(name: string | number, data: MetaValue): MetaBufferTuple;
  function metaBuffer(name: string | number, typeOrSize: string | number, initValue: number): MetaBufferTuple;
  function metaBufferArguments(...args: MetaValue[]): MetaBufferTuple[];
  function pack(...args: PackItem[]): NodeBuffer;
  /** Invalid metadata or undecodable fields return undefined. */
  function unpack(binPack: BinaryInput, meta?: MetaInfo): unpackedObject | undefined;
  function parseTypeName(type: string): string;
  function readTypedBuffer(type: string, buffer: NodeBuffer, offset: number, length?: number): unknown;
  function parseUint8Array(data: unknown, shareArrayBuffer?: boolean): Uint8Array;
  function parseBuffer(data: unknown, shareArrayBuffer?: boolean): NodeBuffer;
  function parseBufferThenConcat(...data: unknown[]): NodeBuffer;
  function parseUint8ThenConcat(...data: unknown[]): Uint8Array | undefined;
  function hex(buffer: BinaryInput): string;
  function equal(buf1: Uint8Array, buf2: Uint8Array): boolean;
  function getBufferSize(binPack: BinaryInput): number;
  function readTail(binPack: BinaryInput): number;
  function getMetaSize(binPack: BinaryInput): number;
  function parseMetaInfo(binPack: BinaryInput, infoSize?: number): MetaInfo | undefined;
  function getBuffer(binPack: NodeBuffer): NodeBuffer;
  function getBuffer(binPack: Uint8Array): Uint8Array;
  function getMeta(binPack: BinaryInput, showDetail?: boolean): MetaInfo | undefined;
  function getMetaDetail(binPack: BinaryInput): MetaInfo | undefined;
  function rawPack(...args: PackItem[]): NodeBuffer;
  function meta(...args: PackItem[]): MetaInfo | undefined;
  function metaDetail(...args: PackItem[]): MetaInfo | undefined;

  const NB: typeof numberBuffer;
  const MB: typeof metaBuffer;
  const MBA: typeof metaBufferArguments;
  const U8: typeof parseUint8Array;
  const B8: typeof parseBuffer;
  const B8pack: typeof parseBufferThenConcat;
  const U8pack: typeof parseUint8ThenConcat;
}
export = MBP;
