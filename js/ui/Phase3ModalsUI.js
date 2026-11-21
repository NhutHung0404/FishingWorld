import { ShopUI } from "./ShopUI.js";
import { FishpediaUI } from "./FishpediaUI.js";
import { QuestUI } from "./QuestUI.js";
import { SettingsUI } from "./SettingsUI.js";

export class Phase3ModalsUI {
    constructor(elements = {}) {
        this.shopUI = new ShopUI(elements);
        this.fishpediaUI = new FishpediaUI(elements);
        this.questUI = new QuestUI(elements);
        this.settingsUI = new SettingsUI(elements);

        this.shopModal = this.shopUI.modal;
        this.shopGold = this.shopUI.goldEl;
        this.shopBody = this.shopUI.bodyEl;
        this.closeShopBtn = this.shopUI.closeBtn;
        this.openShopBtn = this.shopUI.openBtn;

        this.fishpediaModal = this.fishpediaUI.modal;
        this.fishpediaProgress = this.fishpediaUI.progressEl;
        this.fishpediaBody = this.fishpediaUI.bodyEl;
        this.closeFishpediaBtn = this.fishpediaUI.closeBtn;
        this.openFishpediaBtn = this.fishpediaUI.openBtn;

        this.questsModal = this.questUI.modal;
        this.questsBody = this.questUI.bodyEl;
        this.closeQuestsBtn = this.questUI.closeBtn;
        this.openQuestsBtn = this.questUI.openBtn;
        this.resetQuestsBtn = this.questUI.resetBtn;
    }

    bindEvents(handlers) {
        this.shopUI.bindEvents(handlers);
        this.fishpediaUI.bindEvents(handlers);
        this.questUI.bindEvents(handlers);
        this.settingsUI.bindEvents(handlers);
    }

    isAnyOpen() {
        return (
            this.shopUI.isOpen() ||
            this.fishpediaUI.isOpen() ||
            this.questUI.isOpen() ||
            this.settingsUI.isOpen()
        );
    }

    closeAll() {
        this.shopUI.close();
        this.fishpediaUI.close();
        this.questUI.close();
        this.settingsUI.close();
    }

    openShop(shopSystem, equipment, inventory, progression) {
        this.closeAll();
        this.shopUI.open(shopSystem, equipment, inventory, progression);
    }

    renderShop(shopSystem, equipment, inventory, progression) {
        this.shopUI.render(shopSystem, equipment, inventory, progression);
    }

    openFishpedia(fishpedia) {
        this.closeAll();
        this.fishpediaUI.open(fishpedia);
    }

    renderFishpedia(fishpedia) {
        this.fishpediaUI.render(fishpedia);
    }

    openQuests(questSystem) {
        this.closeAll();
        this.questUI.open(questSystem);
    }

    renderQuests(questSystem) {
        this.questUI.render(questSystem);
    }

    destroy() {
        this.shopUI.destroy();
        this.fishpediaUI.destroy();
        this.questUI.destroy();
        this.settingsUI.destroy();
    }
}
