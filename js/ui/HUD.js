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
        this.messageEl = elements.messageEl;

        this.messageTimeout = null;
        this.saveStatusTimeout = null;
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

    updateInventorySummary({ fishCount, gold }) {
        if (this.fishCountEl) {
            this.fishCountEl.textContent = fishCount;
        }
        if (this.inventoryCountEl) {
            this.inventoryCountEl.textContent = fishCount;
        }
        if (this.goldEl) {
            this.goldEl.textContent = gold;
        }
        if (this.topGoldEl) {
            this.topGoldEl.textContent = `🪙 ${gold} Gold`;
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
    }
}
