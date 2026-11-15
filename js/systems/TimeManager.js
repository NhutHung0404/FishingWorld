export class TimeManager {
    constructor() {
        // Thời gian khởi đầu: 08:00 AM (480 phút)
        this.gameMinutes = 8 * 60;
        // 1 giây thực = 1 phút game (1 ngày game = 24 phút thực)
        this.timeScale = 60;
        this.paused = false;
    }

    update(deltaTime) {
        if (this.paused) return;
        this.gameMinutes = (this.gameMinutes + (deltaTime * this.timeScale) / 60) % (24 * 60);
    }

    getHours() {
        return Math.floor(this.gameMinutes / 60);
    }

    getMinutes() {
        return Math.floor(this.gameMinutes % 60);
    }

    getPhase() {
        const hours = this.getHours();
        if (hours >= 5 && hours < 7) return "DAWN";
        if (hours >= 7 && hours < 17) return "DAY";
        if (hours >= 17 && hours < 19) return "DUSK";
        return "NIGHT";
    }

    getFormattedTime() {
        const h = String(this.getHours()).padStart(2, "0");
        const m = String(this.getMinutes()).padStart(2, "0");
        const phase = this.getPhase();

        let icon = "☀️";
        let phaseText = "Ban ngày";
        if (phase === "DAWN") {
            icon = "🌅";
            phaseText = "Bình minh";
        } else if (phase === "DUSK") {
            icon = "🌆";
            phaseText = "Hoàng hôn";
        } else if (phase === "NIGHT") {
            icon = "🌙";
            phaseText = "Ban đêm";
        }

        return `${icon} ${h}:${m} (${phaseText})`;
    }

    // Trả về mức độ tối [0.0..0.72] và màu sắc môi trường
    getAmbientLight() {
        const hours = this.getHours() + this.getMinutes() / 60;

        // Ban ngày sáng hoàn toàn
        if (hours >= 7 && hours < 17) {
            return { darkness: 0.0, color: "rgba(255, 255, 255, 1.0)" };
        }

        // Bình minh (05:00 -> 07:00)
        if (hours >= 5 && hours < 7) {
            const t = (hours - 5) / 2; // 0..1
            const darkness = 0.65 * (1 - t);
            return { darkness, color: "rgba(255, 200, 150, 0.8)" };
        }

        // Hoàng hôn (17:00 -> 19:00)
        if (hours >= 17 && hours < 19) {
            const t = (hours - 17) / 2; // 0..1
            const darkness = 0.65 * t;
            return { darkness, color: "rgba(255, 150, 100, 0.8)" };
        }

        // Ban đêm (19:00 -> 05:00)
        let darkness = 0.72;
        if (hours >= 19 && hours < 22) {
            const t = (hours - 19) / 3;
            darkness = 0.65 + 0.07 * t;
        } else if (hours >= 3 && hours < 5) {
            const t = (hours - 3) / 2;
            darkness = 0.72 - 0.07 * t;
        }

        return { darkness, color: "rgba(20, 25, 55, 0.9)" };
    }

    toJSON() {
        return { gameMinutes: this.gameMinutes };
    }

    fromJSON(data) {
        if (data && typeof data.gameMinutes === "number") {
            this.gameMinutes = data.gameMinutes;
        }
    }
}