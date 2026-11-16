export class ToastManager {
    constructor(containerEl = null, maxToasts = 4) {
        this.container = containerEl || this.createContainer();
        this.maxToasts = maxToasts;
    }

    createContainer() {
        let el = document.getElementById("toastContainer");
        if (!el) {
            el = document.createElement("div");
            el.id = "toastContainer";
            el.className = "toast-container";
            document.body.appendChild(el);
        }
        return el;
    }

    show(message, type = "info", durationMs = 2600) {
        if (!this.container || !message) return;

        while (this.container.children.length >= this.maxToasts) {
            this.container.firstElementChild?.remove();
        }

        const icons = {
            success: "✅",
            info: "💬",
            warning: "⚠️",
            error: "❌"
        };

        const toast = document.createElement("div");
        toast.className = `toast-item toast-${type}`;
        toast.innerHTML = `<span class="toast-icon">${icons[type] || "💬"}</span><span class="toast-text"></span>`;
        toast.querySelector(".toast-text").textContent = message;

        this.container.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add("show"));

        const remove = () => {
            toast.classList.remove("show");
            setTimeout(() => toast.remove(), 220);
        };

        const timer = setTimeout(remove, durationMs);
        toast.addEventListener("click", () => {
            clearTimeout(timer);
            remove();
        });
    }
}
