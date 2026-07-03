import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore.js';
import { chapters } from '../data/story.js';
import { games } from '../games/registry.js';
import { chapterFocus, INTRO_LEAD } from '../scene/journey.js';

// A soft pill button that appears when you settle on an island that has a game.
export default function GamePrompt() {
  const scroll = useStore((s) => s.scroll);
  const freeCam = useStore((s) => s.freeCam);
  const activeGame = useStore((s) => s.activeGame);
  const gamesWon = useStore((s) => s.gamesWon);
  const openGame = useStore((s) => s.openGame);

  const { idx, centered } = chapterFocus(scroll, chapters.length);
  const ch = chapters[idx];
  const def = ch && games[ch.id];

  const show =
    !freeCam && !activeGame && scroll > INTRO_LEAD * 0.7 && centered > 0.5 && !!def;
  const won = ch && gamesWon[ch.id];

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: '25vh',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 16,
        pointerEvents: 'none',
      }}
    >
      <AnimatePresence>
        {show && (
          <motion.button
            key={ch.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            onClick={() => openGame(ch.id)}
            style={{
              pointerEvents: 'auto',
              padding: '0.6rem 1.5rem',
              borderRadius: '2rem',
              border: '1px solid rgba(199,154,75,0.5)',
              background: won ? 'rgba(255,251,246,0.7)' : 'var(--rose)',
              color: won ? 'var(--rose-deep)' : '#fff',
              fontFamily: 'Quicksand, sans-serif',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
              boxShadow: '0 8px 26px rgba(184,80,110,0.3)',
              backdropFilter: 'blur(6px)',
            }}
          >
            {won ? `✓ ${def.title} — play again` : `▶ Play · ${def.title}`}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
