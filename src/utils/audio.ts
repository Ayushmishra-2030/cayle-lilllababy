/**
 * Audio Synthesizer and Speech Engine using Web Audio API and SpeechSynthesis.
 * Reliable, lightweight, works offline without external audio files.
 */

class SoundController {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // AudioContext is initialized on first user interaction to comply with browser policies
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  private initContext(): AudioContext | null {
    if (this.isMuted) return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Play a delicate music-box celestial chime
   */
  public playChime(freq = 880, duration = 0.5, type: OscillatorType = 'sine') {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      // Slight pitch sparkle
      osc.frequency.exponentialRampToValueAtTime(freq * 1.05, ctx.currentTime + duration * 0.2);
      osc.frequency.exponentialRampToValueAtTime(freq, ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio fallback silent fail
    }
  }

  /**
   * Star collection sound (ascending arpeggio)
   */
  public playStarCatch() {
    if (this.isMuted) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      setTimeout(() => this.playChime(freq, 0.35, 'triangle'), i * 65);
    });
  }

  /**
   * Sparkle sound
   */
  public playSparkle() {
    if (this.isMuted) return;
    const notes = [1318.5, 1567.98, 2093.0]; // E6, G6, C7
    notes.forEach((freq, i) => {
      setTimeout(() => this.playChime(freq, 0.25, 'sine'), i * 50);
    });
  }

  /**
   * Level up / Secret discovered celebratory chime
   */
  public playLevelUp() {
    if (this.isMuted) return;
    const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.5]; // A major fanfair
    notes.forEach((freq, i) => {
      setTimeout(() => this.playChime(freq, 0.45, 'triangle'), i * 85);
    });
  }

  /**
   * Soft button tap
   */
  public playTap() {
    if (this.isMuted) return;
    this.playChime(420, 0.08, 'sine');
  }

  /**
   * Scrapbook page turn sound (soft white noise swoosh)
   */
  public playPageTurn() {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      if (!ctx) return;
      const bufferSize = ctx.sampleRate * 0.15;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
    } catch {
      this.playTap();
    }
  }

  /**
   * Speak Caylee's lines using Web Speech Synthesis
   */
  public speak(
    text: string,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (err: unknown) => void
  ): boolean {
    if (this.isMuted) {
      if (onEnd) onEnd();
      return false;
    }
    if (!('speechSynthesis' in window)) {
      if (onError) onError('Speech synthesis not supported');
      return false;
    }

    try {
      window.speechSynthesis.cancel(); // Stop any pending speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.35; // cute, cheerful, higher pitch for Caylee
      utterance.volume = 0.9;

      // Try finding an English female or expressive voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Samantha') ||
            v.name.includes('Karen') ||
            v.name.includes('Zira') ||
            v.name.includes('Victoria') ||
            v.name.toLowerCase().includes('female'))
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => {
        if (onStart) onStart();
      };
      utterance.onend = () => {
        if (onEnd) onEnd();
      };
      utterance.onerror = (e) => {
        if (onError) onError(e);
      };

      window.speechSynthesis.speak(utterance);
      return true;
    } catch (err) {
      if (onError) onError(err);
      return false;
    }
  }

  public stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const sound = new SoundController();
