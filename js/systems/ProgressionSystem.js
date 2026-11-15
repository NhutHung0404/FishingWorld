export class ProgressionSystem {
    constructor(eventBus = null) {
        this.eventBus = eventBus;
        this.level = 1;
        this.xp = 0;
    }

    getXpForNextLevel(level = this.level) {
        return Math.round(100 * Math.pow(level, 1.35));
    }

    addXp(amount) {
        const gained = Math.max(0, Math.round(Number(amount) || 0));
        if (gained === 0) return { gained: 0, leveledUp: false, newLevel: this.level };

        this.xp += gained;
        let leveledUp = false;
        const oldLevel = this.level;

        while (this.xp >= this.getXpForNextLevel(this.level)) {
            this.xp -= this.getXpForNextLevel(this.level);
            this.level += 1;
            leveledUp = true;
        }

        this.eventBus?.emit("progression:updated", this.getSummary());

        if (leveledUp) {
            this.eventBus?.emit("player:level_up", {
                oldLevel,
                newLevel: this.level
            });
        }

        return { gained, leveledUp, newLevel: this.level };
    }

    getSummary() {
        const nextXp = this.getXpForNextLevel(this.level);
        return {
            level: this.level,
            xp: this.xp,
            nextXp,
            percent: Math.min(100, Math.round((this.xp / nextXp) * 100))
        };
    }

    toJSON() {
        return {
            level: this.level,
            xp: this.xp
        };
    }

    fromJSON(data) {
        if (!data || typeof data !== "object") return;
        this.level = Math.max(1, Number(data.level) || 1);
        this.xp = Math.max(0, Number(data.xp) || 0);
        this.eventBus?.emit("progression:updated", this.getSummary());
    }
}
