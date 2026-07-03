import { motion } from 'framer-motion';

export default function LoadingScreen({ visible }) {
  return (
    <motion.div
      className="loading-screen"
      initial={{ opacity: 1 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.8 }}
      style={{ pointerEvents: visible ? 'auto' : 'none' }}
    >
      <div className="loading-heart">💗</div>
      <div className="loading-text">loading our story…</div>
    </motion.div>
  );
}
