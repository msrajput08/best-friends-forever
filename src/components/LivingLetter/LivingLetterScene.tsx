import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PenTool, Check, Sparkles, Feather, Clock } from 'lucide-react';
import { DeskEnvironment } from './DeskEnvironment';
import { WaxSealAnimation } from './WaxSealAnimation';
import { LetterRecord } from '../../types';
import { fetchLatestLetter, saveLetter } from '../../lib/supabase';
import { soundEngine } from '../../utils/sound';
import { InteractionHint } from '../common/InteractionHint';

export interface LivingLetterSceneProps {
  sceneId: 'SCENE_6' | 'SCENE_7';
  author: string;
  recipient: string;
  authorTitle: string;
  chapterBadge: string;
  defaultContent: string;
  canEdit?: boolean;
  onComplete: () => void;
}

type ScenePhase =
  | 'TRANSITION_FRAGMENTS'
  | 'ENVELOPE_ARRIVE'
  | 'ENVELOPE_OPEN'
  | 'READ_MODE'
  | 'EDIT_MODE'
  | 'SAVING'
  | 'SAVE_SUCCESS'
  | 'COMPLETED';

export const LivingLetterScene: React.FC<LivingLetterSceneProps> = ({
  author,
  recipient,
  authorTitle,
  chapterBadge,
  defaultContent,
  canEdit = true,
  onComplete,
}) => {
  const [phase, setPhase] = useState<ScenePhase>('TRANSITION_FRAGMENTS');
  const [letterRecord, setLetterRecord] = useState<LetterRecord | null>(null);
  const [editorText, setEditorText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showContinuePrompt, setShowContinuePrompt] = useState<boolean>(false);

  // Load initial letter data from Supabase / local cache
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      const data = await fetchLatestLetter(author, defaultContent, recipient);
      if (isMounted) {
        setLetterRecord(data);
        setEditorText(data.content);
        setIsLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [author, defaultContent, recipient]);

  // Scene entrance sequence: Fragments -> Envelope -> Open Paper
  useEffect(() => {
    if (phase === 'TRANSITION_FRAGMENTS') {
      const timer = setTimeout(() => {
        soundEngine.playDoorsOpen();
        setPhase('ENVELOPE_ARRIVE');
      }, 1000);
      return () => clearTimeout(timer);
    }

    if (phase === 'ENVELOPE_ARRIVE') {
      const timer = setTimeout(() => {
        soundEngine.playPageFlip();
        setPhase('ENVELOPE_OPEN');
      }, 900);
      return () => clearTimeout(timer);
    }

    if (phase === 'ENVELOPE_OPEN') {
      const timer = setTimeout(() => {
        setPhase('READ_MODE');
      }, 1100);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const handleOpenEditor = () => {
    soundEngine.playPageFlip();
    setPhase('EDIT_MODE');
  };

  const handleSaveLetter = async () => {
    if (!editorText.trim()) return;

    soundEngine.playClickSound();
    setPhase('SAVING');

    // Simulate fountain pen stroke / ink drying duration
    setTimeout(async () => {
      const updated = await saveLetter(author, recipient, editorText);
      setLetterRecord(updated);
      soundEngine.playVaultUnlock();
      setPhase('SAVE_SUCCESS');

      setTimeout(() => {
        setPhase('READ_MODE');
      }, 1800);
    }, 1200);
  };

  const handleTriggerCompletion = () => {
    if (showContinuePrompt) return;
    soundEngine.playClickSound();
    setShowContinuePrompt(true);
  };

  const handleContinueClick = () => {
    if (!showContinuePrompt) return;
    soundEngine.playClickSound();
    setPhase('COMPLETED');
    onComplete();
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'Just now';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Just now';
    }
  };

  return (
    <DeskEnvironment>
      {/* Header Badge & Title */}
      <div className="text-center mt-2 mb-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-400/30 px-4 py-1 rounded-full text-xs font-sans font-bold tracking-widest text-amber-300 uppercase mb-2"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{chapterBadge}</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-extrabold text-amber-100 tracking-wider text-glow-gold"
        >
          {authorTitle}
        </motion.h2>
      </div>

      {/* ENVELOPE / FRAGMENT TRANSITION STATES */}
      {(phase === 'TRANSITION_FRAGMENTS' || phase === 'ENVELOPE_ARRIVE' || phase === 'ENVELOPE_OPEN') && (
        <div className="w-full min-h-[400px] flex flex-col items-center justify-center my-10">
          <AnimatePresence mode="wait">
            {phase === 'TRANSITION_FRAGMENTS' && (
              <motion.div
                key="fragments"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="flex flex-col items-center space-y-4 text-center"
              >
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-amber-400/30 border-t-amber-300 animate-spin" />
                  <Feather className="w-10 h-10 text-amber-300 animate-bounce" />
                </div>
                <p className="font-cormorant text-xl italic text-amber-200">
                  Assembling writing desk & paper fragments...
                </p>
              </motion.div>
            )}

            {(phase === 'ENVELOPE_ARRIVE' || phase === 'ENVELOPE_OPEN') && (
              <motion.div
                key="envelope"
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 1.05 }}
                transition={{ duration: 0.8 }}
                className="relative w-72 sm:w-96 aspect-[7/5] bg-gradient-to-br from-amber-100 via-stone-200 to-amber-200 border-2 border-amber-300/80 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] p-6 flex flex-col items-center justify-center text-center overflow-hidden"
              >
                {/* Envelope Flap Triangle */}
                <div className="absolute top-0 inset-x-0 h-24 bg-amber-200/90 border-b-2 border-amber-300/70 shadow-md clip-triangle flex justify-center items-start pt-2">
                  <WaxSealAnimation />
                </div>

                <div className="pt-16 space-y-1">
                  <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-amber-900/60">
                    Sealed Letter For
                  </p>
                  <p className="font-cormorant text-2xl font-bold text-neutral-900 italic">
                    {recipient}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* READ MODE & EDIT MODE */}
      {(phase === 'READ_MODE' || phase === 'EDIT_MODE' || phase === 'SAVING' || phase === 'SAVE_SUCCESS') && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative w-full max-w-2xl bg-amber-50/95 text-neutral-900 rounded-2xl shadow-[0_30px_70px_rgba(0,0,0,0.8)] border-4 border-amber-200/80 p-4 sm:p-8 md:p-10 my-2 sm:my-4 flex flex-col justify-between scene-card custom-scrollbar"
          style={{
            backgroundImage:
              'radial-gradient(#d97706 0.5px, transparent 0.5px), radial-gradient(#d97706 0.5px, #fffbeb 0.5px)',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 10px 10px',
            opacity: 0.98,
          }}
        >
          {/* Parchment Aged Edges Frame */}
          <div className="absolute inset-0 border-[12px] border-amber-100/40 pointer-events-none rounded-2xl" />

          {/* Paper Header */}
          <div className="w-full border-b-2 border-amber-300/60 pb-4 mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Feather className="w-5 h-5 text-amber-800" />
              <span className="font-sans text-xs font-extrabold uppercase tracking-widest text-amber-900/80">
                {phase === 'EDIT_MODE' ? 'Writing Sheet' : 'Living Letter'}
              </span>
            </div>

            <div className="flex items-center space-x-1.5 text-xs font-sans text-amber-900/70 font-semibold">
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              <span>{formatDate(letterRecord?.updated_at)}</span>
            </div>
          </div>

          {/* Parchment Body Content */}
          <div className="flex-1 overflow-y-auto py-2 pr-2 custom-scrollbar">
            {phase === 'EDIT_MODE' || phase === 'SAVING' ? (
              <div className="w-full flex flex-col space-y-4">
                <textarea
                  value={editorText}
                  onChange={(e) => setEditorText(e.target.value)}
                  placeholder="Dear friend, write your heartfelt letter here..."
                  disabled={phase === 'SAVING'}
                  rows={8}
                  className="w-full bg-transparent border-none text-neutral-900 font-cormorant text-xl sm:text-2xl leading-relaxed italic focus:outline-none resize-none placeholder-amber-800/40"
                />

                {/* Live Formatted Handwritten Preview Box */}
                <div className="pt-4 border-t border-amber-300/50">
                  <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-amber-800/60 block mb-1">
                    Live Handwritten Preview:
                  </span>
                  <p className="font-cormorant text-lg sm:text-xl italic font-semibold text-neutral-800 whitespace-pre-wrap leading-relaxed">
                    {editorText || '(Your letter preview will appear here as you type...)'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="prose prose-amber max-w-none">
                <p className="font-cormorant text-xl sm:text-2xl md:text-3xl font-medium text-neutral-900 italic leading-relaxed whitespace-pre-wrap">
                  {isLoading
                    ? 'Retrieving letter from cloud storage...'
                    : letterRecord?.content || defaultContent}
                </p>
              </div>
            )}
          </div>

          {/* Saving Ink Dry Animation Overlay */}
          <AnimatePresence>
            {phase === 'SAVING' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-amber-100/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-3 z-30"
              >
                <WaxSealAnimation isSaving={true} />
                <p className="font-cormorant text-2xl font-bold text-amber-950 italic">
                  Drying ink & applying wax seal...
                </p>
              </motion.div>
            )}

            {phase === 'SAVE_SUCCESS' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-amber-50/95 flex flex-col items-center justify-center p-6 text-center space-y-3 z-30"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-700 flex items-center justify-center shadow-lg">
                  <Check className="w-8 h-8" />
                </div>
                <p className="font-cinzel text-xl font-bold text-amber-950">
                  Letter Safely Preserved
                </p>
                <p className="font-cormorant text-base italic text-amber-900/80">
                  Synchronized with the cloud for both friends to cherish.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Paper Footer / Author & Controls */}
          <div className="w-full border-t-2 border-amber-300/60 pt-4 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-sans text-[10px] uppercase font-bold tracking-widest text-amber-900/60">
                Author
              </p>
              <p className="font-cormorant text-xl font-bold text-neutral-900 italic">
                — {author}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              {phase === 'READ_MODE' && canEdit && (
                <button
                  onClick={handleOpenEditor}
                  className="px-5 py-2.5 rounded-xl bg-amber-900 text-amber-100 hover:bg-amber-800 font-sans text-xs font-bold uppercase tracking-widest shadow-md transition-all flex items-center space-x-2"
                >
                  <PenTool className="w-4 h-4" />
                  <span>Write a New Letter</span>
                </button>
              )}

              {phase === 'EDIT_MODE' && (
                <>
                  <button
                    onClick={() => setPhase('READ_MODE')}
                    className="px-4 py-2 rounded-xl border border-amber-900/40 text-amber-900 hover:bg-amber-200/50 font-sans text-xs font-bold uppercase tracking-widest transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveLetter}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-amber-100 font-sans text-xs font-bold uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center space-x-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Letter</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* SCENE COMPLETION & QUOTE */}
      <div className="w-full mt-6 mb-4 flex flex-col items-center justify-center text-center">
        {phase === 'READ_MODE' && !showContinuePrompt && (
          <button
            onClick={handleTriggerCompletion}
            className="px-6 py-2 rounded-full border border-amber-400/30 bg-amber-500/10 text-amber-200 font-sans text-xs font-semibold tracking-widest uppercase hover:bg-amber-500/20 transition-all"
          >
            Finished Reading Letter →
          </button>
        )}

        {showContinuePrompt && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4 py-4 flex flex-col items-center"
          >
            <p className="font-cormorant text-2xl sm:text-3xl italic font-semibold text-amber-200 text-glow-gold">
              &ldquo;When words come from the heart, they never fade.&rdquo;
            </p>

            <InteractionHint
              label="Step Into The Covenant"
              variant="feather"
              onClick={handleContinueClick}
            />
          </motion.div>
        )}
      </div>
    </DeskEnvironment>
  );
};
