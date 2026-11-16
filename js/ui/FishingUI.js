export class FishingUI {
    constructor(elements) {
        this.timingUI = elements.timingUI;
        this.timingTrack = elements.timingTrack || null;
        this.timingMarker = elements.timingMarker;
        this.timingScoreText = elements.timingScoreText;
        this.comboText = elements.comboText;
        this.fishingTimer = elements.fishingTimer;
        this.targetElements = elements.targetElements;
        this.fishingStatus = elements.fishingStatus;
        this.fishingPanel = elements.fishingPanel;
        this.tensionBox = elements.tensionBox || null;
        this.tensionFill = elements.tensionFill || null;
        this.tensionText = elements.tensionText || null;
        this.reelBtn = elements.reelBtn || null;
    }

    bindPressHandler(onPress) {
        this.timingTrack?.addEventListener("pointerdown", (e) => {
            e.preventDefault();
            onPress?.();
        });
        this.reelBtn?.addEventListener("pointerdown", (e) => {
            e.preventDefault();
            this.reelBtn.blur();
            onPress?.();
        });
    }

    updateTiming(miniGame) {
        this.timingMarker.style.left = (miniGame.position * 100) + "%";
        this.timingScoreText.textContent = miniGame.score + " / " + miniGame.requiredScore;
        this.comboText.textContent = "🔥 Combo x" + miniGame.combo;

        if (this.tensionBox && this.tensionFill && this.tensionText) {
            if (miniGame.hasTension) {
                this.tensionBox.style.display = "block";
                const pct = Math.max(0, Math.min(100, Math.round(miniGame.tension)));
                this.tensionFill.style.width = pct + "%";
                this.tensionFill.style.background =
                    pct >= 75 ? "#ef5350" : pct >= 45 ? "#ffa726" : "#66bb6a";
                this.tensionText.textContent = `Căng dây: ${pct}%`;
            } else {
                this.tensionBox.style.display = "none";
            }
        }
    }

    configureTargets(miniGame) {
        miniGame.targets.forEach((target, index) => {
            const element = this.targetElements[index];
            if (!element) return;

            target.hit = false;
            element.style.left = (target.start * 100) + "%";
            element.style.width = (target.width * 100) + "%";
            element.classList.remove("hit", "perfect");

            let perfectEl = element.querySelector(".timing-perfect");
            if (!perfectEl) {
                perfectEl = document.createElement("div");
                perfectEl.className = "timing-perfect";
                element.appendChild(perfectEl);
            }
            const relLeft = ((target.perfectStart - target.start) / target.width) * 100;
            const relWidth = (target.perfectWidth / target.width) * 100;
            perfectEl.style.left = relLeft + "%";
            perfectEl.style.width = relWidth + "%";
        });
    }

    showFishingStatus(status) {
        this.fishingStatus.textContent = status;
    }

    showFishingTimer(timer) {
        this.fishingTimer.textContent = timer;
    }

    hideFishingTimer() {
        this.fishingTimer.style.display = "none";
    }

    showFishingTimerElement() {
        this.fishingTimer.style.display = "block";
    }

    showFishingPanel() {
        this.fishingPanel.style.display = "block";
    }

    hideFishingPanel() {
        this.fishingPanel.style.display = "none";
    }

    showTiming() {
        this.timingUI.style.display = "block";
    }

    hideTiming() {
        this.timingUI.style.display = "none";
    }

    markTargetHit(index, isPerfect = false) {
        const el = this.targetElements[index];
        if (!el) return;
        el.classList.add("hit");
        if (isPerfect) el.classList.add("perfect");
    }
}