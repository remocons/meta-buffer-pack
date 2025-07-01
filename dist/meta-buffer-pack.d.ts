/// <reference types="node" />

export interface MetaBufferTuple {
    name: string;
    bufferType: string;
    buffer: Buffer;
}

export interface unpackedObject {
    [key: string]: any;
}

export interface MetaBufferOptions {
    showDetail?: boolean;
}

/**
 * Create a typed buffer with a specific type and initial value
 * @param type Buffer type (8, 16, 32, F, N)
 * @param initValue Initial value for the buffer
 * @returns Typed buffer
 * @throws TypeError If invalid type or initValue is provided
 */
export function numberBuffer(type: string, initValue?: number): Buffer;

/**
 * Create a meta buffer with name, type, and initial value
 * @param name Name of the buffer
 * @param typeOrData Data type or value
 * @param initValue Initial value for numeric types
 * @returns Tuple containing name, buffer type, and buffer
 * @throws TypeError If invalid meta buffer type is provided
 */
export function metaBuffer(name: string, typeOrData: number | string | Uint8Array | ArrayBuffer | object | boolean, initValue?: number | string): MetaBufferTuple;

/**
 * Create meta buffers from arguments
 * @param args Arguments to create meta buffers
 * @returns Array of meta buffer tuples
 */
export function metaBufferArguments(...args: any[]): MetaBufferTuple[];

/**
 * Pack data with metadata
 * @param args Data to pack
 * @returns Packed buffer with metadata
 */
export function pack(...args: any[]): Buffer;

/**
 * Unpack data from buffer using metadata
 * @param binPack Binary data to unpack
 * @param meta Optional metadata object
 * @returns Unpacked data object or undefined if failed
 */
export function unpack(binPack: Buffer | Uint8Array, meta?: object): unpackedObject | undefined;

/**
 * Parse data into Uint8Array
 * @param data Data to parse
 * @param shareArrayBuffer Whether to share the input data's array buffer
 * @returns Parsed Uint8Array
 */
export function parseUint8Array(data: any, shareArrayBuffer?: boolean): Uint8Array;

/**
 * Parse data into Buffer
 * @param data Data to parse
 * @param shareArrayBuffer Whether to share the input data's array buffer
 * @returns Parsed Buffer
 */
export function parseBuffer(data: any, shareArrayBuffer?: boolean): Buffer;

/**
 * Convert Buffer to hex string
 * @param buffer Buffer to convert
 * @returns Hex string
 */
export function hex(buffer: Buffer): string;

/**
 * Compare two buffers
 * @param buf1 First buffer
 * @param buf2 Second buffer
 * @returns true if buffers are equal
 */
export function equal(buf1: Buffer, buf2: Buffer): boolean;

/**
 * Get buffer size from packed data
 * @param binPack Binary data
 * @returns Buffer size
 */
export function getBufferSize(binPack: Buffer | Uint8Array | ArrayBuffer): number;

/**
 * Read tail information from buffer
 * @param binPack Binary data
 * @returns Tail value
 */
export function readTail(binPack: Buffer | Uint8Array | ArrayBuffer): number;

/**
 * Get metadata size from buffer
 * @param binPack Binary data
 * @returns Metadata size
 */
export function getMetaSize(binPack: Buffer | Uint8Array | ArrayBuffer): number;

/**
 * Get detailed metadata from buffer
 * @param binPack Binary data
 * @returns Detailed metadata
 */
export function getMetaDetail(binPack: Buffer | Uint8Array | ArrayBuffer): any;

/**
 * Parse typed buffer
 * @param simpleType Type name
 * @param buffer Buffer to parse
 * @param offset Offset in buffer
 * @param length Length to read
 * @returns Parsed value
 */
export function readTypedBuffer(simpleType: string, buffer: Buffer, offset: number, length: number): any;

/**
 * Parse buffer and concatenate
 * @param dataArray Array of data to parse
 * @returns Parsed and concatenated buffer
 */
export function parseBufferThenConcat(...dataArray: any[]): Buffer;

/**
 * Parse Uint8Array and concatenate
 * @param dataArray Array of data to parse
 * @returns Parsed and concatenated Uint8Array
 */
export function parseUint8ThenConcat(...dataArray: any[]): Uint8Array;

/**
 * Create raw packed buffer
 * @param args Data to pack
 * @returns Packed buffer
 */
export function rawPack(...args: any[]): Buffer;

/**
 * Get metadata from packed buffer
 * @param binPack Binary data
 * @returns Metadata
 */
export function meta(binPack: Buffer | Uint8Array | ArrayBuffer): unpackedObject | undefined;

/**
 * Get detailed metadata from packed buffer
 * @param binPack Binary data
 * @returns Detailed metadata
 */
export function metaDetail(binPack: Buffer | Uint8Array | ArrayBuffer): any;

/**
 * Extract metadata from buffer
 * @param binPack Binary data to extract metadata from
 * @param showDetail Whether to show detailed information
 * @returns Metadata object or undefined if no valid JSON included
 */
export function getMeta(binPack: Buffer | Uint8Array | ArrayBuffer, showDetail?: boolean): unpackedObject | undefined;

/** Shorthand for numberBuffer */
export const NB: typeof numberBuffer;

/** Shorthand for metaBuffer */
export const MB: typeof metaBuffer;

/** Shorthand for metaBufferArguments */
export const MBA: typeof metaBufferArguments;

/** Shorthand for parseBuffer */
export const B8: typeof parseBuffer;

/** Shorthand for parseBufferThenConcat */
export const B8pack: typeof parseBufferThenConcat;

/** Shorthand for parseUint8ThenConcat */
export const U8pack: typeof parseUint8ThenConcat;


declare const MBP: typeof import("./meta-buffer-pack.js");
export default MBP;

