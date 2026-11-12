export class FishingUI {
    constructor(elements) {
        this.timingUI = elements.timingUI;
        this.timingMarker = elements.timingMarker;
        this.timingScoreText = elements.timingScoreText;
        this.comboText = elements.comboText;
        this.fishingTimer = elements.fishingTimer;
        this.targetElements = elements.targetElements;
        this.fishingStatus = elements.fishingStatus;
        this.fishingPanel = elements.fishingPanel;
    }

    updateTiming(miniGame) {
        this.timingMarker.style.left =
            (miniGame.position * 100) + "%";

        this.timingScoreText.textContent =
            miniGame.score + " / " + miniGame.requiredScore;

        this.comboText.textContent =
            "🔥 Combo x" + miniGame.combo;
    }

    configureTargets(miniGame, scale) {
        miniGame.targets.forEach((target, index) => {
            const element = this.targetElements[index];

            target.hit = false;

            element.style.left =
                (target.start * 100) + "%";

            element.style.width =
                (target.width * scale * 100) + "%";

            element.classList.remove("hit");
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

    markTargetHit(index) {
        this.targetElements[index].classList.add("hit");
    }
}