export class Fish {
    constructor(name, rarity, price, chance, size, extra = {}) {
        this.name = name;
        this.rarity = rarity;
        this.price = price;
        this.chance = chance;
        this.size = size;
        this.id = extra.id || this.createId(name);
        this.minWeight = extra.minWeight ?? 0.3;
        this.maxWeight = extra.maxWeight ?? 2.5;
        this.weight = extra.weight ?? null;
        this.zones = Array.isArray(extra.zones) ? extra.zones : ["SHORE", "DOCK", "DEEP_ROCKS", "CENTER_LAKE"];
        this.timePhases = Array.isArray(extra.timePhases) ? extra.timePhases : ["DAWN", "DAY", "DUSK", "NIGHT"];
        this.weathers = Array.isArray(extra.weathers) ? extra.weathers : ["CLEAR", "RAIN", "MIST"];
        this.xp = extra.xp ?? 10;
        this.description = extra.description || "";
        this.caughtAt = extra.caughtAt || null;
        this.locked = Boolean(extra.locked);
    }

    createId(name) {
        return String(name || "fish")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "_")
            .replace(/^_|_$/g, "");
    }

    rollWeight() {
        const min = Number(this.minWeight) || 0.2;
        const max = Math.max(min, Number(this.maxWeight) || 2.0);
        const raw = min + Math.random() * (max - min);
        return Math.round(raw * 100) / 100;
    }

    getInfo() {
        return `${this.name} - ${this.rarity}`;
    }

    getPrice() {
        return this.price;
    }

    clone(overrides = {}) {
        const weight = overrides.weight ?? this.weight ?? this.rollWeight();
        const midWeight = (this.minWeight + this.maxWeight) / 2 || 1;
        const weightRatio = Math.max(0.75, Math.min(1.5, weight / midWeight));
        const finalPrice = overrides.price ?? Math.max(1, Math.round(this.price * weightRatio));

        return new Fish(
            this.name,
            this.rarity,
            finalPrice,
            this.chance,
            this.size,
            {
                id: this.id,
                minWeight: this.minWeight,
                maxWeight: this.maxWeight,
                weight,
                zones: this.zones,
                timePhases: this.timePhases,
                weathers: this.weathers,
                xp: this.xp,
                description: this.description,
                caughtAt: overrides.caughtAt ?? new Date().toISOString(),
                locked: overrides.locked ?? this.locked
            }
        );
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            rarity: this.rarity,
            price: this.price,
            chance: this.chance,
            size: this.size,
            minWeight: this.minWeight,
            maxWeight: this.maxWeight,
            weight: this.weight,
            xp: this.xp,
            caughtAt: this.caughtAt,
            locked: this.locked
        };
    }

    static fromJSON(data) {
        if (!data || typeof data !== "object") return null;
        return new Fish(
            data.name || "Cá lạ",
            data.rarity || "Common",
            Number(data.price) || 10,
            Number(data.chance) || 1,
            data.size || "medium",
            {
                id: data.id,
                minWeight: data.minWeight ?? 0.3,
                maxWeight: data.maxWeight ?? 2.5,
                weight: data.weight ?? null,
                xp: data.xp ?? 10,
                caughtAt: data.caughtAt || null,
                locked: Boolean(data.locked)
            }
        );
    }
}