export class EventBus {
    constructor() {
        this.listeners = new Map();
    }

    on(event, callback) {
        if (typeof callback !== "function") {
            throw new TypeError("EventBus listener must be a function.");
        }

        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }

        const eventListeners = this.listeners.get(event);
        eventListeners.add(callback);

        return () => this.off(event, callback);
    }

    once(event, callback) {
        const unsubscribe = this.on(event, (payload) => {
            unsubscribe();
            callback(payload);
        });

        return unsubscribe;
    }

    off(event, callback) {
        const eventListeners = this.listeners.get(event);
        if (!eventListeners) return;

        eventListeners.delete(callback);
        if (eventListeners.size === 0) {
            this.listeners.delete(event);
        }
    }

    emit(event, payload = undefined) {
        const eventListeners = this.listeners.get(event);
        if (!eventListeners) return;

        for (const callback of [...eventListeners]) {
            callback(payload);
        }
    }

    clear(event = null) {
        if (event) {
            this.listeners.delete(event);
            return;
        }
        this.listeners.clear();
    }
}
