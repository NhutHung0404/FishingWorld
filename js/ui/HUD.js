export class HUD {
    constructor(elements) {
        this.playerNameEl = elements.playerNameEl;
        this.timeDisplayEl = elements.timeDisplayEl;
        this.weatherDisplayEl = elements.weatherDisplayEl;
        this.topGoldEl = elements.topGoldEl;
        this.saveStatusEl = elements.saveStatusEl;
        this.fishCountEl = elements.fishCountEl;
        this.goldEl = elements.goldEl;
        this.inventoryCountEl = elements.inventoryCountEl;
        this.levelDisplayEl = elements.levelDisplayEl || null;
        this.topXpBar = elements.topXpBar || null;
        this.equipDisplayEl = elements.equipDisplayEl || null;
        this.questBadgeEl = elements.questBadgeEl || null;
        this.messageEl = elements.messageEl;

        this.messageTimeout = null;
        this.saveStatusTimeout = null;
        this.goldAnimTimeout = null;
        this.lastGold = null;
    }

    updateTimeAndWeather(timeText, weatherText) {
        if (this.timeDisplayEl) {
            this.timeDisplayEl.textContent = timeText;
        }
        if (this.weatherDisplayEl) {
            this.weatherDisplayEl.textContent = weatherText;
        }
    }

    updatePlayerName(name) {
        if (this.playerNameEl) {
            this.playerNameEl.textContent = `👤 Người chơi: ${name}`;
        }
    }

    updateInventorySummary({ fishCount, gold } = {}) {
        if (this.fishCountEl && fishCount !== undefined) {
            this.fishCountEl.textContent = fishCount;
        }
        if (this.inventoryCountEl && fishCount !== undefined) {
            this.inventoryCountEl.textContent = fishCount;
        }

        const safeGold = Number(gold);
        if (Number.isFinite(safeGold)) {
            if (this.goldEl) {
                this.goldEl.textContent = safeGold;
            }
            if (this.topGoldEl) {
                this.topGoldEl.textContent = `🪙 ${safeGold} Gold`;
            }

            if (this.lastGold !== null && safeGold !== this.lastGold) {
                this.triggerGoldAnimation(safeGold > this.lastGold);
            }
            this.lastGold = safeGold;
        }
    }

    triggerGoldAnimation(isGain) {
        if (!this.topGoldEl) return;

        this.topGoldEl.classList.remove("gold-gain", "gold-loss");
        void this.topGoldEl.offsetWidth;
        this.topGoldEl.classList.add(isGain ? "gold-gain" : "gold-loss");

        clearTimeout(this.goldAnimTimeout);
        this.goldAnimTimeout = setTimeout(() => {
            this.topGoldEl?.classList.remove("gold-gain", "gold-loss");
            this.goldAnimTimeout = null;
        }, 450);
    }

    updateProgression({ level, xp, nextXp } = {}) {
        const safeLevel = Number.isFinite(Number(level)) ? Number(level) : 1;
        const safeXp = Number.isFinite(Number(xp)) ? Math.max(0, Number(xp)) : 0;
        const safeNextXp = Number.isFinite(Number(nextXp)) ? Number(nextXp) : 0;

        if (this.levelDisplayEl) {
            this.levelDisplayEl.textContent = `⭐ Lv.${safeLevel} (${safeXp}/${safeNextXp})`;
        }
        if (this.topXpBar) {
            const pct = safeNextXp > 0
                ? Math.min(100, Math.max(0, (safeXp / safeNextXp) * 100))
                : 0;
            this.topXpBar.style.width = `${pct}%`;
        }
    }

    updateEquipment({ rod, bait, baitCount }) {
        if (this.equipDisplayEl) {
            const baitText = bait ? `${bait.name} (${baitCount})` : "Không mồi";
            this.equipDisplayEl.textContent = `🎣 ${rod.name} | 🪱 ${baitText}`;
        }
    }

    updateQuestBadge(count) {
        if (this.questBadgeEl) {
            this.questBadgeEl.textContent = count > 0 ? ` (${count})` : "";
        }
    }

    showMessage(text, durationMs = 2500) {
        if (!this.messageEl) return;

        this.messageEl.textContent = text;
        this.messageEl.style.display = "block";

        clearTimeout(this.messageTimeout);
        this.messageTimeout = setTimeout(() => {
            this.messageEl.style.display = "none";
        }, durationMs);
    }

    showSaveIndicator(text = "💾 Đã lưu", durationMs = 1800) {
        if (!this.saveStatusEl) return;

        this.saveStatusEl.textContent = text;
        this.saveStatusEl.style.opacity = "1";

        clearTimeout(this.saveStatusTimeout);
        this.saveStatusTimeout = setTimeout(() => {
            this.saveStatusEl.style.opacity = "0.7";
            this.saveStatusEl.textContent = "💾 Tự động lưu";
        }, durationMs);
    }

    destroy() {
        clearTimeout(this.messageTimeout);
        clearTimeout(this.saveStatusTimeout);
        clearTimeout(this.goldAnimTimeout);
        this.messageTimeout = null;
        this.saveStatusTimeout = null;
        this.goldAnimTimeout = null;
        this.topGoldEl?.classList.remove("gold-gain", "gold-loss");
    }
}
