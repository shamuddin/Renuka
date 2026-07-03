import { useMemo } from 'react';
import { useGLTF, Clone } from '@react-three/drei';
import { Box3, Vector3 } from 'three';

// Loads a model, scales it so its height == `h` world units, and seats its
// BASE at (x, y, z). Base-seating (offset by the bounding-box bottom) is what
// guarantees the model sits ON the surface instead of floating by its origin.
export default function Prop({ url, x = 0, y = 0, z = 0, h = 1, yaw = 0 }) {
  const { scene } = useGLTF(url);
  const norm = useMemo(() => {
    const box = new Box3().setFromObject(scene);
    const size = new Vector3();
    const center = new Vector3();
    box.getSize(size);
    box.getCenter(center);
    const s = h / (size.y || 1);
    return { scale: s, off: [-center.x * s, -box.min.y * s, -center.z * s] };
  }, [scene, h]);

  return (
    <group position={[x, y, z]} rotation={[0, yaw, 0]}>
      <Clone object={scene} scale={norm.scale} position={norm.off} />
    </group>
  );
}
