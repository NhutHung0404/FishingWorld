import { StorageAdapter } from "./StorageAdapter.js";

/**
 * Cloud-ready StorageAdapter skeleton for future REST/Supabase/Firebase integration.
 * Falls back cleanly or throws structured errors when endpoint is not configured.
 */
export class CloudStorageAdapter extends StorageAdapter {
    constructor({ apiBaseUrl = "", getAuthToken = () => null } = {}) {
        super();
        this.apiBaseUrl = apiBaseUrl.replace(/\/+$/, "");
        this.getAuthToken = getAuthToken;
    }

    getType() {
        return "cloud";
    }

    isConfigured() {
        return Boolean(this.apiBaseUrl);
    }

    buildHeaders() {
        const headers = {
            "Content-Type": "application/json"
        };
        const token = this.getAuthToken();
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
        return headers;
    }

    async loadProfile(profileId) {
        if (!this.isConfigured()) {
            return null;
        }

        const response = await fetch(
            `${this.apiBaseUrl}/profiles/${encodeURIComponent(profileId)}`,
            {
                method: "GET",
                headers: this.buildHeaders()
            }
        );

        if (response.status === 404) {
            return null;
        }
        if (!response.ok) {
            throw new Error(`Cloud load failed (${response.status})`);
        }

        return response.json();
    }

    async saveProfile(profileId, data) {
        if (!this.isConfigured()) {
            return false;
        }

        const response = await fetch(
            `${this.apiBaseUrl}/profiles/${encodeURIComponent(profileId)}`,
            {
                method: "PUT",
                headers: this.buildHeaders(),
                body: JSON.stringify(data)
            }
        );

        if (!response.ok) {
            throw new Error(`Cloud save failed (${response.status})`);
        }

        return true;
    }

    async clearProfile(profileId) {
        if (!this.isConfigured()) {
            return false;
        }

        const response = await fetch(
            `${this.apiBaseUrl}/profiles/${encodeURIComponent(profileId)}`,
            {
                method: "DELETE",
                headers: this.buildHeaders()
            }
        );

        return response.ok;
    }
}
