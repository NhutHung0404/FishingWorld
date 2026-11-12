export class AudioManager {
    constructor() {
        this.audioContext = null;
    }

    playSound(frequency, duration, type) {
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

        gain.gain.setValueAtTime(
            0.15,
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