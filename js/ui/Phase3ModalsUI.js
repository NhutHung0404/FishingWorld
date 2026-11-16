import { ZONE_LABELS } from "../fishing/FishDatabase.js";

export class Phase3ModalsUI {
    constructor(elements) {
        this.shopModal = elements.shopModal;
        this.shopGold = elements.shopGold;
        this.shopBody = elements.shopBody;
        this.closeShopBtn = elements.closeShopBtn;
        this.openShopBtn = elements.openShopBtn;

        this.fishpediaModal = elements.fishpediaModal;
        this.fishpediaProgress = elements.fishpediaProgress;
        this.fishpediaBody = elements.fishpediaBody;
        this.closeFishpediaBtn = elements.closeFishpediaBtn;
        this.openFishpediaBtn = elements.openFishpediaBtn;

        this.questsModal = elements.questsModal;
        this.questsBody = elements.questsBody;
        this.closeQuestsBtn = elements.closeQuestsBtn;
        this.openQuestsBtn = elements.openQuestsBtn;
        this.resetQuestsBtn = elements.resetQuestsBtn;
    }

    bindEvents(handlers) {
        this.openShopBtn?.addEventListener("click", () => { this.openShopBtn.blur(); handlers.onOpenShop?.(); });
        this.closeShopBtn?.addEventListener("click", () => { this.closeShopBtn.blur(); handlers.onCloseModal?.("shop"); });
        this.shopBody?.addEventListener("click", (e) => {
            const btn = e.target.closest("button[data-action]");
            if (!btn) return;
            btn.blur();
            handlers.onShopAction?.(btn.dataset.action, btn.dataset.id);
        });

        this.openFishpediaBtn?.addEventListener("click", () => { this.openFishpediaBtn.blur(); handlers.onOpenFishpedia?.(); });
        this.closeFishpediaBtn?.addEventListener("click", () => { this.closeFishpediaBtn.blur(); handlers.onCloseModal?.("fishpedia"); });

        this.openQuestsBtn?.addEventListener("click", () => { this.openQuestsBtn.blur(); handlers.onOpenQuests?.(); });
        this.closeQuestsBtn?.addEventListener("click", () => { this.closeQuestsBtn.blur(); handlers.onCloseModal?.("quests"); });
        this.resetQuestsBtn?.addEventListener("click", () => { this.resetQuestsBtn.blur(); handlers.onResetQuests?.(); });
        this.questsBody?.addEventListener("click", (e) => {
            const btn = e.target.closest("button[data-claim]");
            if (!btn) return;
            btn.blur();
            handlers.onClaimQuest?.(btn.dataset.claim);
        });
    }

    isAnyOpen() {
        return (
            this.shopModal?.style.display === "block" ||
            this.fishpediaModal?.style.display === "block" ||
            this.questsModal?.style.display === "block"
        );
    }

    closeAll() {
        if (this.shopModal) this.shopModal.style.display = "none";
        if (this.fishpediaModal) this.fishpediaModal.style.display = "none";
        if (this.questsModal) this.questsModal.style.display = "none";
    }

    openShop(shopSystem, equipment, inventory, progression) {
        this.closeAll();
        this.renderShop(shopSystem, equipment, inventory, progression);
        if (this.shopModal) this.shopModal.style.display = "block";
    }

    renderShop(shopSystem, equipment, inventory, progression) {
        if (!this.shopBody) return;
        if (this.shopGold) this.shopGold.textContent = inventory.gold;
        const { rods, baits, nextBagUpgrade } = shopSystem.getCatalog();

        let html = `<div class="modal-section"><h3>🎣 Cần câu</h3>`;
        for (const rod of rods) {
            const owned = equipment.hasRod(rod.id);
            const equipped = equipment.equippedRodId === rod.id;
            const locked = !owned && progression.level < rod.minLevel;
            const btnText = equipped ? "Đang dùng" : owned ? "Trang bị" : `Mua (${rod.price}G)`;
            html += `<div class="shop-row"><div><strong>${rod.name}</strong> <small>(Lv.${rod.minLevel}+)</small><br><small>${rod.description}</small></div><button data-action="rod" data-id="${rod.id}" ${equipped || locked ? "disabled" : ""}>${btnText}</button></div>`;
        }
        html += `</div><div class="modal-section"><h3>🪱 Mồi câu</h3>`;
        for (const bait of baits) {
            const count = equipment.getBaitCount(bait.id);
            const equipped = equipment.equippedBaitId === bait.id;
            const locked = progression.level < bait.minLevel;
            html += `<div class="shop-row"><div><strong>${bait.name}</strong> <small>(Có: ${count})</small><br><small>${bait.description}</small></div><div class="shop-actions">${count > 0 ? `<button data-action="equip_bait" data-id="${equipped ? "" : bait.id}">${equipped ? "Tháo" : "Gắn"}</button>` : ""}<button data-action="bait" data-id="${bait.id}" ${locked ? "disabled" : ""}>Mua x${bait.bundleSize} (${bait.price}G)</button></div></div>`;
        }
        html += `</div><div class="modal-section"><h3>🎒 Nâng cấp túi cá</h3>`;
        html += nextBagUpgrade
            ? `<div class="shop-row"><div><strong>${nextBagUpgrade.name}</strong><br><small>Sức chứa: ${inventory.capacity} → ${nextBagUpgrade.capacity} cá</small></div><button data-action="bag" data-id="upgrade">Nâng cấp (${nextBagUpgrade.price}G)</button></div>`
            : `<div class="shop-row"><small>Túi cá đã đạt cấp tối đa (${inventory.capacity} cá)!</small></div>`;
        this.shopBody.innerHTML = html + `</div>`;
    }

    openFishpedia(fishpedia) {
        this.closeAll();
        this.renderFishpedia(fishpedia);
        if (this.fishpediaModal) this.fishpediaModal.style.display = "block";
    }

    renderFishpedia(fishpedia) {
        if (!this.fishpediaBody) return;
        const progress = fishpedia.getProgress();
        if (this.fishpediaProgress) {
            this.fishpediaProgress.textContent = `${progress.discovered}/${progress.total} (${progress.percent}%)`;
        }

        const entries = fishpedia.getAllCatalogEntries();
        this.fishpediaBody.innerHTML = entries.map(({ fish, discovered, record }) => {
            const zones = fish.zones.map((z) => ZONE_LABELS[z] || z).join(", ");
            if (!discovered) {
                return `<div class="fish-item unknown"><div>❓ <strong>??? (${fish.rarity})</strong><br><small>Khu vực: ${zones}</small></div></div>`;
            }
            return `<div class="fish-item"><div>🐟 <strong>${fish.name}</strong> <small>[${fish.rarity}]</small><br><small>Đã câu: ${record.count} | Kỷ lục: ${record.maxWeight} kg | Khu vực: ${zones}</small><br><small>${fish.description}</small></div></div>`;
        }).join("");
    }

    openQuests(questSystem) {
        this.closeAll();
        this.renderQuests(questSystem);
        if (this.questsModal) this.questsModal.style.display = "block";
    }

    renderQuests(questSystem) {
        if (!this.questsBody) return;
        this.questsBody.innerHTML = questSystem.quests.map((q) => {
            const done = q.progress >= q.target;
            const statusBtn = q.claimed
                ? `<button disabled>Đã nhận</button>`
                : done
                    ? `<button data-claim="${q.id}" class="claim-btn">Nhận thưởng</button>`
                    : `<button disabled>${q.progress}/${q.target}</button>`;
            return `<div class="shop-row"><div><strong>${q.title}</strong><br><small>${q.description}</small><br><small>Thưởng: 🪙 ${q.rewardGold}G + ⭐ ${q.rewardXp} XP</small></div>${statusBtn}</div>`;
        }).join("");
    }
}
