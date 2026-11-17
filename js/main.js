import { EventBus } from "./core/EventBus.js";
import { Game } from "./core/Game.js";
import { LocalStorageAdapter } from "./storage/LocalStorageAdapter.js";
import { CloudStorageAdapter } from "./storage/CloudStorageAdapter.js";
import { AuthService } from "./storage/AuthService.js";
import { SaveManager } from "./storage/SaveManager.js";

function collectUIElements() {
    return {
        canvas: document.getElementById("gameCanvas"),
        messageEl: document.getElementById("message"),
        timeDisplayEl: document.getElementById("timeDisplay"),
        weatherDisplayEl: document.getElementById("weatherDisplay"),
        levelDisplayEl: document.getElementById("levelDisplay"),
        topXpBar: document.getElementById("topXpBar"),
        playerNameEl: document.getElementById("playerName"),
        topGoldEl: document.getElementById("topGold"),
        saveStatusEl: document.getElementById("saveStatus"),
        fishCountEl: document.getElementById("fishCount"),
        goldEl: document.getElementById("gold"),
        equipDisplayEl: document.getElementById("equipDisplay"),
        questBadgeEl: document.getElementById("questBadge"),
        fishingPanel: document.getElementById("fishingUI"),
        fishingStatus: document.getElementById("fishingStatus"),
        fishingTimer: document.getElementById("fishingTimer"),
        timingUI: document.getElementById("timingGame"),
        timingTrack: document.getElementById("timingTrack"),
        timingMarker: document.getElementById("timingMarker"),
        timingScoreText: document.getElementById("timingScore"),
        comboText: document.getElementById("comboText"),
        tensionBox: document.getElementById("tensionBox"),
        tensionFill: document.getElementById("tensionFill"),
        tensionText: document.getElementById("tensionText"),
        reelBtn: document.getElementById("reelBtn"),
        targetElements: [
            document.getElementById("target0"),
            document.getElementById("target1"),
            document.getElementById("target2"),
            document.getElementById("target3")
        ],
        fishJumpEffect: document.getElementById("fishJumpEffect"),
        fishJumpCanvas: document.getElementById("fishJumpCanvas"),
        inventoryUI: document.getElementById("inventoryUI"),
        inventoryBtn: document.getElementById("inventoryBtn"),
        closeInventory: document.getElementById("closeInventory"),
        inventoryCount: document.getElementById("inventoryCount"),
        inventoryTotal: document.getElementById("inventoryTotal"),
        inventoryGold: document.getElementById("inventoryGold"),
        fishListUI: document.getElementById("fishListUI"),
        sellAllBtn: document.getElementById("sellAllBtn"),
        shopModal: document.getElementById("shopModal"),
        shopBtn: document.getElementById("shopBtn"),
        closeShop: document.getElementById("closeShop"),
        shopGold: document.getElementById("shopGold"),
        shopBody: document.getElementById("shopBody"),
        fishpediaModal: document.getElementById("fishpediaModal"),
        fishpediaBtn: document.getElementById("fishpediaBtn"),
        closeFishpedia: document.getElementById("closeFishpedia"),
        fishpediaProgress: document.getElementById("fishpediaProgress"),
        fishpediaBody: document.getElementById("fishpediaBody"),
        questsModal: document.getElementById("questsModal"),
        questsBtn: document.getElementById("questsBtn"),
        closeQuests: document.getElementById("closeQuests"),
        questsBody: document.getElementById("questsBody"),
        resetQuestsBtn: document.getElementById("resetQuestsBtn")
    };
}

async function bootstrap() {
    const eventBus = new EventBus();
    const authService = new AuthService(eventBus);
    const localAdapter = new LocalStorageAdapter();
    const cloudAdapter = new CloudStorageAdapter({
        getAuthToken: () => authService.getToken()
    });

    const saveManager = new SaveManager({
        storageAdapter: localAdapter,
        cloudAdapter,
        authService,
        eventBus
    });

    const ui = collectUIElements();
    const game = new Game({
        canvas: ui.canvas,
        ui,
        eventBus,
        authService,
        saveManager
    });

    await game.init();
    game.start();

    window.__fishingWorld = game;
}

if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", bootstrap, { once: true });
} else {
    bootstrap();
}
