import { getRandomFish } from "./FishDatabase.js";

export class FishingSystem {
    constructor() {
        this.active = false;
        this.state = "idle";
        this.waitTime = 0;
        this.biteTime = 0;

        this.bobberX = 900;
        this.bobberY = 530;
        this.blink = false;
        this.currentFish = null;
    }

    selectFish() {
    this.currentFish = getRandomFish();
    return this.currentFish;
}

    startFishing(lake) {
        if (this.state !== "idle") {
            return false;
        }

        this.active = true;
        this.state = "waiting";

        // Thời gian chờ từ 4 đến 13 giây
        this.waitTime = 4 + Math.random() * 9;

        // Vị trí phao
        this.bobberX = lake.x;
        this.bobberY = lake.y + 65;

        return true;
    }

    update(deltaTime) {
    if (!this.active) return false;

    if (this.state === "waiting") {
        this.waitTime -= deltaTime;

        if (this.waitTime <= 0) {
            this.waitTime = 0;
            this.state = "biting";
            return true;
        }
    }

    return false;
    }

    stopFishing() {
    this.active = false;
    this.state = "idle";

    this.waitTime = 0;
    this.biteTime = 0;
    this.currentFish = null;
    this.blink = false;
}
    getWaitTime() {
        return this.waitTime;
    }

    isActive() {
        return this.active;
    }
}