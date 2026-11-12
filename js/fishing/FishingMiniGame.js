export class FishingMiniGame {

    constructor() {
        // Trạng thái thanh timing
        this.position = 0;
        this.direction = 1;
        this.speed = 1.15;

        // Thời gian
        this.duration = 12;
        this.timeLeft = 12;

        // Điểm và combo
        this.score = 0;
        this.combo = 0;
        this.requiredScore = 3;

        // Các vùng mục tiêu
        this.targets = [
            { start: 0.08, width: 0.09, hit: false },
            { start: 0.29, width: 0.16, hit: false },
            { start: 0.55, width: 0.07, hit: false },
            { start: 0.78, width: 0.13, hit: false }
        ];
    }

    update(deltaTime) {
    // Giảm thời gian
    this.timeLeft -= deltaTime;

    // Di chuyển thanh timing
    this.position +=
        this.direction *
        this.speed *
        deltaTime;

    // Chạm biên phải
    if (this.position >= 1) {
        this.position = 1;
        this.direction = -1;
    }

    // Chạm biên trái
    if (this.position <= 0) {
        this.position = 0;
        this.direction = 1;
    }

    // Hết thời gian
    return this.timeLeft <= 0;
}

    // Bắt đầu mini-game
    start(fish) {
        this.position = 0;
        this.direction = 1;
        this.timeLeft = this.getFishTimeLimit(fish);
        this.speed = this.getFishSpeed(fish);
        this.score = 0;
        this.combo = 0;

        this.targets.forEach(target => {
            target.hit = false;
        });
    }

    // Tốc độ theo độ hiếm
    getFishSpeed(fish) {
        const speeds = {
            Common: 1.0,
            Uncommon: 1.1,
            Rare: 1.3,
            Epic: 1.5,
            Legendary: 1.7,
            Mythical: 1.9
        };

        return speeds[fish.rarity] || 1.0;
    }

    // Kích thước vùng mục tiêu
    getTargetScale(fish) {
        if (fish.size === "large") return 0.55;
        if (fish.size === "small") return 1.2;

        return 1.0;
    }

    // Thời gian theo độ hiếm
    getFishTimeLimit(fish) {
        const times = {
            Common: 15,
            Uncommon: 13,
            Rare: 11,
            Epic: 9,
            Legendary: 8,
            Mythical: 6
        };

        return times[fish.rarity] || 12;
    }

    press(fish) {
    const scale = this.getTargetScale(fish);

    for (let i = 0; i < this.targets.length; i++) {
        const target = this.targets[i];

        if (target.hit) continue;

        const start = target.start;
        const end = start + target.width * scale;

        if (this.position >= start && this.position <= end) {
            target.hit = true;
            this.score++;
            this.combo++;

            return {
                hit: true,
                index: i,
                score: this.score,
                combo: this.combo,
                completed: this.score >= this.requiredScore
            };
        }
    }

    this.combo = 0;

    return {
        hit: false,
        index: -1,
        score: this.score,
        combo: this.combo,
        completed: false
    };
}
}