import { GameState } from "../core/GameState.js";

export class TouchControls {
    constructor(input, container = null) {
        this.input = input;
        this.container = container || document.getElementById("touchControls");
        this.actionBtn = this.container?.querySelector("#touchActionBtn") || null;
        this.buttons = this.container
            ? Array.from(this.container.querySelectorAll("[data-key]"))
            : [];

        this.activePointers = new Map();

        this._onPointerDown = (e) => this.handlePointerDown(e);
        this._onPointerUp = (e) => this.handlePointerEnd(e);
        this._onPointerCancel = (e) => this.handlePointerEnd(e);
        this._onLostPointerCapture = (e) => this.handlePointerEnd(e);
        this._onBlur = () => this.releaseAll();

        this.bindEvents();
    }

    bindEvents() {
        if (!this.container) return;

        this.container.addEventListener("pointerdown", this._onPointerDown);
        this.container.addEventListener("pointerup", this._onPointerUp);
        this.container.addEventListener("pointercancel", this._onPointerCancel);
        this.container.addEventListener("lostpointercapture", this._onLostPointerCapture);
        window.addEventListener("blur", this._onBlur);
    }

    isTouchDevice() {
        return Boolean(
            window.matchMedia?.("(hover: none) and (pointer: coarse)")?.matches ||
            window.matchMedia?.("(hover: none) and (any-pointer: coarse)")?.matches
        );
    }

    handlePointerDown(e) {
        const button = e.target.closest("[data-key]");
        if (!button || !this.container?.contains(button)) return;

        e.preventDefault();
        const key = button.dataset.key;
        if (!key) return;

        try {
            button.setPointerCapture?.(e.pointerId);
        } catch {
            // Ignore if pointer capture is not supported
        }

        this.activePointers.set(e.pointerId, { button, key });
        button.classList.add("active");
        this.input?.setVirtualKey(key, true);
    }

    handlePointerEnd(e) {
        const entry = this.activePointers.get(e.pointerId);
        if (!entry) return;

        try {
            if (entry.button.hasPointerCapture?.(e.pointerId)) {
                entry.button.releasePointerCapture(e.pointerId);
            }
        } catch {
            // Ignore failure when releasing capture
        }

        this.activePointers.delete(e.pointerId);

        let keyStillHeld = false;
        let buttonStillHeld = false;
        for (const active of this.activePointers.values()) {
            if (active.key === entry.key) keyStillHeld = true;
            if (active.button === entry.button) buttonStillHeld = true;
        }

        if (!buttonStillHeld) {
            entry.button.classList.remove("active");
        }
        if (!keyStillHeld) {
            this.input?.setVirtualKey(entry.key, false);
        }
    }

    updateForState(state) {
        if (!this.actionBtn) return;

        if (state === GameState.FISHING_BITING) {
            this.actionBtn.dataset.key = "space";
            this.actionBtn.textContent = "⚡ Giật!";
        } else if (state === GameState.FISHING_MINIGAME) {
            this.actionBtn.dataset.key = "space";
            this.actionBtn.textContent = "🔥 Kéo!";
        } else if (state === GameState.FISHING_WAITING) {
            this.actionBtn.dataset.key = "e";
            this.actionBtn.textContent = "↩️ Thu";
        } else {
            this.actionBtn.dataset.key = "e";
            this.actionBtn.textContent = "🎣 Câu";
        }
    }

    releaseAll() {
        for (const { button, key } of this.activePointers.values()) {
            button.classList.remove("active");
            this.input?.setVirtualKey(key, false);
        }
        this.activePointers.clear();
    }

    show() {
        if (this.container) {
            this.container.style.display = "flex";
        }
    }

    hide() {
        this.releaseAll();
        if (this.container) {
            this.container.style.display = "none";
        }
    }

    destroy() {
        this.releaseAll();
        if (this.container) {
            this.container.removeEventListener("pointerdown", this._onPointerDown);
            this.container.removeEventListener("pointerup", this._onPointerUp);
            this.container.removeEventListener("pointercancel", this._onPointerCancel);
            this.container.removeEventListener("lostpointercapture", this._onLostPointerCapture);
        }
        window.removeEventListener("blur", this._onBlur);

        this.input = null;
        this.container = null;
        this.actionBtn = null;
        this.buttons = [];
    }
}

