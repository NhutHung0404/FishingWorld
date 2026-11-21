export class Renderer {
    constructor({
        canvas,
        update = null,
        render = null,
        onResize = null,
        isTouchDevice = null,
        maxDeltaTime = 0.05
    }) {
        if (!canvas) {
            throw new Error("Renderer requires a valid canvas element.");
        }

        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.ctx.imageSmoothingEnabled = false;

        this.updateCallback = update;
        this.renderCallback = render;
        this.onResizeCallback = onResize;
        this.isTouchDeviceCallback = isTouchDevice;

        this.logicalWidth = canvas.width;
        this.logicalHeight = canvas.height;
        this.dpr = 1;

        this.maxDeltaTime = maxDeltaTime;
        this.rafId = null;
        this.lastTime = 0;
        this.isRunning = false;
        this.isDestroyed = false;

        this._onResizeHandler = () => {
            this.resizeCanvas();
        };

        window.addEventListener("resize", this._onResizeHandler);
        window.addEventListener("orientationchange", this._onResizeHandler);
    }

    start() {
        if (this.isRunning || this.isDestroyed) return;
        this.isRunning = true;
        this.lastTime = performance.now();

        const loop = (timestamp) => {
            if (!this.isRunning || this.isDestroyed) return;

            const deltaTime = Math.min((timestamp - this.lastTime) / 1000, this.maxDeltaTime);
            this.lastTime = timestamp;

            if (this.updateCallback) {
                this.updateCallback(deltaTime);
            }

            if (this.renderCallback) {
                this.renderCallback();
            }

            if (this.isRunning && !this.isDestroyed) {
                this.rafId = requestAnimationFrame(loop);
            }
        };

        this.rafId = requestAnimationFrame(loop);
    }

    stop() {
        this.isRunning = false;
        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }

    resizeCanvas() {
        if (this.isDestroyed) return false;
        if (this.isTouchDeviceCallback && !this.isTouchDeviceCallback()) return false;

        const rect = this.canvas.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return false;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const logicalWidth = Math.max(1, Math.round(rect.width));
        const logicalHeight = Math.max(1, Math.round(rect.height));
        const physicalWidth = Math.max(1, Math.round(logicalWidth * dpr));
        const physicalHeight = Math.max(1, Math.round(logicalHeight * dpr));

        if (
            this.canvas.width !== physicalWidth ||
            this.canvas.height !== physicalHeight ||
            this.logicalWidth !== logicalWidth ||
            this.logicalHeight !== logicalHeight ||
            this.dpr !== dpr
        ) {
            this.canvas.width = physicalWidth;
            this.canvas.height = physicalHeight;
            this.logicalWidth = logicalWidth;
            this.logicalHeight = logicalHeight;
            this.dpr = dpr;
            this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            this.ctx.imageSmoothingEnabled = false;

            if (this.onResizeCallback) {
                this.onResizeCallback({
                    logicalWidth,
                    logicalHeight,
                    dpr,
                    physicalWidth,
                    physicalHeight
                });
            }
            return true;
        }

        return false;
    }

    destroy() {
        this.stop();
        this.isDestroyed = true;
        this.updateCallback = null;
        this.renderCallback = null;
        this.onResizeCallback = null;
        this.isTouchDeviceCallback = null;

        if (this._onResizeHandler) {
            window.removeEventListener("resize", this._onResizeHandler);
            window.removeEventListener("orientationchange", this._onResizeHandler);
            this._onResizeHandler = null;
        }
    }
}
