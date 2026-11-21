export class SettingsUI {
    constructor(elements = {}) {
        this.modal = elements.settingsModal || elements.modal || null;
        this.closeBtn = elements.closeSettingsBtn || elements.closeBtn || null;
        this.openBtn = elements.openSettingsBtn || elements.openBtn || null;

        this._handlers = {};
        this._onOpenClick = null;
        this._onCloseClick = null;
    }

    bindEvents(handlers = {}) {
        this._handlers = handlers;

        if (this.openBtn && !this._onOpenClick) {
            this._onOpenClick = () => {
                this.openBtn.blur();
                if (this._handlers.onOpenSettings) {
                    this._handlers.onOpenSettings();
                } else if (this._handlers.onOpen) {
                    this._handlers.onOpen();
                }
            };
            this.openBtn.addEventListener("click", this._onOpenClick);
        }

        if (this.closeBtn && !this._onCloseClick) {
            this._onCloseClick = () => {
                this.closeBtn.blur();
                if (this._handlers.onCloseModal) {
                    this._handlers.onCloseModal("settings");
                } else if (this._handlers.onClose) {
                    this._handlers.onClose();
                }
            };
            this.closeBtn.addEventListener("click", this._onCloseClick);
        }
    }

    isOpen() {
        return this.modal?.style.display === "block";
    }

    open() {
        if (this.modal) this.modal.style.display = "block";
    }

    close() {
        if (this.modal) this.modal.style.display = "none";
    }

    render() {
        // Module cơ bản tương thích cấu trúc
    }

    destroy() {
        if (this.openBtn && this._onOpenClick) {
            this.openBtn.removeEventListener("click", this._onOpenClick);
            this._onOpenClick = null;
        }
        if (this.closeBtn && this._onCloseClick) {
            this.closeBtn.removeEventListener("click", this._onCloseClick);
            this._onCloseClick = null;
        }
        this._handlers = {};
    }
}
