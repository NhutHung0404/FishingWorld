export class EffectManager {

    constructor(gameCanvasElement, fishJumpEffect, fishJumpCanvas) {
        this.gameCanvasElement = gameCanvasElement;

        // Các thành phần hiệu ứng cá nhảy
        this.fishJumpEffect = fishJumpEffect;
        this.fishJumpCanvas = fishJumpCanvas;
        this.fishJumpCtx = fishJumpCanvas.getContext("2d");

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

        // Khi hiệu ứng kết thúc
        this.fishJumpEffect.addEventListener("animationend", () => {
            this.stopFishJump();
        });
    }

    // Hiệu ứng giật cần câu
    triggerRodJerk() {
        this.gameCanvasElement.classList.remove("rod-jerk");

        void this.gameCanvasElement.offsetWidth;

        this.gameCanvasElement.classList.add("rod-jerk");
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