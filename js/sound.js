/* ============================================================
   DevForge — Sound Effects Controller
   Provides clean, modern UI audio feedback
   ============================================================ */

(function () {
  'use strict';

  const SoundFX = {
    enabled: true,
    ctx: null,

    init() {
      // Toggle state from localStorage
      const saved = localStorage.getItem('devforge-sound');
      this.enabled = saved !== 'false';
      
      // Auto init AudioContext on first user interaction to bypass browser policies
      const initAudio = () => {
        if (!this.ctx) {
          this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
      };
      
      window.addEventListener('click', initAudio, { once: true });
      window.addEventListener('keydown', initAudio, { once: true });
    },

    toggle() {
      this.enabled = !this.enabled;
      localStorage.setItem('devforge-sound', this.enabled);
      return this.enabled;
    },

    // Play a gentle modern synth click (synthesized on the fly, no audio files needed!)
    playClick() {
      if (!this.enabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        // Short, high-frequency pop
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.08);
        
        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.08);
      } catch (e) {
        console.warn('Audio play failed', e);
      }
    },

    // Play a rewarding "success" sound (two-tone chord)
    playSuccess() {
      if (!this.enabled || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        
        // Tone 1
        const osc1 = this.ctx.createOscillator();
        const gain1 = this.ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(523.25, now); // C5
        osc1.frequency.setValueAtTime(659.25, now + 0.08); // E5
        gain1.gain.setValueAtTime(0.03, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc1.connect(gain1);
        gain1.connect(this.ctx.destination);
        osc1.start();
        osc1.stop(now + 0.3);

        // Tone 2
        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(783.99, now + 0.08); // G5
        gain2.gain.setValueAtTime(0.02, now + 0.08);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc2.connect(gain2);
        gain2.connect(this.ctx.destination);
        osc2.start();
        osc2.stop(now + 0.35);
      } catch (e) {
        console.warn('Audio play failed', e);
      }
    }
  };

  window.SoundFX = SoundFX;
  SoundFX.init();
})();
