export class Camera {
    constructor(canvas, worldWidth, worldHeight, lerpSpeed = 10) {
        this.canvas = canvas;
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
        this.lerpSpeed = lerpSpeed;
        this.viewportWidth = canvas.width;
        this.viewportHeight = canvas.height;

        this.x = 0;
        this.y = 0;

        this.shakeTime = 0;
        this.shakeDuration = 0;
        this.shakeIntensity = 0;
        this.shakeOffsetX = 0;
        this.shakeOffsetY = 0;
    }

    setViewport(width, height) {
        if (width > 0 && height > 0) {
            this.viewportWidth = width;
            this.viewportHeight = height;
        }
    }

    getTargetPosition(target) {
        const maxX = Math.max(0, this.worldWidth - this.viewportWidth);
        const maxY = Math.max(0, this.worldHeight - this.viewportHeight);

        const targetX = Math.max(
            0,
            Math.min(target.x - this.viewportWidth / 2, maxX)
        );
        const targetY = Math.max(
            0,
            Math.min(target.y - this.viewportHeight / 2, maxY)
        );

        return { x: targetX, y: targetY };
    }

    follow(target, deltaTime = null, immediate = false) {
        const { x: targetX, y: targetY } = this.getTargetPosition(target);

        if (immediate || deltaTime === null || deltaTime <= 0) {
            this.x = targetX;
            this.y = targetY;
        } else {
            const factor = 1 - Math.exp(-this.lerpSpeed * deltaTime);
            this.x += (targetX - this.x) * factor;
            this.y += (targetY - this.y) * factor;
        }

        if (deltaTime !== null) {
            this.updateShake(deltaTime);
        }
    }

    shake(intensity = 5, duration = 0.25) {
        this.shakeIntensity = intensity;
        this.shakeDuration = duration;
        this.shakeTime = duration;
    }

    updateShake(deltaTime) {
        if (this.shakeTime <= 0) {
            this.shakeOffsetX = 0;
            this.shakeOffsetY = 0;
            return;
        }

        this.shakeTime = Math.max(0, this.shakeTime - deltaTime);
        const progress = this.shakeDuration > 0 ? this.shakeTime / this.shakeDuration : 0;
        const currentIntensity = this.shakeIntensity * progress;

        this.shakeOffsetX = (Math.random() * 2 - 1) * currentIntensity;
        this.shakeOffsetY = (Math.random() * 2 - 1) * currentIntensity;
    }

    getRenderX() {
        return Math.round(this.x + this.shakeOffsetX);
    }

    getRenderY() {
        return Math.round(this.y + this.shakeOffsetY);
    }
}