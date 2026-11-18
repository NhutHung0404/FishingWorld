export class Input {
    constructor() {
        this.keys = {};
        this.previousKeys = {};
        this.virtualKeys = {};
        this.previousVirtualKeys = {};

        this._onKeyDown = (e) => {
            if (this.isFormInputFocused()) {
                return;
            }

            const key = this.normalizeKey(e.key);

            if ([
                "w", "a", "s", "d",
                "arrowup", "arrowdown",
                "arrowleft", "arrowright",
                "space"
            ].includes(key)) {
                e.preventDefault();
            }

            this.keys[key] = true;
        };

        this._onKeyUp = (e) => {
            const key = this.normalizeKey(e.key);
            this.keys[key] = false;
        };

        this._onBlur = () => {
            this.clear();
        };

        window.addEventListener("keydown", this._onKeyDown);
        window.addEventListener("keyup", this._onKeyUp);
        window.addEventListener("blur", this._onBlur);
    }

    normalizeKey(rawKey) {
        if (rawKey === " ") {
            return "space";
        }
        return String(rawKey || "").toLowerCase();
    }

    isFormInputFocused() {
        const active = document.activeElement;
        if (!active) return false;
        const tag = active.tagName;
        return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || active.isContentEditable;
    }

    setVirtualKey(key, isPressed) {
        const normalized = this.normalizeKey(key);
        this.virtualKeys[normalized] = Boolean(isPressed);
    }

    isPressed(key) {
        const normalized = this.normalizeKey(key);
        return this.keys[normalized] === true || this.virtualKeys[normalized] === true;
    }

    isJustPressed(key) {
        const normalized = this.normalizeKey(key);
        const current = this.keys[normalized] === true || this.virtualKeys[normalized] === true;
        const previous = this.previousKeys[normalized] === true || this.previousVirtualKeys[normalized] === true;
        return current && !previous;
    }

    anyPressed(keys) {
        return keys.some((key) => this.isPressed(key));
    }

    clear() {
        for (const key in this.keys) {
            this.keys[key] = false;
        }
        for (const key in this.previousKeys) {
            this.previousKeys[key] = false;
        }
        for (const key in this.virtualKeys) {
            this.virtualKeys[key] = false;
        }
        for (const key in this.previousVirtualKeys) {
            this.previousVirtualKeys[key] = false;
        }
    }

    update() {
        this.previousKeys = { ...this.keys };
        this.previousVirtualKeys = { ...this.virtualKeys };
    }

    destroy() {
        window.removeEventListener("keydown", this._onKeyDown);
        window.removeEventListener("keyup", this._onKeyUp);
        window.removeEventListener("blur", this._onBlur);
        this.clear();
    }
}
