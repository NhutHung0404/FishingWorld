import { Fish } from "../entities/Fish.js";

// Danh sách tất cả loại cá
export const fishList = [

    new Fish("Cá chép", "Common", 10, 50, "medium"),

    new Fish("Cá rô", "Uncommon", 20, 25, "small"),

    new Fish("Cá lóc", "Rare", 50, 15, "large"),

    new Fish("Cá vàng", "Epic", 100, 7, "small"),

    new Fish("Cá rồng", "Legendary", 300, 2.5, "large"),

    new Fish("Cá thần thoại", "Mythical", 1000, 0.5, "large")

];


// Chọn cá ngẫu nhiên theo tỷ lệ
export function getRandomFish() {

    const totalChance = fishList.reduce(
        (total, fish) => total + fish.chance,
        0
    );

    let random = Math.random() * totalChance;

    for (const fish of fishList) {

        random -= fish.chance;

        if (random <= 0) {
            return fish;
        }

    }

    return fishList[0];

}