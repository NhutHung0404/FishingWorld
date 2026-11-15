import { RODS, BAITS, BAG_UPGRADES, getRodById, getBaitById } from "./ItemDatabase.js";

export class ShopSystem {
    constructor({ inventory, equipment, progression, eventBus = null }) {
        this.inventory = inventory;
        this.equipment = equipment;
        this.progression = progression;
        this.eventBus = eventBus;
    }

    getNextBagUpgrade() {
        const currentCap = this.inventory.capacity;
        return BAG_UPGRADES.find((u) => u.capacity > currentCap) || null;
    }

    buyOrEquipRod(rodId) {
        const rod = getRodById(rodId);
        if (!rod) return { success: false, message: "Không tìm thấy cần câu!" };

        if (this.equipment.hasRod(rodId)) {
            this.equipment.equipRod(rodId);
            return { success: true, action: "equipped", message: `Đã trang bị ${rod.name}!` };
        }

        if (this.progression.level < rod.minLevel) {
            return {
                success: false,
                message: `Cần đạt Level ${rod.minLevel} để mua ${rod.name}!`
            };
        }

        if (this.inventory.gold < rod.price) {
            return {
                success: false,
                message: `Không đủ vàng! Cần ${rod.price} vàng.`
            };
        }

        this.inventory.gold -= rod.price;
        this.inventory.emitChanged();
        this.eventBus?.emit("gold:changed", { gold: this.inventory.gold, delta: -rod.price });

        this.equipment.unlockRod(rodId);
        this.equipment.equipRod(rodId);
        this.eventBus?.emit("shop:purchased", { type: "rod", item: rod });

        return {
            success: true,
            action: "bought",
            message: `Đã mua và trang bị ${rod.name}!`
        };
    }

    buyBait(baitId) {
        const bait = getBaitById(baitId);
        if (!bait) return { success: false, message: "Không tìm thấy mồi câu!" };

        if (this.progression.level < bait.minLevel) {
            return {
                success: false,
                message: `Cần đạt Level ${bait.minLevel} để mua ${bait.name}!`
            };
        }

        if (this.inventory.gold < bait.price) {
            return {
                success: false,
                message: `Không đủ vàng! Cần ${bait.price} vàng.`
            };
        }

        this.inventory.gold -= bait.price;
        this.inventory.emitChanged();
        this.eventBus?.emit("gold:changed", { gold: this.inventory.gold, delta: -bait.price });

        this.equipment.addBait(baitId, bait.bundleSize);
        this.equipment.equipBait(baitId);
        this.eventBus?.emit("shop:purchased", { type: "bait", item: bait });

        return {
            success: true,
            message: `Đã mua ${bait.bundleSize}x ${bait.name} và trang bị!`
        };
    }

    equipBait(baitId) {
        const ok = this.equipment.equipBait(baitId);
        if (!ok) {
            return { success: false, message: "Bạn đã hết loại mồi này!" };
        }
        const bait = baitId ? getBaitById(baitId) : null;
        return {
            success: true,
            message: bait ? `Đã gắn ${bait.name}` : "Đã tháo mồi câu."
        };
    }

    buyBagUpgrade() {
        const nextUpgrade = this.getNextBagUpgrade();
        if (!nextUpgrade) {
            return { success: false, message: "Túi cá đã đạt cấp tối đa!" };
        }

        if (this.inventory.gold < nextUpgrade.price) {
            return {
                success: false,
                message: `Không đủ vàng! Cần ${nextUpgrade.price} vàng.`
            };
        }

        this.inventory.gold -= nextUpgrade.price;
        this.inventory.capacity = nextUpgrade.capacity;
        this.inventory.emitChanged();
        this.eventBus?.emit("gold:changed", { gold: this.inventory.gold, delta: -nextUpgrade.price });
        this.eventBus?.emit("shop:purchased", { type: "bag", item: nextUpgrade });

        return {
            success: true,
            message: `Đã nâng cấp lên ${nextUpgrade.name}!`
        };
    }

    getCatalog() {
        return {
            rods: RODS,
            baits: BAITS,
            nextBagUpgrade: this.getNextBagUpgrade()
        };
    }
}
