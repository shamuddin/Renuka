// Lists nodes / meshes inside a GLB so we know how to use it.
import { readFileSync } from 'node:fs';

function info(path) {
  const buf = readFileSync(path);
  let off = 12, json = null;
  while (off < buf.length) {
    const len = buf.readUInt32LE(off);
    const type = buf.readUInt32LE(off + 4);
    const data = buf.subarray(off + 8, off + 8 + len);
    if (type === 0x4e4f534a) json = JSON.parse(data.toString('utf8'));
    off += 8 + len;
  }
  console.log('===', path, '===');
  console.log('meshes:', (json.meshes || []).map((m) => m.name || '(unnamed)').join(', '));
  console.log('nodes:', (json.nodes || []).map((n) => n.name || '(unnamed)').join(', '));
  console.log('materials:', (json.materials || []).map((m) => m.name || '(unnamed)').join(', '));
}
for (const f of process.argv.slice(2)) info(f);
