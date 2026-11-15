const QUEST_TEMPLATES = [
    { id: "catch_any_5", title: "Khởi động cần câu", description: "Câu thành công 5 con cá bất kỳ.", type: "catch_any", target: 5, rewardGold: 80, rewardXp: 60 },
    { id: "catch_rare_2", title: "Thợ săn cá hiếm", description: "Câu được 2 con cá từ độ hiếm Rare trở lên.", type: "catch_rare_plus", target: 2, rewardGold: 220, rewardXp: 150 },
    { id: "sell_gold_200", title: "Thương vụ đầu tiên", description: "Bán cá kiếm tổng cộng 200 vàng.", type: "sell_gold", target: 200, rewardGold: 100, rewardXp: 80 },
    { id: "catch_night_2", title: "Cú đêm bên hồ", description: "Câu được 2 con cá vào Ban đêm hoặc Hoàng hôn.", type: "catch_night", target: 2, rewardGold: 160, rewardXp: 120 },
    { id: "catch_rain_2", title: "Ngư ông trong mưa", description: "Câu được 2 con cá khi trời đang mưa.", type: "catch_rain", target: 2, rewardGold: 180, rewardXp: 130 },
    { id: "perfect_hit_3", title: "Bậc thầy canh chuẩn", description: "Đạt 3 lần đánh trúng vùng Perfect trong mini-game.", type: "perfect_hit", target: 3, rewardGold: 140, rewardXp: 110 }
];

const RARE_PLUS = new Set(["Rare", "Epic", "Legendary", "Mythical"]);

export class QuestSystem {
    constructor(eventBus = null) {
        this.eventBus = eventBus;
        this.quests = this.createInitialQuests();
    }

    createInitialQuests() {
        return QUEST_TEMPLATES.map((tpl) => ({ ...tpl, progress: 0, claimed: false }));
    }

    onFishCaught(fish, context = {}) {
        if (!fish) return;
        let updated = false;
        for (const quest of this.quests) {
            if (quest.claimed || quest.progress >= quest.target) continue;
            if (quest.type === "catch_any") {
                quest.progress = Math.min(quest.target, quest.progress + 1);
                updated = true;
            } else if (quest.type === "catch_rare_plus" && RARE_PLUS.has(fish.rarity)) {
                quest.progress = Math.min(quest.target, quest.progress + 1);
                updated = true;
            } else if (quest.type === "catch_night" && (context.timePhase === "NIGHT" || context.timePhase === "DUSK")) {
                quest.progress = Math.min(quest.target, quest.progress + 1);
                updated = true;
            } else if (quest.type === "catch_rain" && context.weather === "RAIN") {
                quest.progress = Math.min(quest.target, quest.progress + 1);
                updated = true;
            }
        }
        if (updated) this.eventBus?.emit("quests:updated", this.quests);
    }

    onFishSold(goldEarned) {
        if (goldEarned <= 0) return;
        let updated = false;
        for (const quest of this.quests) {
            if (quest.claimed || quest.progress >= quest.target) continue;
            if (quest.type === "sell_gold") {
                quest.progress = Math.min(quest.target, quest.progress + goldEarned);
                updated = true;
            }
        }
        if (updated) this.eventBus?.emit("quests:updated", this.quests);
    }

    onPerfectHit(count = 1) {
        let updated = false;
        for (const quest of this.quests) {
            if (quest.claimed || quest.progress >= quest.target) continue;
            if (quest.type === "perfect_hit") {
                quest.progress = Math.min(quest.target, quest.progress + count);
                updated = true;
            }
        }
        if (updated) this.eventBus?.emit("quests:updated", this.quests);
    }

    canClaim(questId) {
        const quest = this.quests.find((q) => q.id === questId);
        return Boolean(quest && !quest.claimed && quest.progress >= quest.target);
    }

    claimQuest(questId, { inventory, progression }) {
        const quest = this.quests.find((q) => q.id === questId);
        if (!quest || quest.claimed || quest.progress < quest.target) {
            return { success: false, message: "Nhiệm vụ chưa hoàn thành!" };
        }
        quest.claimed = true;
        inventory.gold += quest.rewardGold;
        inventory.emitChanged();
        this.eventBus?.emit("gold:changed", { gold: inventory.gold, delta: quest.rewardGold });
        const xpResult = progression.addXp(quest.rewardXp);
        this.eventBus?.emit("quests:updated", this.quests);
        return { success: true, quest, rewardGold: quest.rewardGold, rewardXp: quest.rewardXp, xpResult };
    }

    resetCompletedQuests() {
        let resetAny = false;
        for (const quest of this.quests) {
            if (quest.claimed) {
                quest.progress = 0;
                quest.claimed = false;
                resetAny = true;
            }
        }
        if (resetAny) this.eventBus?.emit("quests:updated", this.quests);
        return resetAny;
    }

    getClaimableCount() {
        return this.quests.filter((q) => !q.claimed && q.progress >= q.target).length;
    }

    toJSON() {
        return {
            quests: this.quests.map((q) => ({ id: q.id, progress: q.progress, claimed: q.claimed }))
        };
    }

    fromJSON(data) {
        if (!data || !Array.isArray(data.quests)) return;
        const savedMap = new Map(data.quests.map((q) => [q.id, q]));
        this.quests = QUEST_TEMPLATES.map((tpl) => {
            const saved = savedMap.get(tpl.id);
            return {
                ...tpl,
                progress: saved ? Math.min(tpl.target, Math.max(0, Number(saved.progress) || 0)) : 0,
                claimed: Boolean(saved?.claimed)
            };
        });
        this.eventBus?.emit("quests:updated", this.quests);
    }
}
