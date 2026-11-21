// make.fun news-image-20261120 entry: "The World on Friday 20 November 2026".
// The image is rendered ahead of time from poster.html (generated illustrations in assets/ plus typeset labels) and
// committed as entry.png. The sandbox has no network and no browser, so this program only checks the committed bytes
// against the contest's gate and writes an identical copy to /output/entry.png (MAKEFUN_OUTPUT_DIR overrides /output).
//
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const MAX_BYTES = 1_048_576;
const MAX_SIDE = 1024;

type Size = { width: number; height: number };

function jpegSize(buf: Buffer): Size {
  if (buf[0] !== 0xff || buf[1] !== 0xd8) throw new Error('missing JPEG SOI marker');
  let pos = 2;
  let size: Size | null = null;
  while (pos + 4 <= buf.length) {
    if (buf[pos] !== 0xff) throw new Error(`expected a marker at byte ${pos}`);
    const marker = buf[pos + 1];
    if (marker === 0xff) { pos += 1; continue; }
    if (marker === 0xd9) throw new Error('EOI before any scan');
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) { pos += 2; continue; }
    const len = buf.readUInt16BE(pos + 2);
    if (len < 2 || pos + 2 + len > buf.length) throw new Error(`segment 0x${marker.toString(16)} overruns the file`);
    const isSof = marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
    if (isSof) size = { height: buf.readUInt16BE(pos + 5), width: buf.readUInt16BE(pos + 7) };
    pos += 2 + len;
    if (marker === 0xda) {
      // Entropy-coded data runs until a marker that is neither a stuffed 0x00 nor a restart marker.
      while (pos + 1 < buf.length) {
        if (buf[pos] === 0xff) {
          const next = buf[pos + 1];
          if (next === 0x00 || (next >= 0xd0 && next <= 0xd7)) { pos += 2; continue; }
          if (next === 0xff) { pos += 1; continue; }
          break;
        }
        pos += 1;
      }
      if (buf[pos + 1] === 0xd9) {
        if (pos + 2 !== buf.length) throw new Error('bytes after the EOI marker');
        if (!size) throw new Error('no SOF segment');
        return size;
      }
    }
  }
  throw new Error('JPEG ends without an EOI marker');
}

const CRC_TABLE = new Int32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c;
});

function crc32(buf: Buffer, start: number, end: number): number {
  let c = -1;
  for (let i = start; i < end; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function pngSize(buf: Buffer): Size {
  const sig = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (sig.some((b, i) => buf[i] !== b)) throw new Error('missing PNG signature');
  let pos = 8;
  let size: Size | null = null;
  let idat = false;
  while (pos + 12 <= buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('latin1', pos + 4, pos + 8);
    const end = pos + 12 + len;
    if (end > buf.length) throw new Error(`${type} chunk overruns the file`);
    if (crc32(buf, pos + 4, pos + 8 + len) !== buf.readUInt32BE(pos + 8 + len)) throw new Error(`${type} CRC mismatch`);
    if (pos === 8 && (type !== 'IHDR' || len !== 13)) throw new Error('IHDR must come first');
    if (type === 'IHDR') size = { width: buf.readUInt32BE(pos + 8), height: buf.readUInt32BE(pos + 12) };
    if (type === 'IDAT') idat = true;
    pos = end;
    if (type === 'IEND') {
      if (pos !== buf.length) throw new Error('bytes after IEND');
      if (!size || !idat) throw new Error('missing IHDR or IDAT');
      return size;
    }
  }
  throw new Error('PNG ends without IEND');
}

const image = readFileSync(new URL('./entry.png', import.meta.url));
if (image.length > MAX_BYTES) throw new Error(`entry.png is ${image.length} bytes, over ${MAX_BYTES}`);
// The gate tells PNG from JPEG by the first bytes, so dispatch on the full signature and refuse anything else.
const isJpeg = image.length > 3 && image[0] === 0xff && image[1] === 0xd8 && image[2] === 0xff;
const isPng = image.length > 8 && image.readUInt32BE(0) === 0x89504e47;
if (!isJpeg && !isPng) throw new Error('entry.png is neither a JPEG nor a PNG');
const { width, height } = isJpeg ? jpegSize(image) : pngSize(image);
if (width < 1 || height < 1 || width > MAX_SIDE || height > MAX_SIDE) {
  throw new Error(`entry.png is ${width}x${height}, outside 1..${MAX_SIDE}`);
}

writeFileSync(join(process.env.MAKEFUN_OUTPUT_DIR ?? '/output', 'entry.png'), image);
