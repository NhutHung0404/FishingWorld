export class WeatherSystem {
    constructor() {
        this.type = "CLEAR"; // "CLEAR", "RAIN", "MIST"
        this.rainDrops = [];
        this.fireflies = [];
        this.weatherTimer = 0;
        this.initParticles();
    }

    initParticles() {
        // Khởi tạo mưa
        for (let i = 0; i < 120; i++) {
            this.rainDrops.push({
                x: Math.random() * 2000,
                y: Math.random() * 1400,
                length: 12 + Math.random() * 10,
                speed: 350 + Math.random() * 200,
                alpha: 0.3 + Math.random() * 0.4
            });
        }

        // Khởi tạo đom đóm
        for (let i = 0; i < 35; i++) {
            this.fireflies.push({
                x: 300 + Math.random() * 1200,
                y: 200 + Math.random() * 900,
                baseX: 0,
                baseY: 0,
                size: 2 + Math.random() * 2,
                alpha: Math.random(),
                pulseSpeed: 1 + Math.random() * 2,
                vx: (Math.random() - 0.5) * 15,
                vy: (Math.random() - 0.5) * 15
            });
        }
    }

    setWeather(type) {
        this.type = type;
    }

    update(deltaTime, worldWidth, worldHeight, timePhase) {
        this.weatherTimer += deltaTime;

        // Thay đổi thời tiết ngẫu nhiên sau mỗi vài phút game
        if (this.weatherTimer > 180) {
            this.weatherTimer = 0;
            const rand = Math.random();
            if (rand < 0.6) this.type = "CLEAR";
            else if (rand < 0.85) this.type = "RAIN";
            else this.type = "MIST";
        }

        // Cập nhật hạt mưa
        if (this.type === "RAIN") {
            for (const drop of this.rainDrops) {
                drop.y += drop.speed * deltaTime;
                drop.x -= (drop.speed * 0.2) * deltaTime; // Mưa rơi nghiêng nhẹ

                if (drop.y > worldHeight) {
                    drop.y = -20;
                    drop.x = Math.random() * (worldWidth + 400);
                }
            }
        }

        // Cập nhật đom đóm (chỉ xuất hiện ban đêm / hoàng hôn)
        if (timePhase === "NIGHT" || timePhase === "DUSK") {
            for (const ff of this.fireflies) {
                ff.x += ff.vx * deltaTime;
                ff.y += ff.vy * deltaTime;
                ff.alpha += Math.sin(this.weatherTimer * ff.pulseSpeed) * 0.02;

                if (ff.x < 100 || ff.x > worldWidth - 100) ff.vx *= -1;
                if (ff.y < 100 || ff.y > worldHeight - 100) ff.vy *= -1;
            }
        }
    }

    drawWeather(ctx, worldWidth, worldHeight, timePhase) {
        ctx.save();

        // Vẽ hạt mưa
        if (this.type === "RAIN") {
            ctx.strokeStyle = "rgba(180, 220, 255, 0.5)";
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            for (const drop of this.rainDrops) {
                ctx.moveTo(drop.x, drop.y);
                ctx.lineTo(drop.x - drop.length * 0.2, drop.y + drop.length);
            }
            ctx.stroke();
        }

        // Vẽ đom đóm khi về đêm
        if (timePhase === "NIGHT" || timePhase === "DUSK") {
            for (const ff of this.fireflies) {
                const a = Math.max(0.1, Math.min(0.9, Math.abs(Math.sin(ff.alpha))));
                ctx.fillStyle = `rgba(220, 255, 100, ${a})`;
                ctx.shadowColor = "#ccff00";
                ctx.shadowBlur = 8;
                ctx.beginPath();
                ctx.arc(ff.x, ff.y, ff.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Sương mù nhẹ
        if (this.type === "MIST") {
            ctx.fillStyle = "rgba(220, 230, 240, 0.12)";
            ctx.fillRect(0, 0, worldWidth, worldHeight);
        }

        ctx.restore();
    }

    getWeatherText() {
        if (this.type === "RAIN") return "🌧️ Mưa nhẹ";
        if (this.type === "MIST") return "🌫️ Sương mù";
        return "🌤️ Trong lành";
    }
}