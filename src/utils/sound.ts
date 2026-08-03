// Web Audio API Synthesizer for Cinematic Sound Effects

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private ambientGain: GainNode | null = null;
  private ambientOsc1: OscillatorNode | null = null;
  private ambientOsc2: OscillatorNode | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.ambientGain) {
      this.ambientGain.gain.setTargetAtTime(
        this.isMuted ? 0 : 0.08,
        this.ctx?.currentTime || 0,
        0.1
      );
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Soft ambient drone for curiosity & mystery
  public startAmbientHum() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      if (this.ambientGain) return; // already playing

      const now = this.ctx.currentTime;
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0, now);
      this.ambientGain.gain.linearRampToValueAtTime(0.08, now + 3);

      this.ambientOsc1 = this.ctx.createOscillator();
      this.ambientOsc2 = this.ctx.createOscillator();

      this.ambientOsc1.type = 'sine';
      this.ambientOsc1.frequency.setValueAtTime(55, now); // Low A

      this.ambientOsc2.type = 'triangle';
      this.ambientOsc2.frequency.setValueAtTime(110.5, now); // Slightly detuned A

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(250, now);

      this.ambientOsc1.connect(filter);
      this.ambientOsc2.connect(filter);
      filter.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      this.ambientOsc1.start(now);
      this.ambientOsc2.start(now);
    } catch (e) {
      console.warn('Audio start ambient error:', e);
    }
  }

  // Heartbeat pulse for countdown numbers (5,4,3,2,1)
  public playHeartbeat(count: number) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Frequency rises slightly from 5 -> 1
      const pitchOffset = (5 - count) * 4;

      // Primary thump
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(60 + pitchOffset, now);
      osc.frequency.exponentialRampToValueAtTime(25, now + 0.18);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);

      // Secondary heartbeat echo
      setTimeout(() => {
        if (!this.ctx || this.isMuted) return;
        const now2 = this.ctx.currentTime;
        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(50 + pitchOffset, now2);
        osc2.frequency.exponentialRampToValueAtTime(20, now2 + 0.15);

        gain2.gain.setValueAtTime(0.18, now2);
        gain2.gain.exponentialRampToValueAtTime(0.001, now2 + 0.18);

        osc2.connect(gain2);
        gain2.connect(this.ctx.destination);

        osc2.start(now2);
        osc2.stop(now2 + 0.2);
      }, 140);
    } catch (e) {
      console.warn('Heartbeat audio error:', e);
    }
  }

  // Instant complete silence at 0
  public stopAllSound() {
    try {
      if (this.ctx) {
        if (this.ambientGain) {
          const now = this.ctx.currentTime;
          this.ambientGain.gain.cancelScheduledValues(now);
          this.ambientGain.gain.setValueAtTime(0.0001, now);
        }
        if (this.ambientOsc1) {
          this.ambientOsc1.stop();
          this.ambientOsc1 = null;
        }
        if (this.ambientOsc2) {
          this.ambientOsc2.stop();
          this.ambientOsc2 = null;
        }
        this.ambientGain = null;
      }
    } catch (e) {
      console.warn('Stop sound error:', e);
    }
  }

  // Magical Energy Burst / Wall Shatter
  public playEnergyBurst() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Sub-bass rumble sweep
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(140, now);
      subOsc.frequency.exponentialRampToValueAtTime(30, now + 1.2);

      subGain.gain.setValueAtTime(0.35, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 1.5);

      // Crystalline shimmer / celestial sparkle chords
      const frequencies = [523.25, 659.25, 783.99, 1046.5, 1318.5]; // C E G C E
      frequencies.forEach((freq, idx) => {
        if (!this.ctx) return;
        const chime = this.ctx.createOscillator();
        const chimeGain = this.ctx.createGain();
        chime.type = 'triangle';
        chime.frequency.setValueAtTime(freq, now + idx * 0.08);

        chimeGain.gain.setValueAtTime(0, now + idx * 0.08);
        chimeGain.gain.linearRampToValueAtTime(0.08, now + idx * 0.08 + 0.1);
        chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 2.0);

        chime.connect(chimeGain);
        chimeGain.connect(this.ctx.destination);

        chime.start(now + idx * 0.08);
        chime.stop(now + idx * 0.08 + 2.1);
      });
    } catch (e) {
      console.warn('Energy burst audio error:', e);
    }
  }

  // Soft sparkle for letter reveals
  public playLetterShimmer() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const randFreq = 600 + Math.random() * 800;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(randFreq, now);
      osc.frequency.exponentialRampToValueAtTime(randFreq * 1.5, now + 0.12);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch (e) {
      console.warn('Letter shimmer sound error:', e);
    }
  }

  // Firework launch & gold burst
  public playFireworkLaunch() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Launch whoosh
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.4);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);

      // Burst gold sparkle
      setTimeout(() => {
        if (!this.ctx || this.isMuted) return;
        const now2 = this.ctx.currentTime;
        const burstFreqs = [800, 1200, 1600];
        burstFreqs.forEach((f) => {
          if (!this.ctx) return;
          const bOsc = this.ctx.createOscillator();
          const bGain = this.ctx.createGain();
          bOsc.type = 'triangle';
          bOsc.frequency.setValueAtTime(f + Math.random() * 200, now2);

          bGain.gain.setValueAtTime(0.06, now2);
          bGain.gain.exponentialRampToValueAtTime(0.001, now2 + 0.8);

          bOsc.connect(bGain);
          bGain.connect(this.ctx.destination);
          bOsc.start(now2);
          bOsc.stop(now2 + 0.85);
        });
      }, 420);
    } catch (e) {
      console.warn('Firework audio error:', e);
    }
  }

  // User click/touch trigger feedback
  public playClickSound() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch (e) {
      console.warn('Click audio error:', e);
    }
  }

  // Vault rejection shake & clunk
  public playVaultError() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.3);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(180, now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {
      console.warn('Vault error sound error:', e);
    }
  }

  // Vault unlock metallic gears & latch click
  public playVaultUnlock() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Heavy gear rotation clicks
      for (let i = 0; i < 4; i++) {
        const clickOsc = this.ctx.createOscillator();
        const clickGain = this.ctx.createGain();
        clickOsc.type = 'triangle';
        clickOsc.frequency.setValueAtTime(300 - i * 40, now + i * 0.12);

        clickGain.gain.setValueAtTime(0.12, now + i * 0.12);
        clickGain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.08);

        clickOsc.connect(clickGain);
        clickGain.connect(this.ctx.destination);
        clickOsc.start(now + i * 0.12);
        clickOsc.stop(now + i * 0.12 + 0.09);
      }

      // Final heavy latch unlock bang
      setTimeout(() => {
        if (!this.ctx || this.isMuted) return;
        const now2 = this.ctx.currentTime;
        const heavyOsc = this.ctx.createOscillator();
        const heavyGain = this.ctx.createGain();
        heavyOsc.type = 'sine';
        heavyOsc.frequency.setValueAtTime(120, now2);
        heavyOsc.frequency.exponentialRampToValueAtTime(30, now2 + 0.5);

        heavyGain.gain.setValueAtTime(0.3, now2);
        heavyGain.gain.exponentialRampToValueAtTime(0.001, now2 + 0.5);

        heavyOsc.connect(heavyGain);
        heavyGain.connect(this.ctx.destination);
        heavyOsc.start(now2);
        heavyOsc.stop(now2 + 0.5);
      }, 500);
    } catch (e) {
      console.warn('Vault unlock sound error:', e);
    }
  }

  // Heavy vault doors opening rumble & golden glow hum
  public playDoorsOpen() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Low friction rumble
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(45, now);
      osc.frequency.linearRampToValueAtTime(25, now + 1.8);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(120, now);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.8);
    } catch (e) {
      console.warn('Doors open sound error:', e);
    }
  }

  // Wax seal crack sound
  public playWaxCrack() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {
      console.warn('Wax crack sound error:', e);
    }
  }

  // Envelope slide sound
  public playEnvelopeSlide() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.linearRampToValueAtTime(500, now + 0.3);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {
      console.warn('Envelope slide sound error:', e);
    }
  }
  // Bubble pop sound (soft aquatic pop)
  public playBubblePop() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.04);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.09);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {
      console.warn('Bubble pop sound error:', e);
    }
  }

  // Soft page flip sound
  public playPageFlip() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.12);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
      // ignore
    }
  }
}

export const soundEngine = new SoundEngine();
