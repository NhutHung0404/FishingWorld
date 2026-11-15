export const RODS = [
    {
        id: "wooden_rod",
        name: "Cần Tre Cổ Điển",
        price: 0,
        minLevel: 1,
        description: "Cần câu cơ bản dành cho người mới bắt đầu.",
        speedMult: 1.0,
        targetScaleBonus: 0,
        luckBonus: 0,
        tensionResist: 1.0,
        biteSpeedBonus: 0
    },
    {
        id: "bamboo_rod",
        name: "Cần Trúc Thanh",
        price: 150,
        minLevel: 1,
        description: "Nhẹ và dẻo dai, tăng nhẹ độ rộng mục tiêu và may mắn.",
        speedMult: 0.95,
        targetScaleBonus: 0.1,
        luckBonus: 0.1,
        tensionResist: 1.15,
        biteSpeedBonus: 0.1
    },
    {
        id: "fiberglass_rod",
        name: "Cần Sợi Thủy Tinh",
        price: 450,
        minLevel: 2,
        description: "Bền bỉ, giảm căng dây tốt khi đối đầu cá hiếm.",
        speedMult: 0.9,
        targetScaleBonus: 0.18,
        luckBonus: 0.2,
        tensionResist: 1.3,
        biteSpeedBonus: 0.18
    },
    {
        id: "carbon_rod",
        name: "Cần Carbon Pro",
        price: 1200,
        minLevel: 4,
        description: "Cần câu chuyên nghiệp giúp câu cá Epic & Legendary dễ hơn.",
        speedMult: 0.85,
        targetScaleBonus: 0.25,
        luckBonus: 0.35,
        tensionResist: 1.5,
        biteSpeedBonus: 0.25
    },
    {
        id: "golden_rod",
        name: "Cần Hoàng Kim",
        price: 3000,
        minLevel: 6,
        description: "Bảo vật của ngư ông, tối đa hóa may mắn và sức bền dây.",
        speedMult: 0.8,
        targetScaleBonus: 0.35,
        luckBonus: 0.55,
        tensionResist: 1.75,
        biteSpeedBonus: 0.35
    }
];

export const BAITS = [
    {
        id: "worm_bait",
        name: "Mồi Giun Đất",
        price: 15,
        bundleSize: 5,
        minLevel: 1,
        description: "Cá cắn câu nhanh hơn, tăng nhẹ tỷ lệ cá hiếm.",
        luckBonus: 0.1,
        biteSpeedBonus: 0.15
    },
    {
        id: "cricket_bait",
        name: "Mồi Dế Mèn",
        price: 35,
        bundleSize: 5,
        minLevel: 2,
        description: "Thu hút cá nước ngọt cỡ vừa và lớn.",
        luckBonus: 0.22,
        biteSpeedBonus: 0.25
    },
    {
        id: "shrimp_bait",
        name: "Mồi Tôm Tươi",
        price: 75,
        bundleSize: 5,
        minLevel: 3,
        description: "Mồi cao cấp giúp thu hút cá Rare và Epic.",
        luckBonus: 0.38,
        biteSpeedBonus: 0.35
    },
    {
        id: "mythic_lure",
        name: "Mồi Giả Huyền Thoại",
        price: 160,
        bundleSize: 3,
        minLevel: 5,
        description: "Phát sáng dưới nước, chuyên săn cá Legendary & Mythical.",
        luckBonus: 0.65,
        biteSpeedBonus: 0.45
    }
];

export const BAG_UPGRADES = [
    { level: 1, capacity: 50, price: 0, name: "Túi Vải (50)" },
    { level: 2, capacity: 75, price: 200, name: "Túi Da Nhỏ (75)" },
    { level: 3, capacity: 100, price: 500, name: "Túi Ngư Dân (100)" },
    { level: 4, capacity: 150, price: 1200, name: "Thùng Bảo Quản (150)" },
    { level: 5, capacity: 220, price: 2500, name: "Khoang Lạnh Thần Kỳ (220)" }
];

export function getRodById(id) {
    return RODS.find((rod) => rod.id === id) || RODS[0];
}

export function getBaitById(id) {
    return BAITS.find((bait) => bait.id === id) || null;
}
