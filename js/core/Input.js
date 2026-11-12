export class Input {
    constructor() {
        this.keys = {};
        this.previousKeys = {};

        window.addEventListener("keydown", (e) => {
            const key = e.key.toLowerCase();

            if ([
                "w", "a", "s", "d",
                "arrowup", "arrowdown",
                "arrowleft", "arrowright"
            ].includes(key)) {
                e.preventDefault();
            }

            this.keys[key] = true;
        });

        window.addEventListener("keyup", (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });

        window.addEventListener("blur", () => {
            for (const key in this.keys) {
                this.keys[key] = false;
            }
        });
    }

    isPressed(key) {
        return this.keys[key.toLowerCase()] === true;
    }

    isJustPressed(key) {
        return this.keys[key.toLowerCase()] === true &&
            !this.previousKeys?.[key.toLowerCase()];
    }

    update() {
        this.previousKeys = { ...this.keys };
    }

    isJustPressed(key) {
        key = key.toLowerCase();

        return this.keys[key] === true &&
            this.previousKeys[key] !== true;
    }
}
