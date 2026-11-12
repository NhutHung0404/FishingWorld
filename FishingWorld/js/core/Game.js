import { FishingSystem } from "../fishing/FishingSystem.js";
import { FishingMiniGame } from "../fishing/FishingMiniGame.js";
import { FishingUI } from "../ui/FishingUI.js";
import { Inventory } from "../systems/Inventory.js";
import { AudioManager } from "../systems/AudioManager.js";
import { InventoryUI } from "../ui/InventoryUI.js";
import { EffectManager } from "../systems/EffectManager.js";
import { Player } from "../entities/Player.js";
import { Camera } from "./Camera.js";
import { FishingRod } from "../fishing/FishingRod.js";
import { World } from "../world/World.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const fishingSystem = new FishingSystem();
const fishing = fishingSystem;

ctx.imageSmoothingEnabled = false;

// ==============================
// 1. CAU HINH THE GIOI
// ==============================

const world = new World();
const TILE = 32;

const player = new Player(900, 760);
const fishingRod = new FishingRod();

const camera = new Camera(
    canvas,
    world.width,
    world.height
);

const { lake, dock, trees } = world;
const keys = {};

window.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();

    if ([
        "w", "a", "s", "d",
        "arrowup", "arrowdown",
        "arrowleft", "arrowright"
    ].includes(key)) {
        e.preventDefault();
    }

    keys[key] = true;
});

window.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
});

window.addEventListener("blur", () => {
    for (const key in keys) {
        keys[key] = false;
    }
});

// ==============================
// 5. KIEM TRA HO NUOC
// ==============================

function isWater(x, y) {
    const dx = (x - lake.x) / lake.rx;
    const dy = (y - lake.y) / lake.ry;

    return dx * dx + dy * dy < 1;
}

// Kiem tra mot diem co nam tren ben go khong
function onDock(x, y) {
    return (
        x >= dock.x &&
        x <= dock.x + dock.width &&
        y >= dock.y &&
        y <= dock.y + dock.height
    );
}

// ==============================
// 6. KIEM TRA VA CHAM
// ==============================

function canMoveTo(x, y) {

    // Gioi han ban do
    if (
        x < 15 ||
        y < 15 ||
        x > world.width - 15 ||
        y > world.height - 15
    ) {
        return false;
    }

    // Kiem tra 4 goc nhan vat
    const points = [
        [x - 10, y - 12],
        [x + 10, y - 12],
        [x - 10, y + 12],
        [x + 10, y + 12]
    ];

    for (const [px, py] of points) {

        // Khong cho di xuong nuoc
        if (isWater(px, py) && !onDock(px, py)) {
            return false;
        }
    }

    // Kiem tra va cham voi cay
    for (const tree of trees) {
        const dx = x - tree.x;
        const dy = y - tree.y;

        if (Math.sqrt(dx * dx + dy * dy) < 28) {
            return false;
        }
    }

    return true;
}

// ==============================
// 7. CAP NHAT NHAN VAT
// ==============================

function update(deltaTime) {
    player.move(keys, deltaTime, canMoveTo);
}
// ==============================
// 8. CAMERA THEO NHAN VAT
// ==============================

function updateCamera() {camera.follow(player);}
// ==============================
// 10. VE HO NUOC
// ==============================

function drawLake() {

    // Bo ho
    ctx.fillStyle = "#b3a06b";

    ctx.beginPath();
    ctx.ellipse(
        lake.x, lake.y,
        lake.rx + 10,
        lake.ry + 10,
        0, 0, Math.PI * 2
    );
    ctx.fill();

    // Mat nuoc
    ctx.fillStyle = "#399bb5";

    ctx.beginPath();
    ctx.ellipse(
        lake.x, lake.y,
        lake.rx,
        lake.ry,
        0, 0, Math.PI * 2
    );
    ctx.fill();

    // Song nuoc
    for (let i = 0; i < 40; i++) {

        const x = lake.x - 350 + (i * 73) % 700;
        const y = lake.y - 170 + (i * 47) % 340;

        if (isWater(x, y)) {
            ctx.fillStyle = "#70c7d4";
            ctx.fillRect(x, y, 18, 3);
        }
    }
}

// ==============================
// 11. VE BEN GO
// ==============================

function drawDock() {

    ctx.fillStyle = "#79502e";

    ctx.fillRect(
        dock.x,
        dock.y,
        dock.width,
        dock.height
    );

    for (
        let y = dock.y;
        y < dock.y + dock.height;
        y += 18
    ) {

        ctx.fillStyle = "#b47b48";

        ctx.fillRect(
            dock.x,
            y,
            dock.width - 2,
            15
        );

        ctx.fillStyle = "#634026";

        ctx.fillRect(
            dock.x,
            y + 15,
            dock.width - 2,
            3
        );
    }
}

// ==============================
// 12. VE CAY
// ==============================

function drawTrees() {

    trees.forEach(tree => {

        // Bong cay
        ctx.fillStyle = "#315c38";
        ctx.fillRect(
            tree.x - 16,
            tree.y - 4,
            32, 25
        );

        // Than cay
        ctx.fillStyle = "#80502e";
        ctx.fillRect(
            tree.x - 5,
            tree.y + 5,
            10, 23
        );

        // Tan cay
        ctx.fillStyle = "#347b43";
        ctx.fillRect(
            tree.x - 20,
            tree.y - 20,
            40, 25
        );

        ctx.fillStyle = "#55a64f";
        ctx.fillRect(
            tree.x - 14,
            tree.y - 25,
            28, 20
        );

        ctx.fillStyle = "#80c95e";
        ctx.fillRect(
            tree.x - 5,
            tree.y - 20,
            8, 6
        );
    });
}

// Ve phao cau ca
function drawFishing() {

    if (!fishing.active) {
        return;
    }

    const x = fishing.bobberX;
    const y = fishing.bobberY;

    // Day cau
    ctx.strokeStyle = "#f5e8bd";
    ctx.lineWidth = 1;

        // Xac dinh dau can cau
    let rodTipX = player.x + 25;
    let rodTipY = player.y - 35;

    if (player.direction === "up") {
        rodTipY = player.y - 40;
    }
    else if (player.direction === "left") {
        rodTipX = player.x - 40;
        rodTipY = player.y - 25;
    }
    else if (player.direction === "right") {
        rodTipX = player.x + 40;
        rodTipY = player.y - 25;
    }

    // Ve day cau
    ctx.beginPath();
    ctx.moveTo(rodTipX, rodTipY);
    ctx.lineTo(x, y);
    ctx.stroke();

    // Bong phao
    ctx.fillStyle = "#24566a";
    ctx.fillRect(x - 6, y - 2, 14, 8);

    // Phao
    ctx.fillStyle =
        fishing.state === "bite" && fishing.blink
            ? "#ffeb59"
            : "#ffffff";

    ctx.fillRect(x - 4, y - 9, 8, 15);

    // Dau phao
    ctx.fillStyle = "#ed5148";
    ctx.fillRect(x - 4, y - 9, 8, 5);

    // Hieu ung khi ca can
    if (fishing.state === "bite") {

        ctx.strokeStyle = "#fff18b";
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.stroke();
    }
}

// ==============================
// 14. VE THE GIOI
// ==============================

function render() {

    // Xoa man hinh
    ctx.clearRect(
        0, 0,
        canvas.width,
        canvas.height
    );

    // Camera dich chuyen theo nhan vat
    ctx.save();

    ctx.translate(-camera.x, -camera.y);

    world.drawGrass(ctx);
    drawLake();
    drawDock();
    drawTrees();
    player.draw(ctx);
    fishingRod.draw(ctx, player);
    drawFishing();

    ctx.restore();
}

// ==============================
// 15. VONG LAP GAME
// ==============================

let lastTime = 0;

function gameLoop(timestamp) {

    const deltaTime = Math.min(
        (timestamp - lastTime) / 1000,
        0.05
    );

    lastTime = timestamp;

    update(deltaTime);

    // Cap nhat cau ca
    updateFishing(deltaTime);
    updateTimingGame(deltaTime);

    camera.follow(player);
    render();

    requestAnimationFrame(gameLoop);
}

// Bat dau game
requestAnimationFrame(gameLoop);
// Du lieu nguoi choi
const inventory = new Inventory();
const audioManager = new AudioManager();

// Du lieu mini game keo ca
const fishingMiniGame = new FishingMiniGame();
const timingGame = fishingMiniGame;


// Lay cac phan tu giao dien
const fishingUI = document.getElementById("fishingUI");
const fishingStatus = document.getElementById("fishingStatus");
const fishingTimer = document.getElementById("fishingTimer");
const fishCountText = document.getElementById("fishCount");
const goldText = document.getElementById("gold");
const message = document.getElementById("message");

const timingUI = document.getElementById("timingGame");
const timingMarker = document.getElementById("timingMarker");
const timingScoreText = document.getElementById("timingScore");

// Lấy các thành phần túi cá
const inventoryUI = document.getElementById("inventoryUI");
const inventoryBtn = document.getElementById("inventoryBtn");
const closeInventory = document.getElementById("closeInventory");

const inventoryCount = document.getElementById("inventoryCount");
const inventoryTotal = document.getElementById("inventoryTotal");
const inventoryGold = document.getElementById("inventoryGold");

const fishListUI = document.getElementById("fishListUI");
const sellAllBtn = document.getElementById("sellAllBtn");

const comboText = document.getElementById("comboText");

const inventoryUIManager = new InventoryUI({
    inventoryUI,
    inventoryCount,
    inventoryTotal,
    goldText,
    inventoryGold,
    fishListUI,
    fishCountText
});

// Mở túi cá
function openInventory() {
    inventoryUIManager.render(inventory);
    inventoryUIManager.open();
}


// Đóng túi cá
function closeInventoryUI() {
    inventoryUIManager.close();
}


// Bán một con cá
function sellFish(index) {
    const fish = inventory.sellFish(index);
    if (!fish) return;
    inventoryUIManager.updateHud(inventory);
    inventoryUIManager.render(inventory);
    showMessage("Đã bán " + fish.name + "!");
}


// Bán toàn bộ cá
function sellAllFish() {
    const totalMoney = inventory.sellAllFish();

    if (totalMoney === 0) {
        showMessage("Bạn chưa có cá để bán!");
        return;
    }

    inventoryUIManager.updateHud(inventory);
    inventoryUIManager.render(inventory);

    showMessage("Đã bán tất cả cá! +" + totalMoney + " vàng");
}


// Sự kiện mở và đóng túi
inventoryBtn.addEventListener("click", openInventory);

closeInventory.addEventListener("click", closeInventoryUI);


// Sự kiện bán từng con cá
fishListUI.addEventListener("click", (e) => {
    const button = e.target.closest("button[data-index]");

    if (!button) return;

    const index = Number(button.dataset.index);

    sellFish(index);
});


// Sự kiện bán tất cả
sellAllBtn.addEventListener("click", sellAllFish);

const targetElements = [
    document.getElementById("target0"),
    document.getElementById("target1"),
    document.getElementById("target2"),
    document.getElementById("target3")
];
const fishingUIManager = new FishingUI({
    fishingPanel: fishingUI,
    timingUI,
    timingMarker,
    timingScoreText,
    comboText,
    fishingTimer,
    targetElements,
    fishingStatus,
});

// Hien thi thong bao
function showMessage(text) {
    message.textContent = text;

    message.style.display = "block";

    clearTimeout(showMessage.timeout);

    showMessage.timeout = setTimeout(() => {
        message.style.display = "none";
    }, 2500);
}

// Kiem tra nguoi choi co gan ben cau ca
function nearFishingSpot() {
    const centerX = dock.x + dock.width / 2;
    const centerY = dock.y + dock.height / 2;

    return (
        Math.abs(player.x - centerX) < dock.width / 2 + 15 &&
        Math.abs(player.y - centerY) < dock.height / 2 + 15
    );
}

function isNearFishingSpot() {
    const dx = player.x - lake.x;
    const dy = player.y - lake.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance < 120;
}

// Bat dau cau ca
function startFishing() {

    if (fishingSystem.state !== "idle") {
        return;
    }

    if (!nearFishingSpot()) {
        showMessage("Hãy đến gần hồ để câu cá!");
        return;
    }

    const started = fishingSystem.startFishing(lake);

    if (!started) return;

    fishingUIManager.showFishingPanel();
    fishingUIManager.showFishingTimerElement();
    fishingUIManager.showFishingStatus("🎣 Đang chờ cá cắn câu...");
    fishingUIManager.showFishingTimer("Hãy kiên nhẫn chờ nhé!");

    showMessage("Bạn đã ném cần câu!");
}

// Cau thanh cong
function catchFish() {
    const fish = fishingSystem.currentFish;
    if (!fish) return;


    audioManager.playCatchSound();
    effectManager.triggerFishJump();

    //them ca vao tui
    inventory.addFish(fish);
    inventoryUIManager.updateHud(inventory);

    // Thông báo kết quả
    fishingUIManager.showFishingStatus("🎉 CÂU ĐƯỢC " + fish.name + "!");
    fishingUIManager.showFishingTimer("");
    fishingUIManager.hideFishingTimer();
    fishingUIManager.hideTiming();

    showMessage("🎣 Câu được " + fish.name + "!");

    setTimeout(resetFishing, 2500);
}

// Cau that bai
function failFishing() {

    fishingUIManager.hideTiming();
    fishingUIManager.showFishingStatus("😢 Cá đã chạy mất!");
    fishingUIManager.showFishingTimer("Hãy thử lại nhé!");

    showMessage("Rất tiếc bạn đã để cá thoát.");

    setTimeout(resetFishing, 2000);
}

// Reset trang thai cau
function resetFishing() {

    // Đặt lại trạng thái câu cá
    fishingSystem.stopFishing();

    // Cập nhật giao diện
    fishingUIManager.hideFishingPanel();

    // Đặt lại mini-game
    timingGame.combo = 0;
}

// Nhan phim E va SPACE

window.addEventListener("keydown", (e) => {

    if (e.repeat) return;

    if (e.code === "KeyE") {

        e.preventDefault();

        if (fishing.state === "idle") {
            startFishing();
        }
    }

    if (e.code === "Space") {

        if (fishing.state === "timing") {

            e.preventDefault();

            pressTimingButton();
        }
    }
});

// Ket thuc he thong cau ca
// Khởi tạo mini-game
function startTimingGame() {

    // Chọn cá ngay khi cá cắn câu
    const currentFish = fishingSystem.selectFish();

    fishing.state = "timing";

    fishingMiniGame.start(currentFish);

    // Điều chỉnh kích thước vùng mục tiêu
    const scale = fishingMiniGame.getTargetScale(currentFish);

    fishingUIManager.configureTargets(timingGame, scale);
    fishingUIManager.showTiming();
    fishingUIManager.showFishingStatus("🐟 " + currentFish.name + " đang cắn câu!");
    fishingUIManager.showFishingTimer("Canh trục chạy và nhấn SPACE!");

    updateTimingUI();
}

function updateTimingGame(deltaTime) {

    if (fishing.state !== "timing") {
        return;
    }

    // Cập nhật logic mini-game
    const timeOut = fishingMiniGame.update(deltaTime);

    // Cập nhật giao diện
    updateTimingUI();

    fishingUIManager.showFishingTimer(
        "Thời gian: " + Math.max(0, timingGame.timeLeft).toFixed(1) + "s");
    // Kiểm tra hết giờ
    if (timeOut) {
        failFishing();
    }
}

function updateTimingUI() {
    fishingUIManager.updateTiming(timingGame);
}

function pressTimingButton() {
    if (fishing.state !== "timing") return;

    const result = fishingMiniGame.press(
        fishingSystem.currentFish
    );
    console.log("KẾT QUẢ CÂU CÁ:", result);

    if (result.hit) {
        fishingUIManager.markTargetHit(result.index);

        audioManager.playHitSound();
        effectManager.triggerRodJerk();

        showMessage("🎯 Chính xác! Combo x" + result.combo);
    } else {
        audioManager.playMissSound();

        showMessage("❌ Trượt rồi! Combo đã bị mất!");
    }

    updateTimingUI();

    if (result.completed) {
        fishingUIManager.hideTiming();
        catchFish();
    }
}

function updateFishing(deltaTime) {

    if (!fishingSystem.isActive()) return;

    // Kiểm tra người chơi có rời khỏi hồ không
    if (!isNearFishingSpot()) {
        resetFishing();
        showMessage("Bạn đã rời khỏi khu vực câu cá!");
        return;
    }

    const fishBiting = fishingSystem.update(deltaTime);

    if (fishBiting) {
        startTimingGame();
    }
}

const fishJumpEffect =
    document.getElementById("fishJumpEffect");

const fishJumpCanvas =
    document.getElementById("fishJumpCanvas");

const effectManager = new EffectManager(
    canvas,
    fishJumpEffect,
    fishJumpCanvas
);