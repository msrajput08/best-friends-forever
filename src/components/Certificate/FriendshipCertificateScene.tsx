import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Sparkles, Check, RotateCcw, Download, Feather, ShieldCheck, Lock } from 'lucide-react';
import { CertificateRecord } from '../../types';
import { fetchCertificate, saveCertificate } from '../../lib/supabase';
import { soundEngine } from '../../utils/sound';
import { InteractionHint } from '../common/InteractionHint';
import { toPng } from 'html-to-image';

export interface FriendshipCertificateSceneProps {
  sceneId: 'SCENE_8' | 'SCENE_9';
  chapterBadge: string;
  title: string;
  awardName: string;
  presenter: string;
  recipient: string;
  signerName: string;
  bodyText: string;
  canSign?: boolean;
  onComplete: () => void;
}

type ScenePhase =
  | 'TRANSITION_UNFOLD'
  | 'VIEW_MODE'
  | 'SIGNING'
  | 'SAVING'
  | 'SAVE_SUCCESS';

export const FriendshipCertificateScene: React.FC<FriendshipCertificateSceneProps> = ({
  sceneId,
  chapterBadge,
  title,
  awardName,
  presenter,
  recipient,
  signerName,
  bodyText,
  canSign = true,
  onComplete,
}) => {
  const [phase, setPhase] = useState<ScenePhase>('TRANSITION_FRAGMENTS' as any);
  const [certRecord, setCertRecord] = useState<CertificateRecord | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showContinuePrompt, setShowContinuePrompt] = useState<boolean>(false);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [hasDrawn, setHasDrawn] = useState<boolean>(false);
  const [isReplacingSignature, setIsReplacingSignature] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const certContainerRef = useRef<HTMLDivElement | null>(null);
  const strokeHistoryRef = useRef<ImageData[]>([]);

  // Load existing signature data
  useEffect(() => {
    let isMounted = true;
    async function loadCert() {
      setIsLoading(true);
      const data = await fetchCertificate(sceneId, recipient);
      if (isMounted) {
        if (data) {
          setCertRecord(data);
        }
        setIsLoading(false);
      }
    }
    loadCert();
    return () => {
      isMounted = false;
    };
  }, [sceneId, recipient]);

  // Entrance unfolding animation timeline
  useEffect(() => {
    const timer = setTimeout(() => {
      soundEngine.playDoorsOpen();
      setPhase('VIEW_MODE');
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Initialize Canvas for signature
  useEffect(() => {
    if ((phase === 'VIEW_MODE' || phase === 'SIGNING') && canvasRef.current && !certRecord?.signatureData) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // High DPI canvas setup
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * 2;
        canvas.height = rect.height * 2;
        ctx.scale(2, 2);
        ctx.strokeStyle = '#27272a'; // Rich fountain pen ink color
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [phase, certRecord]);

  // Touch & Mouse Signature Event Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canSign || certRecord?.signatureData) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Save history step before new stroke
    strokeHistoryRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));

    setIsDrawing(true);
    setHasDrawn(true);

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canSign || certRecord?.signatureData) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      strokeHistoryRef.current = [];
      setHasDrawn(false);
      soundEngine.playPageFlip();
    }
  };

  const undoLastStroke = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx && strokeHistoryRef.current.length > 0) {
      const lastState = strokeHistoryRef.current.pop();
      if (lastState) {
        ctx.putImageData(lastState, 0, 0);
        if (strokeHistoryRef.current.length === 0) {
          setHasDrawn(false);
        }
        soundEngine.playPageFlip();
      }
    }
  };

  const handleSaveSignature = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasDrawn) return;

    soundEngine.playClickSound();
    setPhase('SAVING');

    const dataUrl = canvas.toDataURL('image/png');

    setTimeout(async () => {
      const saved = await saveCertificate(sceneId, signerName, dataUrl);
      setCertRecord(saved);
      setIsReplacingSignature(false);
      soundEngine.playVaultUnlock();
      setPhase('SAVE_SUCCESS');

      setTimeout(() => {
        setPhase('VIEW_MODE');
      }, 1500);
    }, 1200);
  };

  // Export certificate as PNG image
const handleExportPNG = async () => {
  if (!certContainerRef.current) return;

  try {
    soundEngine.playClickSound();

    // Wait for DOM rendering
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));

    const dataUrl = await toPng(certContainerRef.current, {
      cacheBust: true,
      pixelRatio: 3,
      backgroundColor: "#fffdfa",
      skipFonts: false,
    });

    const link = document.createElement("a");
    link.download = `Friendship_Certificate_${sceneId}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  } catch (err) {
    console.error("Certificate Download Error:", err);
    alert("Unable to export certificate.");
  }
};
  const handleTriggerCompletion = () => {
    if (showContinuePrompt) return;
    soundEngine.playClickSound();
    setShowContinuePrompt(true);
  };

  const handleContinueClick = () => {
    if (!showContinuePrompt) return;
    soundEngine.playClickSound();
    onComplete();
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    try {
      return new Date(isoString).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }
  };

  return (
    <div className="relative w-full h-full bg-[radial-gradient(ellipse_at_top,_rgba(88,28,135,0.35)_0%,_rgba(24,24,27,0.95)_75%,_rgba(9,9,11,1)_100%)] text-amber-100 flex flex-col items-center justify-between overflow-x-hidden overflow-y-auto select-none py-10 px-4 sm:px-6 md:px-8 pb-28 sm:pb-32">
      {/* Volumetric Gold / Purple Ambient Glow */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-96 sm:w-[600px] h-96 sm:h-[600px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-[220px_minmax(0,1fr)_220px] gap-8 xl:gap-10 items-center">
        {/* Left Desktop Rail: Ceremonial Trophy Crest */}
        <div className="hidden xl:flex flex-col items-center justify-self-end space-y-4 opacity-80">
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-amber-500/20 via-amber-900/40 to-stone-900 border-2 border-amber-400/40 p-4 shadow-2xl backdrop-blur-md flex items-center justify-center text-amber-300">
            <Award className="w-8 h-8" />
            <div className="absolute inset-0 rounded-full border border-amber-300/20 animate-pulse" />
          </div>
          <span className="font-cinzel text-xs font-bold tracking-widest text-amber-300/80 uppercase text-center">Lifelong Honor</span>
          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
          <span className="font-cormorant text-xs italic text-amber-300/50 text-center max-w-[9rem]">
            One of two matching certificates in this covenant
          </span>
        </div>

        {/* Center Main Certificate Area */}
        <div className="w-full flex flex-col items-center justify-self-center">
          {/* CHAPTER BADGE & HEADER */}
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
            className="font-cinzel text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-extrabold text-amber-100 tracking-wider text-glow-gold"
          >
            {title}
          </motion.h2>
        </div>

        {/* TRANSITION UNFOLDING ANIMATION */}
        {phase === ('TRANSITION_FRAGMENTS' as any) ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="w-full min-h-[450px] flex flex-col items-center justify-center my-8 text-center space-y-4"
          >
            <div className="relative w-24 h-24 flex items-center justify-center">
              <span className="absolute inset-0 rounded-full border-2 border-amber-400/30 border-t-amber-300 animate-spin" />
              <Award className="w-12 h-12 text-amber-300 animate-bounce" />
            </div>
            <p className="font-cormorant text-2xl italic text-amber-200">
              Unfolding the Golden Scroll of Honor...
            </p>
          </motion.div>
        ) : (
          /* LUXURY EMBOSSED CERTIFICATE CARD */
          <motion.div
            ref={certContainerRef}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="relative w-full max-w-3xl xl:max-w-4xl bg-[#fffdfa] text-neutral-900 rounded-2xl shadow-[0_30px_90px_rgba(0,0,0,0.85)] border-[8px] sm:border-[10px] border-amber-200/90 p-4 sm:p-8 md:p-12 my-2 sm:my-4 flex flex-col items-center text-center overflow-visible"
          >
            {/* Metallic Foil Ornamental Border & Corners */}
            <div className="absolute inset-3 border-2 border-amber-600/60 pointer-events-none rounded-xl" />
            <div className="absolute inset-4 border border-amber-400/40 pointer-events-none rounded-lg" />

            {/* Corner Filigree Ornaments */}
            <div className="absolute top-5 left-5 text-amber-700/60 font-serif text-xl pointer-events-none">❖</div>
            <div className="absolute top-5 right-5 text-amber-700/60 font-serif text-xl pointer-events-none">❖</div>
            <div className="absolute bottom-5 left-5 text-amber-700/60 font-serif text-xl pointer-events-none">❖</div>
            <div className="absolute bottom-5 right-5 text-amber-700/60 font-serif text-xl pointer-events-none">❖</div>

            {/* Header Crest Icon */}
            <div className="relative mb-4 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 via-amber-300 to-amber-600 p-0.5 shadow-lg flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-amber-50 flex items-center justify-center">
                  <Award className="w-8 h-8 text-amber-800" />
                </div>
              </div>
            </div>

            {/* Sub-Header */}
            <p className="font-sans text-[11px] font-extrabold uppercase tracking-[0.25em] text-amber-900/80 mb-2">
              Official Recognition of Enduring Friendship
            </p>

            {/* Award Title */}
            <h3 className="font-cinzel text-xl sm:text-2xl md:text-3xl font-extrabold text-amber-950 tracking-widest uppercase mb-4">
              {awardName}
            </h3>

            {/* Recipient Greeting */}
            <div className="my-2 space-y-1">
              <p className="font-cormorant text-lg italic text-neutral-700">
                This certificate is proudly presented by <span className="font-bold text-neutral-900">{presenter}</span> to:
              </p>
              <p className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-bold text-amber-900 underline decoration-amber-400/60 underline-offset-8">
                {recipient}
              </p>
            </div>

            {/* Certificate Citation Body */}
            <p
  className="
    w-full
    max-w-3xl
    mx-auto
    whitespace-pre-wrap
    break-words
    text-center
    font-cormorant
    text-lg
    sm:text-xl
    md:text-2xl
    italic
    leading-relaxed
    text-neutral-800
    my-6
  "
>
              &ldquo;{bodyText}&rdquo;
            </p>

            {/* Divider Line */}
            <div className="w-48 h-0.5 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent my-2" />

            {/* SIGNATURE & SEAL FOOTER AREA */}
            <div
  className="
    w-full
    mt-10
    grid
    grid-cols-1
    sm:grid-cols-2
    gap-10
    items-end
    text-center
    sm:text-left
  "
>
              {/* Date & Seal Side */}
              <div className="flex flex-col items-center sm:items-start space-y-2">
                <div className="flex items-center space-x-2 text-amber-900/80">
                  <ShieldCheck className="w-5 h-5 text-amber-700" />
                  <span className="font-sans text-xs font-bold uppercase tracking-wider">
                    Official Wax Seal & Issue Date
                  </span>
                </div>
                <p className="font-cormorant text-lg font-semibold text-neutral-900">
                  {formatDate(certRecord?.signedAt)}
                </p>
                <div className="inline-flex items-center space-x-1 px-3 py-1 bg-amber-100/80 border border-amber-300 rounded-full text-[10px] font-sans font-bold text-amber-900 tracking-wider uppercase">
                  <span>Status: {certRecord?.signatureData ? 'Authenticated & Sealed' : 'Awaiting Signature'}</span>
                </div>
              </div>

              {/* Signature Canvas / Display Side */}
              <div className="flex flex-col items-center sm:items-end">
                <p className="font-sans text-xs font-bold uppercase tracking-widest text-amber-900/80 mb-2">
                  Signed By: <span className="text-amber-950 font-extrabold">{signerName}</span>
                </p>

                {certRecord?.signatureData && !isReplacingSignature ? (
                  <>
    <div className="relative border-b-2 border-amber-800/60 pb-1 px-4 text-center min-w-[200px]">
      <img
        src={certRecord.signatureData}
        alt="Signature"
        className="h-16 object-contain filter drop-shadow-md mx-auto"
      />

      <span className="font-cormorant text-sm italic text-amber-900 block mt-1">
        Verified Digital Mark
      </span>
    </div>

    <button
      onClick={() => {
        setIsReplacingSignature(true);
        setHasDrawn(false);
      }}
      className="mt-3 px-3 py-1 rounded-lg bg-amber-800 text-white text-xs uppercase tracking-wider hover:bg-amber-900 transition"
    >
      Replace Signature
    </button>
  </>

                ) : (canSign || isReplacingSignature) ? (
                  /* Interactive Signature Canvas */
                  <div className="w-full max-w-[260px] flex flex-col items-center space-y-2">
                    <div className="relative w-full h-24 bg-amber-50/80 border-2 border-dashed border-amber-400 rounded-xl overflow-hidden shadow-inner cursor-crosshair">
                      <canvas
                        ref={canvasRef}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        className="w-full h-full touch-none"
                      />
                      {!hasDrawn && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-amber-800/40 font-cormorant text-sm italic">
                          Sign here with mouse or touch...
                        </div>
                      )}
                    </div>

                    {/* Canvas Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={undoLastStroke}
                        disabled={!hasDrawn}
                        title="Undo stroke"
                        className="p-1.5 rounded-lg border border-amber-400/50 text-amber-900 hover:bg-amber-100 disabled:opacity-40 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                      <button
    onClick={() => {
      setIsReplacingSignature(false);
      setHasDrawn(false);
    }}
    className="px-3 py-1 rounded-lg border border-gray-400 text-xs uppercase"
  >
    Cancel
  </button>
                      <button
                        onClick={clearCanvas}
                        disabled={!hasDrawn}
                        className="px-2.5 py-1 text-[10px] font-sans font-bold uppercase tracking-wider text-amber-900 border border-amber-400/50 rounded-lg hover:bg-amber-100 disabled:opacity-40 transition-colors"
                      >
                        Clear
                      </button>
                      <button
                        onClick={handleSaveSignature}
                        disabled={!hasDrawn}
                        className="px-3 py-1 text-[10px] font-sans font-bold uppercase tracking-wider bg-amber-800 text-amber-50 rounded-lg shadow hover:bg-amber-900 disabled:opacity-40 transition-all flex items-center space-x-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Protected view if only signer is permitted */
                  <div className="border border-amber-300 rounded-xl p-3 bg-amber-50 text-center text-xs font-sans text-amber-900">
                    <Lock className="w-4 h-4 mx-auto mb-1 text-amber-700" />
                    <span>Awaiting signature from {signerName}</span>
                  </div>
                )}
              </div>
            </div>

            {/* SAVING OVERLAY */}
            <AnimatePresence>
              {phase === 'SAVING' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-amber-50/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-3 z-30"
                >
                  <Award className="w-12 h-12 text-amber-700 animate-spin" />
                  <p className="font-cinzel text-xl font-bold text-amber-950">
                    Embossing Gold Seal & Synchronizing...
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
                    Certificate Official & Authenticated
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ACTION BUTTONS & COMPLETION PROMPT */}
        {phase !== ('TRANSITION_FRAGMENTS' as any) && (
          <div className="w-full mt-6 mb-4 flex flex-col items-center justify-center text-center space-y-4">
            <div className="flex items-center space-x-3">
              {certRecord?.signatureData && (
                <button
                  onClick={handleExportPNG}
                  className="px-5 py-2 rounded-xl bg-amber-900/80 border border-amber-400/40 text-amber-200 hover:bg-amber-800 font-sans text-xs font-bold uppercase tracking-widest shadow-md transition-all flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Certificate PNG</span>
                </button>
              )}

              {!showContinuePrompt && (
                <button
                  onClick={handleTriggerCompletion}
                  className="px-6 py-2 rounded-full border border-amber-400/30 bg-amber-500/10 text-amber-200 font-sans text-xs font-semibold tracking-widest uppercase hover:bg-amber-500/20 transition-all"
                >
                  Admire & Proceed →
                </button>
              )}
            </div>

            {showContinuePrompt && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-4 py-4 flex flex-col items-center"
              >
                <p className="font-cormorant text-2xl sm:text-3xl italic font-semibold text-amber-200 text-glow-gold">
                  &ldquo;Every friendship deserves to be remembered.&rdquo;
                </p>

                <InteractionHint
                  label="Carry This Honor Forward"
                  variant="orb"
                  onClick={handleContinueClick}
                />
              </motion.div>
            )}
          </div>
        )}
        </div>

        {/* Right Desktop Rail: Status-Aware Wax Seal */}
        <div className="hidden xl:flex flex-col items-center justify-self-start space-y-4 opacity-80">
          <motion.div
            animate={{
              boxShadow: certRecord?.signatureData
                ? ['0 0 20px rgba(245,158,11,0.4)', '0 0 40px rgba(245,158,11,0.7)', '0 0 20px rgba(245,158,11,0.4)']
                : '0 0 10px rgba(120,113,108,0.2)',
            }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-red-900/40 via-amber-900/40 to-stone-900 border-2 border-amber-400/40 p-4 backdrop-blur-md flex items-center justify-center text-amber-300"
          >
            <ShieldCheck className="w-8 h-8" />
          </motion.div>
          <span className="font-cinzel text-xs font-bold tracking-widest text-amber-300/80 uppercase text-center">Eternal Seal</span>
          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
          <span className="font-cormorant text-xs italic text-amber-300/50 text-center max-w-[9rem]">
            {certRecord?.signatureData ? 'Signed & authenticated' : 'Awaiting the signature'}
          </span>
        </div>
      </div>
    </div>
  );
};
