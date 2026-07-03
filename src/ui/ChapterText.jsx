import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '../store/useStore.js';
import { chapters } from '../data/story.js';
import { chapterFocus, INTRO_LEAD } from '../scene/journey.js';

// Shows the current chapter's title + love note, fading in as each island
// reaches focus and out at the transitions between islands.
export default function ChapterText() {
  const scroll = useStore((s) => s.scroll);

  const { idx, centered } = chapterFocus(scroll, chapters.length);

  // hide during the intro (which owns the very top of the scroll)
  const show = scroll > INTRO_LEAD * 0.7 && centered > 0.02;
  const ch = chapters[idx];

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: '7vh',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 15,
        pointerEvents: 'none',
        padding: '0 1rem',
      }}
    >
      <AnimatePresence mode="wait">
        {show && ch && (
          <motion.div
            key={ch.id}
            className="glass-card"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: centered, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{ maxWidth: 600, textAlign: 'center', padding: '1.2rem 1.8rem' }}
          >
            <div className="eyebrow">
              chapter {idx + 1} · {chapters.length}
            </div>
            <h2
              className="font-title"
              style={{
                fontSize: 'clamp(1.7rem, 4vw, 2.6rem)',
                fontStyle: 'italic',
                fontWeight: 600,
                color: 'var(--rose)',
                margin: '0.3rem 0 0.55rem',
                lineHeight: 1.1,
              }}
            >
              {ch.title}
            </h2>
            <p
              className="font-serif"
              style={{ fontSize: '1.2rem', fontStyle: 'italic', lineHeight: 1.5, color: 'var(--ink)', margin: 0 }}
            >
              {ch.note}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
