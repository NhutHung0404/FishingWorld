import { Fish } from "../entities/Fish.js";

export class Inventory {
    constructor(eventBus = null) {
        this.eventBus = eventBus;
        this.fishList = [];
        this.gold = 100;
        this.capacity = 50;
    }

    isFull() {
        return this.fishList.length >= this.capacity;
    }

    // Thêm cá vào túi
    addFish(fish) {
        if (this.isFull()) {
            return false;
        }

        const fishInstance = fish instanceof Fish ? fish.clone() : Fish.fromJSON(fish);
        if (!fishInstance) return false;

        this.fishList.push(fishInstance);
        this.emitChanged();
        return true;
    }

    // Khóa / mở khóa cá
    toggleLock(index) {
        const fish = this.fishList[index];
        if (!fish) return null;
        fish.locked = !fish.locked;
        this.emitChanged();
        return fish;
    }

    // Bán một con cá
    sellFish(index) {
        const fish = this.fishList[index];
        if (!fish || fish.locked) return null;

        this.gold += fish.price;
        this.fishList.splice(index, 1);

        this.emitChanged();
        this.eventBus?.emit("gold:changed", { gold: this.gold, delta: fish.price });
        return fish;
    }

    // Bán tất cả cá không bị khóa
    sellAllUnlocked() {
        if (this.fishList.length === 0) {
            return { totalMoney: 0, soldCount: 0, skippedLocked: 0 };
        }

        let totalMoney = 0;
        let soldCount = 0;
        let skippedLocked = 0;
        const remaining = [];

        for (const fish of this.fishList) {
            if (fish.locked) {
                remaining.push(fish);
                skippedLocked += 1;
            } else {
                totalMoney += fish.price;
                soldCount += 1;
            }
        }

        if (soldCount === 0) {
            return { totalMoney: 0, soldCount: 0, skippedLocked };
        }

        this.gold += totalMoney;
        this.fishList = remaining;

        this.emitChanged();
        this.eventBus?.emit("gold:changed", { gold: this.gold, delta: totalMoney });
        return { totalMoney, soldCount, skippedLocked };
    }

    // Bán tất cả cá (tương thích ngược)
    sellAllFish() {
        return this.sellAllUnlocked().totalMoney;
    }

    // Lấy số lượng cá
    getFishCount() {
        return this.fishList.length;
    }

    emitChanged() {
        this.eventBus?.emit("inventory:updated", {
            fishCount: this.fishList.length,
            capacity: this.capacity,
            gold: this.gold
        });
    }

    toJSON() {
        return {
            gold: this.gold,
            capacity: this.capacity,
            fishList: this.fishList.map((fish) =>
                typeof fish.toJSON === "function" ? fish.toJSON() : fish
            )
        };
    }

    loadFromData(data) {
        if (!data || typeof data !== "object") return;

        this.gold = Number.isFinite(Number(data.gold)) ? Number(data.gold) : 100;
        this.capacity = Number.isFinite(Number(data.capacity)) ? Number(data.capacity) : 50;
        this.fishList = Array.isArray(data.fishList)
            ? data.fishList.map((item) => Fish.fromJSON(item)).filter(Boolean)
            : [];

        this.emitChanged();
        this.eventBus?.emit("gold:changed", { gold: this.gold, delta: 0 });
    }
}