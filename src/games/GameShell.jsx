import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '../store/useStore.js';
import { games } from './registry.js';

// Full-screen modal that hosts the active island game and shows the reward
// (a message + a heart to collect) when it's won.
export default function GameShell() {
  const activeGame = useStore((s) => s.activeGame);
  const closeGame = useStore((s) => s.closeGame);
  const winGame = useStore((s) => s.winGame);
  const [won, setWon] = useState(false);

  const def = activeGame ? games[activeGame] : null;

  useEffect(() => {
    setWon(false);
  }, [activeGame]);

  function handleWin() {
    if (activeGame) winGame(activeGame);
    setWon(true);
  }

  const Game = def?.Component;

  return (
    <AnimatePresence>
      {def && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(120, 90, 105, 0.28)',
            backdropFilter: 'blur(6px)',
            padding: '1rem',
          }}
        >
          <motion.div
            className="glass-card"
            initial={{ scale: 0.94, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.94, y: 20 }}
            style={{
              position: 'relative',
              padding: 'clamp(1.2rem, 3vw, 2rem)',
              width: 'min(96vw, 960px)',
              maxHeight: '94vh',
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <button
              onClick={closeGame}
              style={{
                position: 'absolute',
                top: 10,
                right: 12,
                border: 'none',
                background: 'transparent',
                fontSize: '1.4rem',
                color: 'var(--ink)',
                cursor: 'pointer',
                lineHeight: 1,
              }}
              aria-label="close"
            >
              ×
            </button>

            <div className="eyebrow" style={{ textAlign: 'center' }}>mini-game</div>
            <h3
              className="font-title"
              style={{ textAlign: 'center', fontStyle: 'italic', color: 'var(--rose)', margin: '0.2rem 0 1rem', fontSize: '1.7rem' }}
            >
              {def.title}
            </h3>

            {!won && Game && <Game onWin={handleWin} />}

            <AnimatePresence>
              {won && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ textAlign: 'center', padding: '0.5rem 0' }}
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 11 }}
                    style={{ fontSize: '3.4rem', filter: 'drop-shadow(0 0 12px rgba(255,120,160,0.7))' }}
                  >
                    💗
                  </motion.div>
                  <p className="font-serif" style={{ fontStyle: 'italic', fontSize: '1.25rem', color: 'var(--ink)', margin: '0.6rem 0 1.2rem' }}>
                    {def.reward}
                  </p>
                  <button
                    onClick={closeGame}
                    style={{
                      padding: '0.6rem 1.4rem',
                      borderRadius: '0.8rem',
                      border: 'none',
                      background: 'var(--rose)',
                      color: '#fff',
                      fontFamily: 'Quicksand, sans-serif',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Collect this memory 💗
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
