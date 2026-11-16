export class InventoryUI {
    constructor(elements) {
        this.inventoryUI = elements.inventoryUI;
        this.inventoryCount = elements.inventoryCount;
        this.inventoryTotal = elements.inventoryTotal;
        this.goldText = elements.goldText;
        this.inventoryGold = elements.inventoryGold;
        this.fishListUI = elements.fishListUI;
        this.fishCountText = elements.fishCountText;
        this.openBtn = elements.openBtn || null;
        this.closeBtn = elements.closeBtn || null;
        this.sellAllBtn = elements.sellAllBtn || null;
        this.rarityFilterEl = elements.rarityFilterEl || null;
        this.sortSelectEl = elements.sortSelectEl || null;

        this.currentFilter = "ALL";
        this.currentSort = "newest";
        this.lastInventory = null;
    }

    bindEvents({ onOpen, onClose, onSellFish, onSellAll, onToggleLock }) {
        this.openBtn?.addEventListener("click", () => {
            this.openBtn.blur();
            onOpen?.();
        });

        this.closeBtn?.addEventListener("click", () => {
            this.closeBtn.blur();
            onClose?.();
        });

        this.fishListUI?.addEventListener("click", (e) => {
            const lockBtn = e.target.closest("button[data-lock-index]");
            if (lockBtn) {
                lockBtn.blur();
                onToggleLock?.(Number(lockBtn.dataset.lockIndex));
                return;
            }

            const button = e.target.closest("button[data-index]");
            if (!button) return;
            button.blur();
            onSellFish?.(Number(button.dataset.index));
        });

        this.sellAllBtn?.addEventListener("click", () => {
            this.sellAllBtn.blur();
            onSellAll?.();
        });

        this.rarityFilterEl?.addEventListener("change", () => {
            this.currentFilter = this.rarityFilterEl.value || "ALL";
            if (this.lastInventory) {
                this.render(this.lastInventory);
            }
        });

        this.sortSelectEl?.addEventListener("change", () => {
            this.currentSort = this.sortSelectEl.value || "newest";
            if (this.lastInventory) {
                this.render(this.lastInventory);
            }
        });
    }

    isOpen() {
        return this.inventoryUI.style.display === "block";
    }

    open() {
        this.inventoryUI.style.display = "block";
    }

    close() {
        this.inventoryUI.style.display = "none";
    }

    getRarityClass(rarity) {
        return `rarity-${String(rarity || "Common").toLowerCase()}`;
    }

    render(inventory) {
        this.lastInventory = inventory;
        const fishList = inventory.fishList;

        this.inventoryCount.textContent = fishList.length;
        this.inventoryTotal.textContent = `${fishList.length} / ${inventory.capacity}`;
        this.inventoryGold.textContent = inventory.gold;

        if (fishList.length === 0) {
            this.fishListUI.innerHTML = `<div class="empty-state">Chưa có cá nào trong túi!</div>`;
            return;
        }

        const indexed = fishList.map((fish, index) => ({ fish, index }));
        const filtered = this.currentFilter === "ALL"
            ? indexed
            : indexed.filter(({ fish }) => fish.rarity === this.currentFilter);

        filtered.sort((a, b) => {
            if (this.currentSort === "price_desc") return b.fish.price - a.fish.price;
            if (this.currentSort === "weight_desc") return (b.fish.weight || 0) - (a.fish.weight || 0);
            if (this.currentSort === "rarity") {
                const rank = { Legendary: 5, Epic: 4, Rare: 3, Uncommon: 2, Common: 1 };
                return (rank[b.fish.rarity] || 0) - (rank[a.fish.rarity] || 0);
            }
            return b.index - a.index; // newest first
        });

        if (filtered.length === 0) {
            this.fishListUI.innerHTML = `<div class="empty-state">Không có cá nào thuộc độ hiếm "${this.currentFilter}".</div>`;
            return;
        }

        this.fishListUI.innerHTML = "";

        for (const { fish, index } of filtered) {
            const item = document.createElement("div");
            item.className = `fish-item ${fish.locked ? "is-locked" : ""}`;
            const weightText = fish.weight ? ` | ${fish.weight} kg` : "";
            const rarityClass = this.getRarityClass(fish.rarity);

            item.innerHTML = `
                <div class="fish-item-info">
                    <div class="fish-item-title">
                        🐟 <strong>${fish.name}</strong>
                        <span class="rarity-badge ${rarityClass}">${fish.rarity}</span>
                        ${fish.locked ? `<span class="lock-badge">🔒 Đã khóa</span>` : ""}
                    </div>
                    <small>⚖️ ${weightText.replace(" | ", "") || "--"} | 🪙 ${fish.price} vàng</small>
                </div>
                <div class="fish-item-actions">
                    <button type="button" class="btn-lock ${fish.locked ? "locked" : ""}" data-lock-index="${index}" title="${fish.locked ? "Mở khóa" : "Khóa để không bán nhầm"}">
                        ${fish.locked ? "🔒" : "🔓"}
                    </button>
                    <button type="button" class="btn-sell" data-index="${index}" ${fish.locked ? "disabled" : ""}>
                        Bán
                    </button>
                </div>
            `;

            this.fishListUI.appendChild(item);
        }
    }

    updateHud(inventory) {
        this.fishCountText.textContent = inventory.getFishCount();
        this.goldText.textContent = inventory.gold;
    }
}


