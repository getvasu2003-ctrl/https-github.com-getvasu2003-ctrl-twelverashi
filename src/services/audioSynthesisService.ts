// Audio and Speech Synthesis helper for 12Rashi Astrological Voice Notes & Daily Audio Fal

class AudioSynthesisService {
  private audioCtx: AudioContext | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  /**
   * Plays a resonant Vedic temple bell / brass bell chime
   */
  public playTempleBell(frequency: number = 528, durationSec: number = 2.0) {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Fundamental harmonic
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, now);
      // Slight pitch bend reminiscent of a temple ghanti
      osc.frequency.exponentialRampToValueAtTime(frequency * 0.98, now + durationSec);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + durationSec);
    } catch {
      // AudioContext fallback
    }
  }

  /**
   * Plays a sacred Om / conch shell (shankha) drone
   */
  public playSacredDrone(durationSec: number = 3.0) {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(136.1, now); // 136.1 Hz is standard Om frequency (Sadja)
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(272.2, now);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + durationSec);
      osc2.stop(now + durationSec);
    } catch {
      // Fallback
    }
  }

  /**
   * Speaks voice note or daily rashi fal narration using Web Speech API
   */
  public speakNarration(
    text: string,
    options?: {
      lang?: string;
      rate?: number;
      pitch?: number;
      onStart?: () => void;
      onEnd?: () => void;
      onBoundary?: (charIndex: number) => void;
    }
  ): boolean {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      return false;
    }

    try {
      window.speechSynthesis.cancel();

      // Play introductory bell chime
      this.playTempleBell(640, 1.2);

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options?.rate || 0.95; // Slightly measured, calm pandit cadence
      utterance.pitch = options?.pitch || 0.98;
      utterance.lang = options?.lang || 'hi-IN';

      // Pick an Indian or warm voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (v) =>
          v.lang.includes('hi') ||
          v.lang.includes('en-IN') ||
          v.name.includes('India') ||
          v.name.includes('Rishi') ||
          v.name.includes('Google हिन्दी')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      if (options?.onStart) utterance.onstart = options.onStart;
      if (options?.onEnd) utterance.onend = options.onEnd;
      if (options?.onBoundary) {
        utterance.onboundary = (e) => options.onBoundary?.(e.charIndex);
      }

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
      return true;
    } catch {
      return false;
    }
  }

  public stopSpeaking() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
    }
  }

  public isSpeaking(): boolean {
    if (typeof window === 'undefined' || !window.speechSynthesis) return false;
    return window.speechSynthesis.speaking;
  }
}

export const audioSynthesis = new AudioSynthesisService();
