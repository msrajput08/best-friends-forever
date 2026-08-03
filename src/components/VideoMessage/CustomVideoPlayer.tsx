import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Maximize, Volume2, VolumeX } from 'lucide-react';
import { soundEngine } from '../../utils/sound';

interface CustomVideoPlayerProps {
  videoUrl: string;
  posterUrl?: string;
  onEnded: () => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

export const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({
  videoUrl,
  posterUrl,
  onEnded,
  onPlayStateChange,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Auto hide controls after inactivity when playing
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isPlaying && !hasError) {
      timeout = setTimeout(() => {
        setShowControls(false);
      }, 2500);
    } else {
      setShowControls(true);
    }
    return () => clearTimeout(timeout);
  }, [isPlaying, showControls, hasError]);

  const togglePlay = () => {
    if (hasError) {
      // Simulate playback for placeholder fallback
      if (!isPlaying) {
        setIsPlaying(true);
        onPlayStateChange?.(true);
        soundEngine.stopAllSound();
        // Simulate completion after 5 seconds for fallback
        setTimeout(() => {
          setIsPlaying(false);
          onPlayStateChange?.(false);
          onEnded();
        }, 5000);
      } else {
        setIsPlaying(false);
        onPlayStateChange?.(false);
      }
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      soundEngine.stopAllSound();
      video.play().catch(() => {
        setHasError(true);
      });
      setIsPlaying(true);
      onPlayStateChange?.(true);
    } else {
      video.pause();
      setIsPlaying(false);
      onPlayStateChange?.(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    const current = video.currentTime;
    const duration = video.duration || 1;
    setProgress((current / duration) * 100);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const seekTime = (parseFloat(e.target.value) / 100) * (video.duration || 1);
    video.currentTime = seekTime;
    setProgress(parseFloat(e.target.value));
  };

  const handleReplay = () => {
    if (hasError) {
      setIsPlaying(true);
      onPlayStateChange?.(true);
      setTimeout(() => {
        setIsPlaying(false);
        onPlayStateChange?.(false);
        onEnded();
      }, 5000);
      return;
    }

    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    soundEngine.stopAllSound();
    video.play().catch(() => setHasError(true));
    setIsPlaying(true);
    onPlayStateChange?.(true);
  };

  const handleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (container.requestFullscreen) {
      container.requestFullscreen();
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    onPlayStateChange?.(false);
    onEnded();
  };

  const handleMediaError = () => {
    setHasError(true);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={() => setShowControls(true)}
      onClick={() => setShowControls(true)}
      className="relative w-full h-full rounded-2xl overflow-hidden bg-black flex items-center justify-center group select-none"
    >
      {!hasError ? (
        <video
          ref={videoRef}
          src={videoUrl}
          poster={posterUrl}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnded}
          onError={handleMediaError}
          onClick={togglePlay}
          playsInline
          crossOrigin="anonymous"
          className="w-auto h-auto max-w-full max-h-full object-contain cursor-pointer"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-neutral-900 via-amber-950/40 to-neutral-900 p-6 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
            🎬
          </div>
          <p className="font-cinzel text-lg font-bold text-amber-200">
            Placeholder Video Stream
          </p>
          <p className="font-cormorant text-sm italic text-amber-100/70 max-w-sm">
            Developer will upload the actual video file here later.
          </p>
          <button
            onClick={togglePlay}
            className="px-5 py-2 rounded-full bg-amber-500 text-neutral-950 font-sans font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform"
          >
            {isPlaying ? 'Playing Demo Stream...' : 'Play Placeholder Video'}
          </button>
        </div>
      )}

      {/* Center Big Play Button Overlay when paused */}
      {!isPlaying && (
        <button
          onClick={togglePlay}
          aria-label="Play Video"
          className="absolute z-20 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-500/90 border-2 border-amber-200 text-neutral-950 flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.6)] hover:scale-110 active:scale-95 transition-all duration-300"
        >
          <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-neutral-950 translate-x-0.5" />
        </button>
      )}

      {/* Bottom Minimal Custom Controls Bar */}
      <div
        className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 flex flex-col space-y-2 z-20 transition-opacity duration-300 ${
          showControls || !isPlaying ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Seek Progress Bar */}
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
          aria-label="Video progress"
          className="w-full h-1.5 bg-neutral-700/80 rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-none"
        />

        {/* Buttons Row */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center space-x-3">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
              className="p-1.5 rounded-lg bg-neutral-800/80 text-amber-200 hover:text-white hover:bg-neutral-700 transition-colors"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-amber-200" />}
            </button>

            {/* Replay */}
            <button
              onClick={handleReplay}
              title="Replay Video"
              aria-label="Replay video"
              className="p-1.5 rounded-lg bg-neutral-800/80 text-amber-200 hover:text-white hover:bg-neutral-700 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            {/* Mute Toggle */}
            <button
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute video' : 'Mute video'}
              className="p-1.5 rounded-lg bg-neutral-800/80 text-amber-200 hover:text-white hover:bg-neutral-700 transition-colors"
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>

          <div>
            {/* Fullscreen */}
            <button
              onClick={handleFullscreen}
              aria-label="Toggle fullscreen"
              className="p-1.5 rounded-lg bg-neutral-800/80 text-amber-200 hover:text-white hover:bg-neutral-700 transition-colors"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
