import { EventBus } from "./EventBus.js";
import { GameState } from "./GameState.js";
import { Camera } from "./Camera.js";
import { Input } from "./Input.js";
import { World } from "../world/World.js";
import { Player } from "../entities/Player.js";
import { FishingRod } from "../fishing/FishingRod.js";
import { FishingSystem } from "../fishing/FishingSystem.js";
import { FishingMiniGame } from "../fishing/FishingMiniGame.js";
import { Inventory } from "../systems/Inventory.js";
import { AudioManager } from "../systems/AudioManager.js";
import { EffectManager } from "../systems/EffectManager.js";
import { TimeManager } from "../systems/TimeManager.js";
import { WeatherSystem } from "../systems/WeatherSystem.js";
import { LightingSystem } from "../systems/LightingSystem.js";
import { FishingUI } from "../ui/FishingUI.js";
import { InventoryUI } from "../ui/InventoryUI.js";
import { HUD } from "../ui/HUD.js";
import { Phase3ModalsUI } from "../ui/Phase3ModalsUI.js";
import { TouchControls } from "../ui/TouchControls.js";
import { EquipmentSystem } from "../systems/EquipmentSystem.js";
import { ProgressionSystem } from "../systems/ProgressionSystem.js";
import { FishpediaSystem } from "../systems/FishpediaSystem.js";
import { QuestSystem } from "../systems/QuestSystem.js";
import { ShopSystem } from "../systems/ShopSystem.js";
import { ZONE_LABELS } from "../fishing/FishDatabase.js";

export class Game {
    constructor({ canvas, ui, eventBus, authService, saveManager }) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.ctx.imageSmoothingEnabled = false;

        this.ui = ui;
        this.eventBus = eventBus || new EventBus();
        this.authService = authService;
        this.saveManager = saveManager;

        this.state = GameState.EXPLORING;
        this.previousStateBeforeModal = GameState.EXPLORING;

        this.input = new Input();
        this.touchControls = new TouchControls(this.input);
        this.world = new World();
        this.player = new Player(900, 720);
        this.camera = new Camera(this.canvas, this.world.width, this.world.height);

        this.fishingRod = new FishingRod();
        this.fishingSystem = new FishingSystem(this.eventBus);
        this.fishingMiniGame = new FishingMiniGame();
        this.inventory = new Inventory(this.eventBus);
        this.equipment = new EquipmentSystem(this.eventBus);
        this.progression = new ProgressionSystem(this.eventBus);
        this.fishpedia = new FishpediaSystem(this.eventBus);
        this.questSystem = new QuestSystem(this.eventBus);
        this.shopSystem = new ShopSystem({
            inventory: this.inventory,
            equipment: this.equipment,
            progression: this.progression,
            eventBus: this.eventBus
        });
        this.audioManager = new AudioManager();
        this.timeManager = new TimeManager();
        this.weatherSystem = new WeatherSystem();
        this.lightingSystem = new LightingSystem();
        this.effectManager = new EffectManager(
            this.canvas,
            this.ui.fishJumpEffect,
            this.ui.fishJumpCanvas
        );

        this.fishingUI = new FishingUI({
            fishingPanel: this.ui.fishingPanel,
            timingUI: this.ui.timingUI,
            timingTrack: this.ui.timingTrack,
            timingMarker: this.ui.timingMarker,
            timingScoreText: this.ui.timingScoreText,
            comboText: this.ui.comboText,
            fishingTimer: this.ui.fishingTimer,
            targetElements: this.ui.targetElements,
            fishingStatus: this.ui.fishingStatus,
            tensionBox: this.ui.tensionBox,
            tensionFill: this.ui.tensionFill,
            tensionText: this.ui.tensionText,
            reelBtn: this.ui.reelBtn
        });

        this.modalsUI = new Phase3ModalsUI({
            shopModal: this.ui.shopModal,
            shopGold: this.ui.shopGold,
            shopBody: this.ui.shopBody,
            closeShopBtn: this.ui.closeShop,
            openShopBtn: this.ui.shopBtn,
            fishpediaModal: this.ui.fishpediaModal,
            fishpediaProgress: this.ui.fishpediaProgress,
            fishpediaBody: this.ui.fishpediaBody,
            closeFishpediaBtn: this.ui.closeFishpedia,
            openFishpediaBtn: this.ui.fishpediaBtn,
            questsModal: this.ui.questsModal,
            questsBody: this.ui.questsBody,
            closeQuestsBtn: this.ui.closeQuests,
            openQuestsBtn: this.ui.questsBtn,
            resetQuestsBtn: this.ui.resetQuestsBtn
        });

        this.inventoryUI = new InventoryUI({
            inventoryUI: this.ui.inventoryUI,
            inventoryCount: this.ui.inventoryCount,
            inventoryTotal: this.ui.inventoryTotal,
            goldText: this.ui.goldEl,
            inventoryGold: this.ui.inventoryGold,
            fishListUI: this.ui.fishListUI,
            fishCountText: this.ui.fishCountEl,
            openBtn: this.ui.inventoryBtn,
            closeBtn: this.ui.closeInventory,
            sellAllBtn: this.ui.sellAllBtn
        });

        this.hud = new HUD({
            playerNameEl: this.ui.playerNameEl,
            timeDisplayEl: this.ui.timeDisplayEl,
            weatherDisplayEl: this.ui.weatherDisplayEl,
            levelDisplayEl: this.ui.levelDisplayEl,
            topXpBar: this.ui.topXpBar,
            topGoldEl: this.ui.topGoldEl,
            saveStatusEl: this.ui.saveStatusEl,
            fishCountEl: this.ui.fishCountEl,
            goldEl: this.ui.goldEl,
            inventoryCountEl: this.ui.inventoryCount,
            equipDisplayEl: this.ui.equipDisplayEl,
            questBadgeEl: this.ui.questBadgeEl,
            messageEl: this.ui.messageEl
        });

        this.stats = {
            totalCaught: 0,
            totalSoldGold: 0
        };

        this.rafId = null;
        this.lastTime = 0;
        this.elapsedSec = 0;
        this.resultTimeout = null;
        this.unsubscribers = [];
        this._onBeforeUnload = () => {
            this.saveManager?.save(true);
        };
    }

    async init() {
        this.bindEvents();

        if (this.saveManager) {
            this.saveManager.setStateProvider(() => this.serializeState());
            const profile = await this.saveManager.load();
            this.applyProfile(profile);
        }

        this.camera.follow(this.player, null, true);
        this.syncHud();
        if (this.touchControls.isTouchDevice()) {
            this.touchControls.show();
        }
        this.hud.showMessage("Chào mừng đến Fishing World! Nhấn E gần hồ để câu cá.");
    }

    bindEvents() {
        this.inventoryUI.bindEvents({
            onOpen: () => this.openInventory(),
            onClose: () => this.closeInventory(),
            onSellFish: (index) => this.sellFish(index),
            onSellAll: () => this.sellAllFish()
        });

        this.fishingUI.bindPressHandler(() => this.pressTimingButton());

        this.modalsUI.bindEvents({
            onOpenShop: () => this.openShop(),
            onOpenFishpedia: () => this.openFishpedia(),
            onOpenQuests: () => this.openQuests(),
            onCloseModal: () => this.closeAllModals(),
            onShopAction: (action, id) => this.handleShopAction(action, id),
            onClaimQuest: (questId) => this.handleClaimQuest(questId),
            onResetQuests: () => {
                if (this.questSystem.resetCompletedQuests()) {
                    this.modalsUI.renderQuests(this.questSystem);
                    this.saveManager?.save(false);
                }
            }
        });

        this.unsubscribers.push(
            this.eventBus.on("inventory:updated", (summary) => {
                this.hud.updateInventorySummary(summary);
                if (this.inventoryUI.isOpen()) {
                    this.inventoryUI.render(this.inventory);
                }
                if (this.modalsUI.shopModal?.style.display === "block") {
                    this.modalsUI.renderShop(this.shopSystem, this.equipment, this.inventory, this.progression);
                }
            }),
            this.eventBus.on("equipment:changed", (info) => {
                this.hud.updateEquipment(info);
            }),
            this.eventBus.on("progression:updated", (summary) => {
                this.hud.updateProgression(summary);
            }),
            this.eventBus.on("player:level_up", ({ newLevel }) => {
                this.hud.showMessage(`🎉 Lên cấp! Bạn đã đạt Level ${newLevel}!`);
                this.effectManager.addFloatingText(this.player.x, this.player.y - 50, `LEVEL UP! Lv.${newLevel}`, "#ffd54f");
            }),
            this.eventBus.on("fishpedia:new_discovery", ({ fish }) => {
                this.hud.showMessage(`📖 Loài mới trong Sổ tay: ${fish.name}!`);
            }),
            this.eventBus.on("quests:updated", () => {
                this.hud.updateQuestBadge(this.questSystem.getClaimableCount());
            }),
            this.eventBus.on("save:completed", () => {
                this.hud.showSaveIndicator("💾 Đã lưu");
            }),
            this.eventBus.on("auth:changed", (user) => {
                this.hud.updatePlayerName(user.displayName);
            })
        );

        window.addEventListener("beforeunload", this._onBeforeUnload);
        window.addEventListener("pagehide", this._onBeforeUnload);
    }

    serializeState() {
        return {
            player: {
                ...this.player.toJSON(),
                level: this.progression.level,
                xp: this.progression.xp
            },
            inventory: this.inventory.toJSON(),
            equipment: this.equipment.toJSON(),
            fishpedia: this.fishpedia.toJSON(),
            quests: this.questSystem.toJSON(),
            time: this.timeManager.toJSON(),
            stats: { ...this.stats }
        };
    }

    applyProfile(profile) {
        if (!profile) return;

        this.hud.updatePlayerName(profile.displayName || "Guest");

        if (profile.player) {
            const px = Number(profile.player.x);
            const py = Number(profile.player.y);
            const dir = profile.player.direction || "down";
            if (Number.isFinite(px) && Number.isFinite(py) && this.world.canMoveTo(px, py)) {
                this.player.setPosition(px, py, dir);
            }
            this.progression.fromJSON(profile.player);
        }

        if (profile.inventory) {
            this.inventory.loadFromData(profile.inventory);
        }

        if (profile.equipment) {
            this.equipment.fromJSON(profile.equipment);
        }

        if (profile.fishpedia) {
            this.fishpedia.fromJSON(profile.fishpedia);
        }

        if (profile.quests) {
            this.questSystem.fromJSON(profile.quests);
        }

        if (profile.time) {
            this.timeManager.fromJSON(profile.time);
        }

        if (profile.stats) {
            this.stats = {
                totalCaught: Number(profile.stats.totalCaught) || 0,
                totalSoldGold: Number(profile.stats.totalSoldGold) || 0
            };
        }
    }

    syncHud() {
        this.hud.updatePlayerName(this.authService?.getDisplayName() || "Guest");
        this.hud.updateTimeAndWeather(
            this.timeManager.getFormattedTime(),
            this.weatherSystem.getWeatherText()
        );
        this.hud.updateInventorySummary({
            fishCount: this.inventory.getFishCount(),
            capacity: this.inventory.capacity,
            gold: this.inventory.gold
        });
        this.hud.updateProgression(this.progression.getSummary());
        this.hud.updateEquipment({
            rod: this.equipment.getEquippedRod(),
            bait: this.equipment.getEquippedBait(),
            baitCount: this.equipment.equippedBaitId
                ? this.equipment.getBaitCount(this.equipment.equippedBaitId)
                : 0
        });
        this.hud.updateQuestBadge(this.questSystem.getClaimableCount());
    }

    setState(newState) {
        this.state = newState;
        this.touchControls?.updateForState(newState);
        if (newState === GameState.UI_MODAL) {
            this.touchControls?.releaseAll();
        }
    }

    start() {
        if (this.rafId !== null) return;
        this.lastTime = performance.now();

        const loop = (timestamp) => {
            const deltaTime = Math.min((timestamp - this.lastTime) / 1000, 0.05);
            this.lastTime = timestamp;

            this.update(deltaTime);
            this.render();
            this.input.update();

            this.rafId = requestAnimationFrame(loop);
        };

        this.rafId = requestAnimationFrame(loop);
    }

    stop() {
        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }

    update(deltaTime) {
        this.elapsedSec += deltaTime;
        this.handleHotkeys();

        this.timeManager.update(deltaTime);
        this.weatherSystem.update(
            deltaTime,
            this.world.width,
            this.world.height,
            this.timeManager.getPhase()
        );
        this.hud.updateTimeAndWeather(
            this.timeManager.getFormattedTime(),
            this.weatherSystem.getWeatherText()
        );

        if (this.state === GameState.EXPLORING) {
            this.player.update(this.input, deltaTime, (x, y) => this.world.canMoveTo(x, y));
        } else if (this.state === GameState.FISHING_WAITING) {
            this.player.update(this.input, deltaTime, (x, y) => this.world.canMoveTo(x, y));
            this.updateFishing(deltaTime);
        } else if (this.state === GameState.FISHING_BITING) {
            this.updateFishing(deltaTime);
        } else if (this.state === GameState.FISHING_MINIGAME) {
            this.updateFishing(deltaTime);
            this.updateTimingGame(deltaTime);
        }

        this.effectManager.update(deltaTime);
        this.camera.follow(this.player, deltaTime);
    }

    handleHotkeys() {
        if (this.input.isJustPressed("i")) {
            if (this.inventoryUI.isOpen()) {
                this.closeInventory();
            } else if (
                this.state === GameState.EXPLORING ||
                this.state === GameState.FISHING_WAITING
            ) {
                this.openInventory();
            }
            return;
        }

        if (this.input.isJustPressed("f")) {
            if (this.modalsUI.shopModal?.style.display === "block") {
                this.closeAllModals();
            } else if (this.state === GameState.EXPLORING) {
                if (this.world.isNearMerchant(this.player.x, this.player.y)) {
                    this.openShop();
                } else {
                    this.hud.showMessage("Hãy đến gần sạp Thương nhân cạnh bến gỗ để mua bán!");
                }
            }
            return;
        }

        if (this.input.isJustPressed("p")) {
            if (this.modalsUI.fishpediaModal?.style.display === "block") {
                this.closeAllModals();
            } else if (this.state === GameState.EXPLORING) {
                this.openFishpedia();
            }
            return;
        }

        if (this.input.isJustPressed("q")) {
            if (this.modalsUI.questsModal?.style.display === "block") {
                this.closeAllModals();
            } else if (this.state === GameState.EXPLORING) {
                this.openQuests();
            }
            return;
        }

        if (this.input.isJustPressed("escape")) {
            if (this.inventoryUI.isOpen()) {
                this.closeInventory();
            } else if (this.modalsUI.isAnyOpen()) {
                this.closeAllModals();
            } else if (this.state === GameState.FISHING_WAITING) {
                this.resetFishing();
                this.hud.showMessage("Đã thu cần câu.");
            }
            return;
        }

        if (this.input.isJustPressed("e")) {
            if (this.state === GameState.EXPLORING) {
                this.startFishing();
            } else if (this.state === GameState.FISHING_WAITING) {
                this.resetFishing();
                this.hud.showMessage("Đã thu cần câu.");
            }
            return;
        }

        if (this.input.isJustPressed("space")) {
            if (this.state === GameState.FISHING_BITING) {
                this.startTimingGame();
            } else if (this.state === GameState.FISHING_MINIGAME) {
                this.pressTimingButton();
            }
        }
    }

    openInventory() {
        if (this.inventoryUI.isOpen()) return;
        this.modalsUI.closeAll();
        if (this.state !== GameState.UI_MODAL) {
            this.previousStateBeforeModal = this.state;
        }
        this.setState(GameState.UI_MODAL);
        this.inventoryUI.render(this.inventory);
        this.inventoryUI.open();
    }

    closeInventory() {
        if (!this.inventoryUI.isOpen()) return;
        this.inventoryUI.close();
        this.setState(
            this.previousStateBeforeModal === GameState.UI_MODAL
                ? GameState.EXPLORING
                : this.previousStateBeforeModal
        );
    }

    openShop() {
        this.inventoryUI.close();
        if (this.state !== GameState.UI_MODAL) {
            this.previousStateBeforeModal = this.state;
        }
        this.setState(GameState.UI_MODAL);
        this.modalsUI.openShop(this.shopSystem, this.equipment, this.inventory, this.progression);
    }

    openFishpedia() {
        this.inventoryUI.close();
        if (this.state !== GameState.UI_MODAL) {
            this.previousStateBeforeModal = this.state;
        }
        this.setState(GameState.UI_MODAL);
        this.modalsUI.openFishpedia(this.fishpedia);
    }

    openQuests() {
        this.inventoryUI.close();
        if (this.state !== GameState.UI_MODAL) {
            this.previousStateBeforeModal = this.state;
        }
        this.setState(GameState.UI_MODAL);
        this.modalsUI.openQuests(this.questSystem);
    }

    closeAllModals() {
        this.modalsUI.closeAll();
        if (this.state === GameState.UI_MODAL && !this.inventoryUI.isOpen()) {
            this.setState(
                this.previousStateBeforeModal === GameState.UI_MODAL
                    ? GameState.EXPLORING
                    : this.previousStateBeforeModal
            );
        }
    }

    handleShopAction(action, id) {
        let res = { success: false, message: "" };
        if (action === "rod") {
            res = this.shopSystem.buyOrEquipRod(id);
        } else if (action === "bait") {
            res = this.shopSystem.buyBait(id);
        } else if (action === "equip_bait") {
            res = this.shopSystem.equipBait(id || null);
        } else if (action === "bag") {
            res = this.shopSystem.buyBagUpgrade();
        }

        if (res.message) this.hud.showMessage(res.message);
        if (res.success) {
            this.modalsUI.renderShop(this.shopSystem, this.equipment, this.inventory, this.progression);
            this.saveManager?.save(false);
        }
    }

    handleClaimQuest(questId) {
        const res = this.questSystem.claimQuest(questId, {
            inventory: this.inventory,
            progression: this.progression
        });
        if (res.success) {
            this.hud.showMessage(`🎁 Nhận thưởng: +${res.rewardGold}G, +${res.rewardXp} XP!`);
            this.modalsUI.renderQuests(this.questSystem);
            this.saveManager?.save(false);
        }
    }

    sellFish(index) {
        const fish = this.inventory.sellFish(index);
        if (!fish) return;

        this.stats.totalSoldGold += fish.price;
        this.questSystem.onFishSold(fish.price);
        this.saveManager?.save(false);
        this.hud.showMessage(`Đã bán ${fish.name}! +${fish.price} vàng`);
    }

    sellAllFish() {
        const totalMoney = this.inventory.sellAllFish();
        if (totalMoney === 0) {
            this.hud.showMessage("Bạn chưa có cá để bán!");
            return;
        }

        this.stats.totalSoldGold += totalMoney;
        this.questSystem.onFishSold(totalMoney);
        this.saveManager?.save(false);
        this.hud.showMessage(`Đã bán tất cả cá! +${totalMoney} vàng`);
    }

    startFishing() {
        if (this.fishingSystem.state !== "idle") {
            return;
        }

        if (!this.world.canStartFishing(this.player.x, this.player.y)) {
            this.hud.showMessage("Hãy đến gần hồ hoặc bến gỗ để câu cá!");
            return;
        }

        if (this.inventory.isFull()) {
            this.hud.showMessage("Túi cá đã đầy! Hãy bán bớt cá trước khi câu.");
            return;
        }

        const bobberPos = this.world.getBobberPosition(
            this.player.x,
            this.player.y,
            this.player.direction
        );

        const bonuses = this.equipment.getCombinedBonuses();
        const started = this.fishingSystem.startFishing(bobberPos, bonuses);
        if (!started) return;

        const zone = this.world.getFishingZone(bobberPos.x, bobberPos.y);
        const zoneName = ZONE_LABELS[zone] || zone;

        this.effectManager.addWaterSplash(bobberPos.x, bobberPos.y, 6);
        this.effectManager.addWaterRipple(bobberPos.x, bobberPos.y, 25);

        clearTimeout(this.resultTimeout);
        this.setState(GameState.FISHING_WAITING);

        this.fishingUI.showFishingPanel();
        this.fishingUI.showFishingTimerElement();
        this.fishingUI.hideTiming();
        this.fishingUI.showFishingStatus(`🎣 Đang chờ cá tại ${zoneName}...`);
        this.fishingUI.showFishingTimer("Hãy kiên nhẫn chờ nhé! (Nhấn E để thu cần)");

        this.hud.showMessage(`Bạn đã ném cần câu tại ${zoneName}!`);
    }

    updateFishing(deltaTime) {
        if (!this.fishingSystem.isActive()) return;

        if (!this.world.isNearLake(this.player.x, this.player.y)) {
            this.resetFishing();
            this.hud.showMessage("Bạn đã rời khỏi khu vực câu cá!");
            return;
        }

        const fishingEvent = this.fishingSystem.update(deltaTime);

        if (fishingEvent === "biting") {
            this.setState(GameState.FISHING_BITING);
            this.audioManager.playHitSound();
            this.camera.shake(3, 0.2);
            this.effectManager.addWaterRipple(this.fishingSystem.bobberX, this.fishingSystem.bobberY, 35, "#fff18b");
            this.effectManager.addWaterSplash(this.fishingSystem.bobberX, this.fishingSystem.bobberY, 10);
            this.fishingUI.showFishingStatus("⚡ Cá đang cắn câu!");
            this.fishingUI.showFishingTimer("Chuẩn bị kéo cần!");
        } else if (fishingEvent === "start_timing") {
            this.startTimingGame();
        }
    }

    startTimingGame() {
        if (this.state === GameState.FISHING_MINIGAME) return;

        const bonuses = this.equipment.getCombinedBonuses();
        const zone = this.world.getFishingZone(this.fishingSystem.bobberX, this.fishingSystem.bobberY);
        const timePhase = this.timeManager.getPhase();
        const weather = this.weatherSystem.type;

        const currentFish = this.fishingSystem.selectFish({
            zone,
            timePhase,
            weather,
            luckBonus: bonuses.luckBonus
        });

        // Tiêu hao 1 mồi câu nếu đang gắn
        this.equipment.consumeBait();

        this.fishingSystem.enterTiming();
        this.setState(GameState.FISHING_MINIGAME);

        this.fishingMiniGame.start(currentFish, bonuses);
        this.fishingUI.configureTargets(this.fishingMiniGame);
        this.fishingUI.showTiming();
        this.fishingUI.showFishingStatus(`🐟 ${currentFish.name} [${currentFish.rarity}] đang cắn câu!`);
        this.fishingUI.showFishingTimer("Canh trục chạy và nhấn SPACE hoặc Click!");
        this.fishingUI.updateTiming(this.fishingMiniGame);
    }

    updateTimingGame(deltaTime) {
        if (this.state !== GameState.FISHING_MINIGAME) {
            return;
        }

        const { timedOut, snapped } = this.fishingMiniGame.update(deltaTime);
        this.fishingUI.updateTiming(this.fishingMiniGame);
        this.fishingUI.showFishingTimer(
            `Thời gian: ${Math.max(0, this.fishingMiniGame.timeLeft).toFixed(1)}s`
        );

        if (snapped) {
            this.failFishing("💥 Dây câu bị đứt vì quá căng!");
        } else if (timedOut) {
            this.failFishing();
        }
    }

    pressTimingButton() {
        if (this.state !== GameState.FISHING_MINIGAME) return;

        const result = this.fishingMiniGame.press();

        if (result.hit) {
            this.fishingUI.markTargetHit(result.index, result.perfect);
            this.audioManager.playHitSound();
            this.effectManager.triggerRodJerk();
            this.effectManager.addWaterRipple(this.fishingSystem.bobberX, this.fishingSystem.bobberY, 20);
            this.camera.shake(result.perfect ? 3.5 : 2.5, 0.14);

            if (result.perfect) {
                this.questSystem.onPerfectHit(1);
                this.hud.showMessage(`✨ PERFECT! Combo x${result.combo}`);
                this.effectManager.addFloatingText(this.player.x, this.player.y - 34, `PERFECT! +2`, "#ffd54f");
            } else {
                this.hud.showMessage(`🎯 Chính xác! Combo x${result.combo}`);
                this.effectManager.addFloatingText(this.player.x, this.player.y - 30, `Hit! x${result.combo}`, "#ffeb3b");
            }
        } else {
            this.audioManager.playMissSound();
            this.hud.showMessage("❌ Trượt rồi! Combo đã bị mất!");
            this.effectManager.addFloatingText(this.player.x, this.player.y - 30, "Miss!", "#ef5350");
        }

        this.fishingUI.updateTiming(this.fishingMiniGame);

        if (result.snapped) {
            this.failFishing("💥 Dây câu bị đứt vì quá căng!");
            return;
        }

        if (result.completed) {
            this.fishingUI.hideTiming();
            this.catchFish();
        }
    }

    catchFish() {
        const fish = this.fishingSystem.currentFish;
        if (!fish) return;

        this.fishingSystem.enterResult();
        this.setState(GameState.FISHING_RESULT);

        this.audioManager.playCatchSound();
        this.effectManager.triggerFishJump();
        this.effectManager.addWaterSplash(this.fishingSystem.bobberX, this.fishingSystem.bobberY, 15);
        this.effectManager.addFloatingText(this.player.x, this.player.y - 40, `+1 ${fish.name} (${fish.weight}kg)!`, "#4caf50");
        this.camera.shake(4.5, 0.22);

        const added = this.inventory.addFish(fish);
        if (added) {
            this.stats.totalCaught += 1;
            const xpGain = (fish.xp || 10) + this.fishingMiniGame.perfectHits * 5;
            this.progression.addXp(xpGain);
            this.fishpedia.recordCatch(fish);
            this.questSystem.onFishCaught(fish, {
                timePhase: this.timeManager.getPhase(),
                weather: this.weatherSystem.type
            });
            this.saveManager?.save(false);
            this.fishingUI.showFishingStatus(`🎉 CÂU ĐƯỢC ${fish.name} (${fish.weight}kg)!`);
            this.hud.showMessage(`🎣 Câu được ${fish.name} (${fish.weight} kg | +${xpGain} XP)!`);
        } else {
            this.fishingUI.showFishingStatus("🎒 Túi cá đã đầy!");
            this.hud.showMessage("Túi cá đã đầy, không thể giữ thêm!");
        }

        this.fishingUI.showFishingTimer("");
        this.fishingUI.hideFishingTimer();
        this.fishingUI.hideTiming();

        clearTimeout(this.resultTimeout);
        this.resultTimeout = setTimeout(() => this.resetFishing(), 2200);
    }

    failFishing(reason = "😢 Cá đã chạy mất!") {
        this.fishingSystem.enterResult();
        this.setState(GameState.FISHING_RESULT);

        this.fishingUI.hideTiming();
        this.fishingUI.showFishingStatus(reason);
        this.fishingUI.showFishingTimer("Hãy thử lại nhé!");
        this.hud.showMessage("Rất tiếc bạn đã để cá thoát.");

        clearTimeout(this.resultTimeout);
        this.resultTimeout = setTimeout(() => this.resetFishing(), 1800);
    }

    resetFishing() {
        clearTimeout(this.resultTimeout);
        this.resultTimeout = null;

        this.fishingSystem.stopFishing();
        this.fishingMiniGame.reset();
        this.fishingUI.hideTiming();
        this.fishingUI.hideFishingPanel();
        this.setState(GameState.EXPLORING);
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const timePhase = this.timeManager.getPhase();
        const isNight = timePhase === "NIGHT" || timePhase === "DUSK";

        this.ctx.save();
        this.ctx.translate(-this.camera.getRenderX(), -this.camera.getRenderY());

        this.world.drawBackground(this.ctx, this.elapsedSec);
        this.world.drawDock(this.ctx);

        // Vẽ phao câu
        this.drawFishing();

        // Y-Sorting: Player, Trees, Bushes, Rocks, Lanterns
        const renderables = this.world.getRenderables(
            this.player,
            this.fishingRod,
            this.fishingSystem,
            isNight
        );
        for (const obj of renderables) {
            obj.draw(this.ctx);
        }

        // Particles & Thời tiết
        this.effectManager.drawParticles(this.ctx);
        this.weatherSystem.drawWeather(
            this.ctx,
            this.world.width,
            this.world.height,
            timePhase
        );

        this.ctx.restore();

        // Chiếu sáng Ngày / Đêm phủ lên toàn bộ viewport
        const ambientLight = this.timeManager.getAmbientLight();
        const lights = this.world.getLightSources(this.player, this.fishingSystem);
        this.lightingSystem.renderLighting(
            this.ctx,
            this.canvas.width,
            this.canvas.height,
            this.camera,
            ambientLight,
            lights
        );
    }

    drawFishing() {
        if (!this.fishingSystem.active) {
            return;
        }

        const x = this.fishingSystem.bobberX;
        const y = this.fishingSystem.bobberY;

        // Bóng phao
        this.ctx.fillStyle = "#24566a";
        this.ctx.fillRect(x - 6, y - 2, 14, 8);

        // Phao
        const isBiting = this.fishingSystem.isBitingOrTiming();
        this.ctx.fillStyle = isBiting && this.fishingSystem.blink ? "#ffeb59" : "#ffffff";
        this.ctx.fillRect(x - 4, y - 9, 8, 15);

        // Đầu phao
        this.ctx.fillStyle = "#ed5148";
        this.ctx.fillRect(x - 4, y - 9, 8, 5);

        // Hiệu ứng vòng sáng khi cá cắn
        if (isBiting) {
            this.ctx.strokeStyle = "#fff18b";
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 15, 0, Math.PI * 2);
            this.ctx.stroke();
        }
    }

    destroy() {
        this.stop();
        clearTimeout(this.resultTimeout);
        this.input.destroy();
        this.touchControls?.destroy();
        this.hud.destroy();
        this.saveManager?.destroy();

        for (const unsubscribe of this.unsubscribers) {
            unsubscribe();
        }
        this.unsubscribers = [];

        window.removeEventListener("beforeunload", this._onBeforeUnload);
        window.removeEventListener("pagehide", this._onBeforeUnload);
    }
}