const AUTH_STORAGE_KEY = "fishingworld_auth_session";

export class AuthService {
    constructor(eventBus = null) {
        this.eventBus = eventBus;
        this.session = this.loadLocalSession();
    }

    loadLocalSession() {
        try {
            const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && parsed.profileId) {
                    return parsed;
                }
            }
        } catch (error) {
            console.warn("[AuthService] Failed to parse local session:", error);
        }

        return {
            mode: "guest",
            profileId: "guest_local",
            displayName: "Guest",
            token: null
        };
    }

    persistLocalSession() {
        try {
            window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(this.session));
        } catch (error) {
            console.warn("[AuthService] Failed to persist local session:", error);
        }
    }

    getCurrentUser() {
        return { ...this.session };
    }

    getProfileId() {
        return this.session.profileId;
    }

    getDisplayName() {
        return this.session.displayName || "Guest";
    }

    getToken() {
        return this.session.token || null;
    }

    isGuest() {
        return this.session.mode !== "cloud";
    }

    isAuthenticated() {
        return this.session.mode === "cloud" && Boolean(this.session.token);
    }

    setGuestName(displayName) {
        const cleanName = String(displayName || "").trim().slice(0, 24) || "Guest";
        this.session.displayName = cleanName;
        this.persistLocalSession();
        this.eventBus?.emit("auth:changed", this.getCurrentUser());
        return this.getCurrentUser();
    }

    // Cloud-ready login hook (to be wired to backend endpoint in Phase 4)
    async loginWithToken({ profileId, displayName, token }) {
        this.session = {
            mode: "cloud",
            profileId,
            displayName: displayName || "Player",
            token
        };
        this.persistLocalSession();
        this.eventBus?.emit("auth:changed", this.getCurrentUser());
        return this.getCurrentUser();
    }

    async logoutToGuest() {
        this.session = {
            mode: "guest",
            profileId: "guest_local",
            displayName: "Guest",
            token: null
        };
        this.persistLocalSession();
        this.eventBus?.emit("auth:changed", this.getCurrentUser());
        return this.getCurrentUser();
    }
}
