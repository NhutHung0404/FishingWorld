import { getRodById, getBaitById } from "./ItemDatabase.js";

export class EquipmentSystem {
    constructor(eventBus = null) {
        this.eventBus = eventBus;
        this.ownedRods = ["wooden_rod"];
        this.equippedRodId = "wooden_rod";
        this.baitCounts = {};
        this.equippedBaitId = null;
    }

    hasRod(rodId) {
        return this.ownedRods.includes(rodId);
    }

    unlockRod(rodId) {
        if (!this.hasRod(rodId)) {
            this.ownedRods.push(rodId);
            this.emitChanged();
        }
    }

    equipRod(rodId) {
        if (!this.hasRod(rodId)) return false;
        this.equippedRodId = rodId;
        this.emitChanged();
        return true;
    }

    getEquippedRod() {
        return getRodById(this.equippedRodId);
    }

    addBait(baitId, quantity) {
        const current = this.baitCounts[baitId] || 0;
        this.baitCounts[baitId] = current + Math.max(0, quantity);
        if (!this.equippedBaitId && this.baitCounts[baitId] > 0) {
            this.equippedBaitId = baitId;
        }
        this.emitChanged();
    }

    getBaitCount(baitId) {
        return this.baitCounts[baitId] || 0;
    }

    equipBait(baitId) {
        if (baitId === null) {
            this.equippedBaitId = null;
            this.emitChanged();
            return true;
        }
        if (this.getBaitCount(baitId) <= 0) return false;
        this.equippedBaitId = baitId;
        this.emitChanged();
        return true;
    }

    getEquippedBait() {
        if (!this.equippedBaitId) return null;
        if (this.getBaitCount(this.equippedBaitId) <= 0) {
            this.equippedBaitId = null;
            return null;
        }
        return getBaitById(this.equippedBaitId);
    }

    consumeBait() {
        if (!this.equippedBaitId) return null;
        const count = this.getBaitCount(this.equippedBaitId);
        if (count <= 0) {
            this.equippedBaitId = null;
            this.emitChanged();
            return null;
        }
        const usedBait = getBaitById(this.equippedBaitId);
        this.baitCounts[this.equippedBaitId] = count - 1;
        if (this.baitCounts[this.equippedBaitId] <= 0) {
            delete this.baitCounts[this.equippedBaitId];
            this.equippedBaitId = null;
        }
        this.emitChanged();
        return usedBait;
    }

    getCombinedBonuses() {
        const rod = this.getEquippedRod();
        const bait = this.getEquippedBait();
        return {
            speedMult: rod.speedMult || 1.0,
            targetScaleBonus: rod.targetScaleBonus || 0,
            luckBonus: (rod.luckBonus || 0) + (bait?.luckBonus || 0),
            tensionResist: rod.tensionResist || 1.0,
            biteSpeedBonus: (rod.biteSpeedBonus || 0) + (bait?.biteSpeedBonus || 0)
        };
    }

    emitChanged() {
        this.eventBus?.emit("equipment:changed", {
            rod: this.getEquippedRod(),
            bait: this.getEquippedBait(),
            baitCount: this.equippedBaitId ? this.getBaitCount(this.equippedBaitId) : 0
        });
    }

    toJSON() {
        return {
            ownedRods: [...this.ownedRods],
            rodId: this.equippedRodId,
            baitCounts: { ...this.baitCounts },
            baitId: this.equippedBaitId
        };
    }

    fromJSON(data) {
        if (!data || typeof data !== "object") return;
        this.ownedRods = Array.isArray(data.ownedRods) && data.ownedRods.length > 0
            ? Array.from(new Set(["wooden_rod", ...data.ownedRods]))
            : ["wooden_rod"];
        this.equippedRodId = this.hasRod(data.rodId) ? data.rodId : "wooden_rod";
        this.baitCounts = data.baitCounts && typeof data.baitCounts === "object"
            ? { ...data.baitCounts }
            : {};
        this.equippedBaitId = data.baitId && this.getBaitCount(data.baitId) > 0
            ? data.baitId
            : null;
        this.emitChanged();
    }
}
