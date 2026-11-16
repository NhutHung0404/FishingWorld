export class FishingMiniGame {
    constructor() {
        this.position = 0;
        this.direction = 1;
        this.speed = 1.15;
        this.duration = 12;
        this.timeLeft = 12;
        this.score = 0;
        this.combo = 0;
        this.perfectHits = 0;
        this.requiredScore = 3;

        this.tension = 0;
        this.hasTension = false;
        this.tensionRate = 0;
        this.tensionResist = 1.0;

        this.targets = [];
        this.generateTargets(1.0);
    }

    generateTargets(scale = 1.0) {
        const count = 4;
        const slotWidth = 1 / count;
        const generated = [];

        for (let i = 0; i < count; i++) {
            const baseWidth = 0.08 + Math.random() * 0.07;
            const scaledWidth = Math.min(0.2, Math.max(0.045, baseWidth * scale));
            const slotStart = i * slotWidth + 0.02;
            const maxStart = (i + 1) * slotWidth - scaledWidth - 0.02;
            const start = maxStart > slotStart
                ? slotStart + Math.random() * (maxStart - slotStart)
                : slotStart;

            const perfectWidth = scaledWidth * 0.32;
            const perfectStart = start + (scaledWidth - perfectWidth) / 2;

            generated.push({
                start,
                width: scaledWidth,
                perfectStart,
                perfectWidth,
                hit: false,
                perfect: false
            });
        }

        this.targets = generated;
    }

    start(fish, bonuses = {}) {
        this.position = 0;
        this.direction = 1;
        this.timeLeft = this.getFishTimeLimit(fish);
        this.speed = this.getFishSpeed(fish) * (bonuses.speedMult || 1.0);
        this.score = 0;
        this.combo = 0;
        this.perfectHits = 0;
        this.requiredScore = fish.rarity === "Mythical" || fish.rarity === "Legendary" ? 4 : 3;

        this.tensionResist = bonuses.tensionResist || 1.0;
        this.tensionRate = this.getTensionRate(fish);
        this.hasTension = this.tensionRate > 0;
        this.tension = this.hasTension ? 22 : 0;

        const scale = this.getTargetScale(fish, bonuses.targetScaleBonus || 0);
        this.generateTargets(scale);
    }

    reset() {
        this.position = 0;
        this.direction = 1;
        this.score = 0;
        this.combo = 0;
        this.perfectHits = 0;
        this.timeLeft = this.duration;
        this.tension = 0;
        this.hasTension = false;
        this.tensionRate = 0;
        this.targets.forEach((target) => {
            target.hit = false;
            target.perfect = false;
        });
    }

    update(deltaTime) {
        this.timeLeft -= deltaTime;

        this.position += this.direction * this.speed * deltaTime;
        if (this.position >= 1) {
            this.position = 1;
            this.direction = -1;
        }
        if (this.position <= 0) {
            this.position = 0;
            this.direction = 1;
        }

        if (this.hasTension) {
            this.tension += (this.tensionRate / this.tensionResist) * deltaTime;
            if (this.tension >= 100) {
                this.tension = 100;
                return { timedOut: false, snapped: true };
            }
        }

        return { timedOut: this.timeLeft <= 0, snapped: false };
    }

    getFishSpeed(fish) {
        const speeds = { Common: 1.0, Uncommon: 1.12, Rare: 1.3, Epic: 1.48, Legendary: 1.68, Mythical: 1.88 };
        return speeds[fish.rarity] || 1.0;
    }

    getTargetScale(fish, bonus = 0) {
        let base = 1.0;
        if (fish.size === "large") base = 0.65;
        else if (fish.size === "small") base = 1.18;
        return Math.max(0.5, base + bonus);
    }

    getFishTimeLimit(fish) {
        const times = { Common: 15, Uncommon: 14, Rare: 12, Epic: 11, Legendary: 10, Mythical: 9 };
        return times[fish.rarity] || 12;
    }

    getTensionRate(fish) {
        const rates = { Common: 0, Uncommon: 0, Rare: 7.5, Epic: 10.5, Legendary: 13.5, Mythical: 17.0 };
        return rates[fish.rarity] || 0;
    }

    press() {
        for (let i = 0; i < this.targets.length; i++) {
            const target = this.targets[i];
            if (target.hit) continue;

            const start = target.start;
            const end = start + target.width;

            if (this.position >= start && this.position <= end) {
                const isPerfect =
                    this.position >= target.perfectStart &&
                    this.position <= target.perfectStart + target.perfectWidth;

                target.hit = true;
                target.perfect = isPerfect;
                this.score += isPerfect ? 2 : 1;
                this.combo += 1;
                if (isPerfect) this.perfectHits += 1;

                if (this.hasTension) {
                    const relief = isPerfect ? 28 : 16;
                    this.tension = Math.max(0, this.tension - relief);
                }

                return {
                    hit: true,
                    perfect: isPerfect,
                    index: i,
                    score: this.score,
                    combo: this.combo,
                    tension: this.tension,
                    snapped: false,
                    completed: this.score >= this.requiredScore
                };
            }
        }

        this.combo = 0;
        let snapped = false;
        if (this.hasTension) {
            this.tension = Math.min(100, this.tension + 20 / this.tensionResist);
            if (this.tension >= 100) snapped = true;
        }

        return {
            hit: false,
            perfect: false,
            index: -1,
            score: this.score,
            combo: this.combo,
            tension: this.tension,
            snapped,
            completed: false
        };
    }
}