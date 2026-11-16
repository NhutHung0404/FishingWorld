import { getRandomFish } from "./FishDatabase.js";

export class FishingSystem {
    constructor(eventBus = null) {
        this.eventBus = eventBus;
        this.active = false;
        this.state = "idle";
        this.waitTime = 0;
        this.biteTime = 0;
        this.blinkTimer = 0;

        this.bobberX = 900;
        this.bobberY = 530;
        this.blink = false;
        this.currentFish = null;
    }

    selectFish(context = {}) {
        this.currentFish = getRandomFish(context);
        return this.currentFish;
    }

    startFishing(bobberPosition, bonuses = {}) {
        if (this.state !== "idle") {
            return false;
        }

        this.active = true;
        this.state = "waiting";

        // Thời gian chờ từ 4 đến 11 giây, giảm theo biteSpeedBonus
        const baseWait = 4 + Math.random() * 7;
        const speedBonus = Math.min(0.6, Math.max(0, bonuses.biteSpeedBonus || 0));
        this.waitTime = Math.max(1.8, baseWait * (1 - speedBonus));
        this.biteTime = 0;
        this.blinkTimer = 0;
        this.blink = false;

        this.bobberX = bobberPosition?.x ?? 900;
        this.bobberY = bobberPosition?.y ?? 530;

        this.eventBus?.emit("fishing:started", {
            bobberX: this.bobberX,
            bobberY: this.bobberY
        });

        return true;
    }

    update(deltaTime) {
        if (!this.active) {
            return null;
        }

        if (this.state === "waiting") {
            this.waitTime -= deltaTime;

            if (this.waitTime <= 0) {
                this.waitTime = 0;
                this.state = "biting";
                this.biteTime = 0.75;
                this.blinkTimer = 0;
                this.blink = true;
                this.eventBus?.emit("fishing:biting");
                return "biting";
            }
        } else if (this.state === "biting") {
            this.biteTime -= deltaTime;
            this.blinkTimer += deltaTime;

            if (this.blinkTimer >= 0.14) {
                this.blinkTimer = 0;
                this.blink = !this.blink;
            }

            if (this.biteTime <= 0) {
                this.state = "timing";
                return "start_timing";
            }
        } else if (this.state === "timing") {
            this.blinkTimer += deltaTime;
            if (this.blinkTimer >= 0.18) {
                this.blinkTimer = 0;
                this.blink = !this.blink;
            }
        }

        return null;
    }

    enterTiming() {
        this.state = "timing";
    }

    enterResult() {
        this.state = "result";
        this.blink = false;
    }

    stopFishing() {
        this.active = false;
        this.state = "idle";

        this.waitTime = 0;
        this.biteTime = 0;
        this.blinkTimer = 0;
        this.currentFish = null;
        this.blink = false;

        this.eventBus?.emit("fishing:stopped");
    }

    getWaitTime() {
        return this.waitTime;
    }

    isActive() {
        return this.active;
    }

    isBitingOrTiming() {
        return this.state === "biting" || this.state === "timing";
    }
}