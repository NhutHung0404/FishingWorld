export class Inventory {
    constructor() {
        this.fishList = [];
        this.gold = 100;
    }

    // Thêm cá vào túi
    addFish(fish) {
        this.fishList.push(fish);
    }

    // Bán một con cá
    sellFish(index) {
        const fish = this.fishList[index];

        if (!fish) return null;

        this.gold += fish.price;
        this.fishList.splice(index, 1);

        return fish;
    }

    // Bán tất cả cá
    sellAllFish() {
    if (this.fishList.length === 0) return 0;

    let totalMoney = 0;

    this.fishList.forEach(fish => {
        totalMoney += fish.price;
    });

    this.gold += totalMoney;

    // Xóa cá trong mảng hiện tại
    this.fishList.length = 0;

    return totalMoney;
}

    // Lấy số lượng cá
    getFishCount() {
        return this.fishList.length;
    }
}