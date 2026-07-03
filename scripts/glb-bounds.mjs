// Quick GLB inspector: reads the JSON chunk and reports the overall
// POSITION bounding box (model-space) so we can pick sane scales.
import { readFileSync } from 'node:fs';

function bounds(path) {
  const buf = readFileSync(path);
  // GLB: magic(4) version(4) length(4), then chunks: length(4) type(4) data
  let off = 12;
  let json = null;
  while (off < buf.length) {
    const len = buf.readUInt32LE(off);
    const type = buf.readUInt32LE(off + 4);
    const data = buf.subarray(off + 8, off + 8 + len);
    if (type === 0x4e4f534a) json = JSON.parse(data.toString('utf8')); // "JSON"
    off += 8 + len;
  }
  if (!json) return console.log(path, 'no json');
  const meshNames = (json.meshes || []).map((m) => m.name).filter(Boolean);
  const nodeNames = (json.nodes || []).map((n) => n.name).filter(Boolean);
  console.log('  meshes:', json.meshes?.length, meshNames.slice(0, 12).join(', '));
  console.log('  nodes :', json.nodes?.length, nodeNames.slice(0, 12).join(', '));
  const acc = json.accessors || [];
  const nodes = json.nodes || [];
  // find a scale factor applied to mesh nodes (Quaternius bakes cm->m etc.)
  const meshNodeScale = {};
  for (const n of nodes) {
    if (n.mesh != null) {
      const s = n.scale ? Math.cbrt(Math.abs(n.scale[0] * n.scale[1] * n.scale[2])) : 1;
      meshNodeScale[n.mesh] = s || 1;
    }
  }
  let min = [Infinity, Infinity, Infinity];
  let max = [-Infinity, -Infinity, -Infinity];
  json.meshes?.forEach((m, mi) => {
    const s = meshNodeScale[mi] ?? 1;
    for (const p of m.primitives || []) {
      const a = acc[p.attributes.POSITION];
      if (a?.min && a?.max) {
        for (let i = 0; i < 3; i++) {
          min[i] = Math.min(min[i], a.min[i] * s);
          max[i] = Math.max(max[i], a.max[i] * s);
        }
      }
    }
  });
  const size = max.map((v, i) => +(v - min[i]).toFixed(2));
  console.log(path, '=> rendered size (x,y,z):', size);
}

for (const f of process.argv.slice(2)) bounds(f);
