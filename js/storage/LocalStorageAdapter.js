import { StorageAdapter } from "./StorageAdapter.js";

export class LocalStorageAdapter extends StorageAdapter {
    constructor(prefix = "fishingworld_profile_") {
        super();
        this.prefix = prefix;
    }

    getType() {
        return "local";
    }

    getStorageKey(profileId) {
        return `${this.prefix}${profileId}`;
    }

    async loadProfile(profileId) {
        try {
            const raw = window.localStorage.getItem(this.getStorageKey(profileId));
            if (!raw) return null;
            return JSON.parse(raw);
        } catch (error) {
            console.error("[LocalStorageAdapter] Failed to load profile:", error);
            return null;
        }
    }

    async saveProfile(profileId, data) {
        try {
            const serialized = JSON.stringify(data);
            window.localStorage.setItem(this.getStorageKey(profileId), serialized);
            return true;
        } catch (error) {
            console.error("[LocalStorageAdapter] Failed to save profile:", error);
            return false;
        }
    }

    async clearProfile(profileId) {
        try {
            window.localStorage.removeItem(this.getStorageKey(profileId));
            return true;
        } catch (error) {
            console.error("[LocalStorageAdapter] Failed to clear profile:", error);
            return false;
        }
    }
}
