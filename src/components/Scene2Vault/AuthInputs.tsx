import React, { useState } from 'react';
import { motion } from 'motion/react';
import { KeyRound, Sparkles } from 'lucide-react';
import { soundEngine } from '../../utils/sound';

interface AuthInputsProps {
  onUnlockAttempt: (date1: string, date2: string) => void;
  isUnlocking: boolean;
}

export const AuthInputs: React.FC<AuthInputsProps> = ({
  onUnlockAttempt,
  isUnlocking,
}) => {
  const [bday1, setBday1] = useState('');
  const [bday2, setBday2] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playClickSound();
    onUnlockAttempt(bday1, bday2);
  };

  const handleQuickAutofill = () => {
    soundEngine.playClickSound();
    setBday1('2004-11-08');
    setBday2('2004-03-28');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center w-full max-w-md px-6 z-30"
    >
      {/* Headlines */}
      <div className="text-center lg:text-left mb-6">
        <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-extrabold text-amber-200 tracking-wider text-glow-gold mb-2 select-none">
          Unlock Our Memory Vault
        </h2>
        <p className="font-cormorant text-base sm:text-lg md:text-xl italic text-amber-100/80 font-normal select-none">
          Only the two of us know the secret key.
        </p>
      </div>

      {/* Inputs Form */}
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        {/* Field 1: My Birthday */}
        <div className="relative w-full">
          <label htmlFor="vault-bday-1" className="block text-xs font-sans font-semibold uppercase tracking-widest text-amber-300/80 mb-1 pl-1">
            MS&apos;s Birthday
          </label>

          <input
            id="vault-bday-1"
            type="date"
            value={bday1}
            onChange={(e) => setBday1(e.target.value)}
            className="w-full bg-neutral-900/80 border border-amber-500/30 rounded-xl px-4 py-3 text-amber-100 placeholder-amber-400/30 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/30 transition-all duration-300 font-sans text-sm sm:text-base box-glow-gold"
          />
        </div>

        {/* Field 2: My Best Friend's Birthday */}
        <div className="relative w-full">
          <label htmlFor="vault-bday-2" className="block text-xs font-sans font-semibold uppercase tracking-widest text-amber-300/80 mb-1 pl-1">
            MINIIEE&apos;s Birthday
          </label>

          <input
            id="vault-bday-2"
            type="date"
            value={bday2}
            onChange={(e) => setBday2(e.target.value)}
            className="w-full bg-neutral-900/80 border border-amber-500/30 rounded-xl px-4 py-3 text-amber-100 placeholder-amber-400/30 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/30 transition-all duration-300 font-sans text-sm sm:text-base box-glow-gold"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isUnlocking}
          className="w-full mt-2 relative group overflow-hidden rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 border border-amber-300/50 py-3.5 px-6 font-sans text-sm sm:text-base font-bold tracking-widest uppercase text-neutral-950 shadow-lg shadow-amber-600/30 hover:shadow-amber-500/50 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <KeyRound className="w-4 h-4 text-neutral-950 group-hover:rotate-45 transition-transform duration-300" />
          <span>{isUnlocking ? 'Unlocking Vault...' : 'Unlock Memory Vault'}</span>
        </button>

        {/* Auto-fill demo helper */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={handleQuickAutofill}
            className="inline-flex items-center space-x-1.5 text-xs font-sans text-amber-300/60 hover:text-amber-200 transition-colors py-1 px-2 rounded-lg"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span></span>
          </button>
        </div>
      </form>
    </motion.div>
  );
};
