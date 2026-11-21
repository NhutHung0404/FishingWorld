export class ShopUI {
    constructor(elements = {}) {
        this.modal = elements.shopModal || elements.modal || null;
        this.goldEl = elements.shopGold || elements.goldEl || null;
        this.bodyEl = elements.shopBody || elements.bodyEl || null;
        this.closeBtn = elements.closeShopBtn || elements.closeBtn || null;
        this.openBtn = elements.openShopBtn || elements.openBtn || null;

        this._handlers = {};
        this._onOpenClick = null;
        this._onCloseClick = null;
        this._onBodyClick = null;
    }

    bindEvents(handlers = {}) {
        this._handlers = handlers;

        if (this.openBtn && !this._onOpenClick) {
            this._onOpenClick = () => {
                this.openBtn.blur();
                if (this._handlers.onOpenShop) {
                    this._handlers.onOpenShop();
                } else if (this._handlers.onOpen) {
                    this._handlers.onOpen();
                }
            };
            this.openBtn.addEventListener("click", this._onOpenClick);
        }

        if (this.closeBtn && !this._onCloseClick) {
            this._onCloseClick = () => {
                this.closeBtn.blur();
                if (this._handlers.onCloseModal) {
                    this._handlers.onCloseModal("shop");
                } else if (this._handlers.onClose) {
                    this._handlers.onClose();
                }
            };
            this.closeBtn.addEventListener("click", this._onCloseClick);
        }

        if (this.bodyEl && !this._onBodyClick) {
            this._onBodyClick = (e) => {
                const btn = e.target.closest("button[data-action]");
                if (!btn) return;
                btn.blur();
                if (this._handlers.onShopAction) {
                    this._handlers.onShopAction(btn.dataset.action, btn.dataset.id);
                } else if (this._handlers.onAction) {
                    this._handlers.onAction(btn.dataset.action, btn.dataset.id);
                }
            };
            this.bodyEl.addEventListener("click", this._onBodyClick);
        }
    }

    isOpen() {
        return this.modal?.style.display === "block";
    }

    open(shopSystem, equipment, inventory, progression) {
        this.render(shopSystem, equipment, inventory, progression);
        if (this.modal) this.modal.style.display = "block";
    }

    close() {
        if (this.modal) this.modal.style.display = "none";
    }

    render(shopSystem, equipment, inventory, progression) {
        if (!this.bodyEl) return;
        if (this.goldEl && inventory) this.goldEl.textContent = inventory.gold;
        const { rods, baits, nextBagUpgrade } = shopSystem.getCatalog();

        let html = `<div class="modal-section"><h3>🎣 Cần câu</h3>`;
        for (const rod of rods) {
            const owned = equipment.hasRod(rod.id);
            const equipped = equipment.equippedRodId === rod.id;
            const locked = progression.level < rod.minLevel;
            let btnText = equipped ? "Đã trang bị" : owned ? "Trang bị" : `Mua (${rod.price}G)`;
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
        this.bodyEl.innerHTML = html + `</div>`;
    }

    destroy() {
        if (this.openBtn && this._onOpenClick) {
            this.openBtn.removeEventListener("click", this._onOpenClick);
            this._onOpenClick = null;
        }
        if (this.closeBtn && this._onCloseClick) {
            this.closeBtn.removeEventListener("click", this._onCloseClick);
            this._onCloseClick = null;
        }
        if (this.bodyEl && this._onBodyClick) {
            this.bodyEl.removeEventListener("click", this._onBodyClick);
            this._onBodyClick = null;
        }
        this._handlers = {};
    }
}
