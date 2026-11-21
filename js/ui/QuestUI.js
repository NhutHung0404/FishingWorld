export class QuestUI {
    constructor(elements = {}) {
        this.modal = elements.questsModal || elements.modal || null;
        this.bodyEl = elements.questsBody || elements.bodyEl || null;
        this.closeBtn = elements.closeQuestsBtn || elements.closeBtn || null;
        this.openBtn = elements.openQuestsBtn || elements.openBtn || null;
        this.resetBtn = elements.resetQuestsBtn || elements.resetBtn || null;

        this._handlers = {};
        this._onOpenClick = null;
        this._onCloseClick = null;
        this._onResetClick = null;
        this._onBodyClick = null;
    }

    bindEvents(handlers = {}) {
        this._handlers = handlers;

        if (this.openBtn && !this._onOpenClick) {
            this._onOpenClick = () => {
                this.openBtn.blur();
                if (this._handlers.onOpenQuests) {
                    this._handlers.onOpenQuests();
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
                    this._handlers.onCloseModal("quests");
                } else if (this._handlers.onClose) {
                    this._handlers.onClose();
                }
            };
            this.closeBtn.addEventListener("click", this._onCloseClick);
        }

        if (this.resetBtn && !this._onResetClick) {
            this._onResetClick = () => {
                this.resetBtn.blur();
                if (this._handlers.onResetQuests) {
                    this._handlers.onResetQuests();
                } else if (this._handlers.onReset) {
                    this._handlers.onReset();
                }
            };
            this.resetBtn.addEventListener("click", this._onResetClick);
        }

        if (this.bodyEl && !this._onBodyClick) {
            this._onBodyClick = (e) => {
                const btn = e.target.closest("button[data-claim]");
                if (!btn) return;
                btn.blur();
                if (this._handlers.onClaimQuest) {
                    this._handlers.onClaimQuest(btn.dataset.claim);
                } else if (this._handlers.onClaim) {
                    this._handlers.onClaim(btn.dataset.claim);
                }
            };
            this.bodyEl.addEventListener("click", this._onBodyClick);
        }
    }

    isOpen() {
        return this.modal?.style.display === "block";
    }

    open(questSystem) {
        this.render(questSystem);
        if (this.modal) this.modal.style.display = "block";
    }

    close() {
        if (this.modal) this.modal.style.display = "none";
    }

    render(questSystem) {
        if (!this.bodyEl || !questSystem) return;
        this.bodyEl.innerHTML = questSystem.quests.map((q) => {
            const done = q.progress >= q.target;
            const statusBtn = q.claimed
                ? `<button disabled>Đã nhận</button>`
                : done
                    ? `<button data-claim="${q.id}" class="claim-btn">Nhận thưởng</button>`
                    : `<button disabled>${q.progress}/${q.target}</button>`;
            return `<div class="shop-row"><div><strong>${q.title}</strong><br><small>${q.description}</small><br><small>Thưởng: 🪙 ${q.rewardGold}G + ⭐ ${q.rewardXp} XP</small></div>${statusBtn}</div>`;
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
        if (this.resetBtn && this._onResetClick) {
            this.resetBtn.removeEventListener("click", this._onResetClick);
            this._onResetClick = null;
        }
        if (this.bodyEl && this._onBodyClick) {
            this.bodyEl.removeEventListener("click", this._onBodyClick);
            this._onBodyClick = null;
        }
        this._handlers = {};
    }
}
