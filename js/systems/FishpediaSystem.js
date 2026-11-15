import { fishList } from "../fishing/FishDatabase.js";

export class FishpediaSystem {
    constructor(eventBus = null) {
        this.eventBus = eventBus;
        this.entries = {};
    }

    recordCatch(fish) {
        if (!fish || !fish.id) return { isNew: false, isRecord: false };

        const existing = this.entries[fish.id];
        const weight = Number(fish.weight) || 0;
        const now = new Date().toISOString();

        if (!existing) {
            this.entries[fish.id] = {
                id: fish.id,
                name: fish.name,
                rarity: fish.rarity,
                count: 1,
                maxWeight: weight,
                minWeight: weight,
                firstCaughtAt: now,
                lastCaughtAt: now
            };
            this.eventBus?.emit("fishpedia:new_discovery", { fish, entry: this.entries[fish.id] });
            return { isNew: true, isRecord: true };
        }

        existing.count += 1;
        existing.lastCaughtAt = now;
        let isRecord = false;
        if (weight > existing.maxWeight) {
            existing.maxWeight = weight;
            isRecord = true;
        }
        if (existing.minWeight === 0 || (weight > 0 && weight < existing.minWeight)) {
            existing.minWeight = weight;
        }

        return { isNew: false, isRecord };
    }

    getEntry(fishId) {
        return this.entries[fishId] || null;
    }

    getProgress() {
        const total = fishList.length;
        const discovered = Object.keys(this.entries).filter((id) =>
            fishList.some((f) => f.id === id)
        ).length;
        return {
            discovered,
            total,
            percent: total > 0 ? Math.round((discovered / total) * 100) : 0
        };
    }

    getAllCatalogEntries() {
        return fishList.map((fish) => ({
            fish,
            discovered: Boolean(this.entries[fish.id]),
            record: this.entries[fish.id] || null
        }));
    }

    toJSON() {
        return {
            entries: { ...this.entries }
        };
    }

    fromJSON(data) {
        if (!data || typeof data !== "object") return;
        this.entries = data.entries && typeof data.entries === "object"
            ? { ...data.entries }
            : {};
    }
}
