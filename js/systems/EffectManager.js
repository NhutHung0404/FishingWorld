export class EffectManager {

    constructor(gameCanvasElement, fishJumpEffect, fishJumpCanvas) {
        this.gameCanvasElement = gameCanvasElement;

        // Các thành phần hiệu ứng cá nhảy
        this.fishJumpEffect = fishJumpEffect;
        this.fishJumpCanvas = fishJumpCanvas;
        this.fishJumpCtx = fishJumpCanvas?.getContext("2d");

        this.fishSprite = new Image();
        this.fishSprite.src = "assets/fish-jump.png";

        this.fishFrames = [
            { x: 97, y: 286, w: 382, h: 263 },
            { x: 658, y: 55, w: 345, h: 444 },
            { x: 1204, y: 97, w: 379, h: 326 },
            { x: 1718, y: 222, w: 370, h: 260 }
        ];

        this.fishFrameIndex = 0;
        this.fishAnimationInterval = null;

        // Particle system trong game canvas
        this.particles = [];

        // Khi hiệu ứng kết thúc
        this.fishJumpEffect?.addEventListener("animationend", () => {
            this.stopFishJump();
        });
    }

    // Hiệu ứng giật cần câu
    triggerRodJerk() {
        if (!this.gameCanvasElement) return;
        this.gameCanvasElement.classList.remove("rod-jerk");
        void this.gameCanvasElement.offsetWidth;
        this.gameCanvasElement.classList.add("rod-jerk");
    }

    // Tạo gợn sóng tại vị trí phao câu
    addWaterRipple(x, y, maxRadius = 25, color = "rgba(255, 255, 255, 0.7)") {
        this.particles.push({
            type: "ripple",
            x,
            y,
            radius: 2,
            maxRadius,
            alpha: 1,
            color,
            speed: 18
        });
    }

    // Tạo hiệu ứng tia nước bắn (splash)
    addWaterSplash(x, y, count = 8) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 20 + Math.random() * 40;
            this.particles.push({
                type: "splash",
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 15,
                radius: 2 + Math.random() * 2,
                alpha: 1,
                life: 0.5,
                maxLife: 0.5,
                color: "#90e0ef"
            });
        }
    }

    // Tạo chữ bay nổi (floating text)
    addFloatingText(x, y, text, color = "#ffeb3b") {
        this.particles.push({
            type: "text",
            x,
            y,
            text,
            color,
            vy: -30,
            alpha: 1,
            life: 1.0,
            maxLife: 1.0
        });
    }

    update(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            if (p.type === "ripple") {
                p.radius += p.speed * deltaTime;
                p.alpha = 1 - (p.radius / p.maxRadius);
                if (p.radius >= p.maxRadius || p.alpha <= 0) {
                    this.particles.splice(i, 1);
                }
            } else if (p.type === "splash") {
                p.x += p.vx * deltaTime;
                p.y += p.vy * deltaTime;
                p.vy += 80 * deltaTime;
                p.life -= deltaTime;
                p.alpha = Math.max(0, p.life / p.maxLife);
                if (p.life <= 0) {
                    this.particles.splice(i, 1);
                }
            } else if (p.type === "text") {
                p.y += p.vy * deltaTime;
                p.life -= deltaTime;
                p.alpha = Math.max(0, p.life / p.maxLife);
                if (p.life <= 0) {
                    this.particles.splice(i, 1);
                }
            }
        }
    }

    drawParticles(ctx) {
        ctx.save();
        for (const p of this.particles) {
            ctx.globalAlpha = Math.max(0, p.alpha);

            if (p.type === "ripple") {
                ctx.strokeStyle = p.color;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.stroke();
            } else if (p.type === "splash") {
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();
            } else if (p.type === "text") {
                ctx.font = "bold 14px sans-serif";
                ctx.fillStyle = p.color;
                ctx.textAlign = "center";
                ctx.shadowColor = "black";
                ctx.shadowBlur = 3;
                ctx.fillText(p.text, p.x, p.y);
            }
        }
        ctx.restore();
    }

    // Vẽ từng khung hình cá
    drawFishFrame(index) {
        if (!this.fishSprite.complete || !this.fishSprite.naturalWidth) {
            return;
        }

        const frame = this.fishFrames[index];

        this.fishJumpCtx.clearRect(
            0, 0,
            this.fishJumpCanvas.width,
            this.fishJumpCanvas.height
        );

        this.fishJumpCtx.drawImage(
            this.fishSprite,
            frame.x, frame.y,
            frame.w, frame.h,
            0, 0,
            120, 90
        );
    }

    // Hiệu ứng cá nhảy
    triggerFishJump() {
        clearInterval(this.fishAnimationInterval);

        this.fishJumpEffect.classList.remove("fish-jump");
        this.fishJumpEffect.style.display = "none";

        void this.fishJumpEffect.offsetWidth;

        this.fishFrameIndex = 0;

        this.drawFishFrame(this.fishFrameIndex);

        this.fishJumpEffect.style.display = "block";
        this.fishJumpEffect.classList.add("fish-jump");

        this.fishAnimationInterval = setInterval(() => {
            this.fishFrameIndex++;

            if (this.fishFrameIndex >= this.fishFrames.length) {
                this.fishFrameIndex = this.fishFrames.length - 1;
            }

            this.drawFishFrame(this.fishFrameIndex);
        }, 180);
    }

    // Dừng hiệu ứng cá nhảy
    stopFishJump() {
        clearInterval(this.fishAnimationInterval);

        this.fishJumpEffect.classList.remove("fish-jump");
        this.fishJumpEffect.style.display = "none";

        this.fishJumpCtx.clearRect(
            0, 0,
            this.fishJumpCanvas.width,
            this.fishJumpCanvas.height
        );
    }
}