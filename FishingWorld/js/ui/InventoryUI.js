export class InventoryUI {
    constructor(elements) {
        this.inventoryUI = elements.inventoryUI;
        this.inventoryCount = elements.inventoryCount;
        this.inventoryTotal = elements.inventoryTotal;
        this.goldText = elements.goldText;
        this.inventoryGold = elements.inventoryGold;
        this.fishListUI = elements.fishListUI;
        this.fishCountText = elements.fishCountText;
    }

    // Mở túi cá
    open() {
        this.inventoryUI.style.display = "block";
    }

    // Đóng túi cá
    close() {
        this.inventoryUI.style.display = "none";
    }

    // Hiển thị danh sách cá
    render(inventory) {
        const fishList = inventory.fishList;

        this.inventoryCount.textContent = fishList.length;
        this.inventoryTotal.textContent = fishList.length;

        
        this.inventoryGold.textContent = inventory.gold;

        if (fishList.length === 0) {
            this.fishListUI.innerHTML = "Chưa có cá nào!";
            return;
        }

        this.fishListUI.innerHTML = "";

        fishList.forEach((fish, index) => {
            const item = document.createElement("div");
            item.className = "fish-item";

            item.innerHTML = `
                <div>
                    🐟 <strong>${fish.name}</strong>
                    <br>
                    <small>${fish.rarity} | ${fish.price} vàng</small>
                </div>

                <button data-index="${index}">
                    Bán
                </button>
            `;

            this.fishListUI.appendChild(item);
        });
    }

    // Cập nhật HUD
    updateHud(inventory) {
        this.fishCountText.textContent = inventory.getFishCount();
        this.goldText.textContent = inventory.gold;
    }
}

