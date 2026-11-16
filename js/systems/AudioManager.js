const AUDIO_SETTINGS_KEY = "fishingworld_audio_settings";

export class AudioManager {
    constructor() {
        this.audioContext = null;
        this.muted = false;
        this.volume = 0.7;
        this.loadSettings();
    }

    loadSettings() {
        try {
            const raw = window.localStorage.getItem(AUDIO_SETTINGS_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw);
            if (typeof parsed.muted === "boolean") this.muted = parsed.muted;
            if (Number.isFinite(Number(parsed.volume))) {
                this.volume = Math.max(0, Math.min(1, Number(parsed.volume)));
            }
        } catch {
            // ignore storage errors
        }
    }

    saveSettings() {
        try {
            window.localStorage.setItem(
                AUDIO_SETTINGS_KEY,
                JSON.stringify({ muted: this.muted, volume: this.volume })
            );
        } catch {
            // ignore storage errors
        }
    }

    setMuted(muted) {
        this.muted = Boolean(muted);
        this.saveSettings();
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, Number(volume) || 0));
        this.saveSettings();
    }

    playSound(frequency, duration, type) {
        if (this.muted || this.volume <= 0.01) return;

        const AudioContextClass =
            window.AudioContext || window.webkitAudioContext;

        if (!AudioContextClass) return;

        if (!this.audioContext) {
            this.audioContext = new AudioContextClass();
        }

        if (this.audioContext.state === "suspended") {
            this.audioContext.resume();
        }

        const oscillator = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        oscillator.type = type;
        oscillator.frequency.value = frequency;

        const peakGain = 0.2 * this.volume;
        gain.gain.setValueAtTime(
            peakGain,
            this.audioContext.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            this.audioContext.currentTime + duration
        );

        oscillator.connect(gain);
        gain.connect(this.audioContext.destination);

        oscillator.start();

        oscillator.stop(
            this.audioContext.currentTime + duration
        );
    }

    playHitSound() {
        this.playSound(750, 0.15, "sine");
    }

    playMissSound() {
        this.playSound(180, 0.3, "triangle");
    }

    playCatchSound() {
        this.playSound(900, 0.15, "sine");

        setTimeout(() => {
            this.playSound(1200, 0.25, "sine");
        }, 150);
    }
}