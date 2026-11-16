import { Fish } from "../entities/Fish.js";

export const ZONE_LABELS = {
    SHORE: "Bờ Hồ",
    DOCK: "Bến Gỗ",
    DEEP_ROCKS: "Bờ Đá Sâu",
    CENTER_LAKE: "Giữa Hồ Sâu"
};

export const fishList = [
    new Fish("Cá chép", "Common", 12, 34, "medium", {
        minWeight: 0.6, maxWeight: 3.2, xp: 12,
        zones: ["SHORE", "DOCK"], timePhases: ["DAWN", "DAY", "DUSK", "NIGHT"], weathers: ["CLEAR", "RAIN", "MIST"],
        description: "Loài cá nước ngọt phổ biến sống quanh bờ hồ và bến gỗ."
    }),
    new Fish("Cá rô đồng", "Common", 15, 28, "small", {
        minWeight: 0.2, maxWeight: 0.9, xp: 14,
        zones: ["SHORE", "DOCK"], timePhases: ["DAWN", "DAY", "DUSK"], weathers: ["CLEAR", "RAIN"],
        description: "Nhỏ nhắn nhưng nhanh nhẹn, thường đi theo đàn gần bờ."
    }),
    new Fish("Cá diếc", "Common", 14, 26, "small", {
        minWeight: 0.2, maxWeight: 1.1, xp: 13,
        zones: ["SHORE", "DOCK"], timePhases: ["DAY", "DUSK"], weathers: ["CLEAR", "MIST"],
        description: "Thịt ngọt, dễ cắn câu vào ban ngày."
    }),
    new Fish("Cá trê", "Common", 18, 22, "medium", {
        minWeight: 0.8, maxWeight: 3.8, xp: 16,
        zones: ["SHORE", "DEEP_ROCKS"], timePhases: ["DUSK", "NIGHT"], weathers: ["RAIN", "MIST", "CLEAR"],
        description: "Ưa hoạt động về đêm và đặc biệt thích trời mưa."
    }),
    new Fish("Cá mè", "Common", 16, 20, "medium", {
        minWeight: 1.0, maxWeight: 4.5, xp: 15,
        zones: ["DOCK", "CENTER_LAKE"], timePhases: ["DAWN", "DAY"], weathers: ["CLEAR", "MIST"],
        description: "Thường bơi ở tầng nước mặt vào buổi sáng."
    }),
    new Fish("Cá lóc đồng", "Uncommon", 32, 16, "medium", {
        minWeight: 1.1, maxWeight: 4.8, xp: 24,
        zones: ["SHORE", "DOCK", "DEEP_ROCKS"], timePhases: ["DAWN", "DAY", "DUSK"], weathers: ["CLEAR", "RAIN"],
        description: "Kẻ săn mồi hung dữ ẩn nấp gần bụi cỏ ven bờ."
    }),
    new Fish("Cá chình suối", "Uncommon", 38, 13, "medium", {
        minWeight: 0.9, maxWeight: 3.5, xp: 28,
        zones: ["DEEP_ROCKS", "CENTER_LAKE"], timePhases: ["NIGHT", "DUSK"], weathers: ["RAIN", "MIST"],
        description: "Trơn trượt, ẩn mình trong các hốc đá sâu khi màn đêm buông xuống."
    }),
    new Fish("Cá trắm cỏ", "Uncommon", 35, 14, "large", {
        minWeight: 2.0, maxWeight: 8.5, xp: 26,
        zones: ["DOCK", "CENTER_LAKE"], timePhases: ["DAWN", "DAY"], weathers: ["CLEAR"],
        description: "Kích thước lớn và khỏe, cần giữ nhịp kéo ổn định."
    }),
    new Fish("Cá bống tượng", "Uncommon", 42, 12, "small", {
        minWeight: 0.4, maxWeight: 1.8, xp: 30,
        zones: ["DEEP_ROCKS", "SHORE"], timePhases: ["DAWN", "DUSK", "NIGHT"], weathers: ["MIST", "RAIN"],
        description: "Loài cá quý thịt chắc, hay nấp dưới đá."
    })
    ,
    new Fish("Cá lăng đuôi đỏ", "Rare", 75, 8.5, "large", {
        minWeight: 2.5, maxWeight: 11.0, xp: 45,
        zones: ["DEEP_ROCKS", "CENTER_LAKE"], timePhases: ["DUSK", "NIGHT"], weathers: ["RAIN", "CLEAR"],
        description: "Cá da trơn cỡ lớn với chiếc đuôi đỏ rực đặc trưng."
    }),
    new Fish("Cá tầm hồ", "Rare", 85, 7.5, "large", {
        minWeight: 3.0, maxWeight: 14.0, xp: 50,
        zones: ["CENTER_LAKE", "DEEP_ROCKS"], timePhases: ["DAWN", "DAY", "NIGHT"], weathers: ["MIST", "CLEAR"],
        description: "Loài cá cổ đại sống ở tầng nước sâu giữa hồ."
    }),
    new Fish("Cá hồi vân", "Rare", 70, 9.0, "medium", {
        minWeight: 1.5, maxWeight: 5.5, xp: 42,
        zones: ["DOCK", "CENTER_LAKE"], timePhases: ["DAWN", "DAY"], weathers: ["CLEAR", "RAIN"],
        description: "Lớp vảy ánh sắc cầu vồng, bơi rất nhanh."
    }),
    new Fish("Cá sấu hỏa tiễn", "Rare", 95, 6.5, "large", {
        minWeight: 4.0, maxWeight: 16.0, xp: 55,
        zones: ["DEEP_ROCKS", "CENTER_LAKE"], timePhases: ["DAY", "DUSK"], weathers: ["CLEAR", "MIST"],
        description: "Hàm răng sắc nhọn, kéo dây cực kỳ căng thẳng."
    }),
    new Fish("Cá vàng hoàng đế", "Epic", 160, 4.2, "small", {
        minWeight: 0.5, maxWeight: 2.2, xp: 85,
        zones: ["DOCK", "CENTER_LAKE"], timePhases: ["DAWN", "DAY"], weathers: ["CLEAR"],
        description: "Ánh kim rực rỡ dưới nắng, biểu tượng của sự may mắn."
    }),
    new Fish("Cá mặt trăng", "Epic", 190, 3.5, "medium", {
        minWeight: 2.2, maxWeight: 7.5, xp: 95,
        zones: ["CENTER_LAKE", "DEEP_ROCKS"], timePhases: ["NIGHT"], weathers: ["CLEAR", "MIST"],
        description: "Chỉ phát sáng dịu nhẹ khi câu vào ban đêm."
    }),
    new Fish("Cá lôi công", "Epic", 210, 3.2, "large", {
        minWeight: 3.5, maxWeight: 12.0, xp: 105,
        zones: ["DEEP_ROCKS", "CENTER_LAKE"], timePhases: ["DAWN", "DUSK", "NIGHT"], weathers: ["RAIN"],
        description: "Xuất hiện khi mưa giông kéo đến vùng đá sâu."
    }),
    new Fish("Cá rồng huyết long", "Legendary", 420, 1.8, "large", {
        minWeight: 5.0, maxWeight: 18.0, xp: 200,
        zones: ["CENTER_LAKE", "DEEP_ROCKS"], timePhases: ["DAWN", "DUSK", "NIGHT"], weathers: ["CLEAR", "RAIN", "MIST"],
        description: "Vảy đỏ như ngọc, truyền thuyết của giới cần thủ."
    }),
    new Fish("Cá thần thoại Leviathan", "Mythical", 1200, 0.5, "large", {
        minWeight: 12.0, maxWeight: 35.0, xp: 500,
        zones: ["CENTER_LAKE", "DEEP_ROCKS"], timePhases: ["NIGHT", "DUSK"], weathers: ["RAIN", "MIST"],
        description: "Sinh vật huyền bí chỉ lộ diện nơi nước sâu trong đêm sương hoặc mưa."
    })

];

const RARITY_LUCK_MULT = { Common: 0, Uncommon: 0.4, Rare: 1.0, Epic: 1.6, Legendary: 2.2, Mythical: 2.8 };

export function getRandomFish(context = {}) {
    const { zone = "SHORE", timePhase = "DAY", weather = "CLEAR", luckBonus = 0 } = context;

    const pool = fishList.map((fish) => {
        let w = fish.chance;
        w *= fish.zones.includes(zone) ? 1.8 : 0.25;
        w *= fish.timePhases.includes(timePhase) ? 1.5 : 0.35;
        w *= fish.weathers.includes(weather) ? 1.35 : 0.5;
        const factor = RARITY_LUCK_MULT[fish.rarity] ?? 0;
        if (luckBonus > 0 && factor > 0) w *= 1 + luckBonus * factor;
        return { fish, weight: Math.max(0.05, w) };
    });

    const total = pool.reduce((sum, e) => sum + e.weight, 0);
    let rand = Math.random() * total;
    for (const entry of pool) {
        rand -= entry.weight;
        if (rand <= 0) return entry.fish.clone();
    }
    return fishList[0].clone();
}