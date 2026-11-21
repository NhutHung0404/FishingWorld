import { ZONE_LABELS } from "../fishing/FishDatabase.js";

export class FishpediaUI {
    constructor(elements = {}) {
        this.modal = elements.fishpediaModal || elements.modal || null;
        this.progressEl = elements.fishpediaProgress || elements.progressEl || null;
        this.bodyEl = elements.fishpediaBody || elements.bodyEl || null;
        this.closeBtn = elements.closeFishpediaBtn || elements.closeBtn || null;
        this.openBtn = elements.openFishpediaBtn || elements.openBtn || null;

        this._handlers = {};
        this._onOpenClick = null;
        this._onCloseClick = null;
    }

    bindEvents(handlers = {}) {
        this._handlers = handlers;

        if (this.openBtn && !this._onOpenClick) {
            this._onOpenClick = () => {
                this.openBtn.blur();
                if (this._handlers.onOpenFishpedia) {
                    this._handlers.onOpenFishpedia();
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
                    this._handlers.onCloseModal("fishpedia");
                } else if (this._handlers.onClose) {
                    this._handlers.onClose();
                }
            };
            this.closeBtn.addEventListener("click", this._onCloseClick);
        }
    }

    isOpen() {
        return this.modal?.style.display === "block";
    }

    open(fishpedia) {
        this.render(fishpedia);
        if (this.modal) this.modal.style.display = "block";
    }

    close() {
        if (this.modal) this.modal.style.display = "none";
    }

    render(fishpedia) {
        if (!this.bodyEl || !fishpedia) return;
        const progress = fishpedia.getProgress();
        if (this.progressEl) {
            this.progressEl.textContent = `${progress.discovered}/${progress.total} (${progress.percent}%)`;
        }

        const entries = fishpedia.getAllCatalogEntries();
        this.bodyEl.innerHTML = entries.map(({ fish, discovered, record }) => {
            const zones = fish.zones.map((z) => ZONE_LABELS[z] || z).join(", ");
            if (!discovered) {
                return `<div class="fish-item unknown"><div>❓ <strong>??? (${fish.rarity})</strong><br><small>Khu vực: ${zones}</small></div></div>`;
            }
            return `<div class="fish-item"><div>🐟 <strong>${fish.name}</strong> <small>[${fish.rarity}]</small><br><small>Đã câu: ${record.count} | Kỷ lục: ${record.maxWeight} kg | Khu vực: ${zones}</small><br><small>${fish.description}</small></div></div>`;
        }).join("");
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
        this._handlers = {};
    }
}
