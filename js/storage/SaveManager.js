export const CURRENT_SCHEMA_VERSION = 1;

export class SaveManager {
    constructor({
        storageAdapter,
        cloudAdapter = null,
        authService,
        eventBus = null,
        autoSaveDelayMs = 600
    }) {
        this.storageAdapter = storageAdapter;
        this.cloudAdapter = cloudAdapter;
        this.authService = authService;
        this.eventBus = eventBus;
        this.autoSaveDelayMs = autoSaveDelayMs;

        this.stateProvider = null;
        this.autoSaveTimer = null;
        this.currentProfile = null;
        this.isSaving = false;
    }

    setStateProvider(providerFn) {
        this.stateProvider = providerFn;
    }

    createDefaultProfile() {
        const now = new Date().toISOString();
        const user = this.authService.getCurrentUser();

        return {
            schemaVersion: CURRENT_SCHEMA_VERSION,
            profileId: user.profileId,
            displayName: user.displayName,
            createdAt: now,
            updatedAt: now,
            player: {
                x: 900,
                y: 720,
                direction: "down",
                level: 1,
                xp: 0
            },
            inventory: {
                gold: 100,
                capacity: 50,
                fishList: []
            },
            equipment: {
                rodId: "wooden_rod",
                baitId: null
            },
            stats: {
                totalCaught: 0,
                totalSoldGold: 0
            }
        };
    }

    migrateProfile(rawProfile) {
        const defaults = this.createDefaultProfile();
        if (!rawProfile || typeof rawProfile !== "object") {
            return defaults;
        }

        const version = Number(rawProfile.schemaVersion || 0);
        const migrated = {
            ...defaults,
            ...rawProfile,
            schemaVersion: CURRENT_SCHEMA_VERSION,
            player: {
                ...defaults.player,
                ...(rawProfile.player || {})
            },
            inventory: {
                ...defaults.inventory,
                ...(rawProfile.inventory || {}),
                fishList: Array.isArray(rawProfile.inventory?.fishList)
                    ? rawProfile.inventory.fishList
                    : []
            },
            equipment: {
                ...defaults.equipment,
                ...(rawProfile.equipment || {})
            },
            stats: {
                ...defaults.stats,
                ...(rawProfile.stats || {})
            }
        };

        if (version < CURRENT_SCHEMA_VERSION) {
            migrated.updatedAt = new Date().toISOString();
        }

        return migrated;
    }

    async load() {
        const profileId = this.authService.getProfileId();
        let loaded = await this.storageAdapter.loadProfile(profileId);

        if (
            !loaded &&
            this.cloudAdapter?.isConfigured() &&
            this.authService.isAuthenticated()
        ) {
            try {
                loaded = await this.cloudAdapter.loadProfile(profileId);
            } catch (error) {
                console.warn("[SaveManager] Cloud load failed:", error);
            }
        }

        this.currentProfile = this.migrateProfile(loaded);
        this.eventBus?.emit("save:loaded", this.currentProfile);
        return this.currentProfile;
    }

    buildSnapshot() {
        const base = this.currentProfile || this.createDefaultProfile();
        const liveState = this.stateProvider ? this.stateProvider() : {};

        return {
            ...base,
            ...liveState,
            schemaVersion: CURRENT_SCHEMA_VERSION,
            profileId: this.authService.getProfileId(),
            displayName: this.authService.getDisplayName(),
            updatedAt: new Date().toISOString()
        };
    }

    async save(immediate = true) {
        if (!immediate) {
            this.scheduleAutoSave();
            return true;
        }

        if (this.autoSaveTimer) {
            clearTimeout(this.autoSaveTimer);
            this.autoSaveTimer = null;
        }

        const snapshot = this.buildSnapshot();
        this.currentProfile = snapshot;
        this.isSaving = true;

        try {
            const profileId = this.authService.getProfileId();
            const savedLocal = await this.storageAdapter.saveProfile(profileId, snapshot);

            if (
                this.cloudAdapter?.isConfigured() &&
                this.authService.isAuthenticated()
            ) {
                this.cloudAdapter.saveProfile(profileId, snapshot).catch((err) => {
                    console.warn("[SaveManager] Cloud sync failed:", err);
                });
            }

            if (savedLocal) {
                this.eventBus?.emit("save:completed", { updatedAt: snapshot.updatedAt });
            }

            return savedLocal;
        } finally {
            this.isSaving = false;
        }
    }

    scheduleAutoSave() {
        if (this.autoSaveTimer) {
            clearTimeout(this.autoSaveTimer);
        }

        this.autoSaveTimer = setTimeout(() => {
            this.autoSaveTimer = null;
            this.save(true);
        }, this.autoSaveDelayMs);
    }

    async reset() {
        if (this.autoSaveTimer) {
            clearTimeout(this.autoSaveTimer);
            this.autoSaveTimer = null;
        }

        const profileId = this.authService.getProfileId();
        await this.storageAdapter.clearProfile(profileId);
        this.currentProfile = this.createDefaultProfile();
        await this.storageAdapter.saveProfile(profileId, this.currentProfile);
        this.eventBus?.emit("save:reset", this.currentProfile);
        return this.currentProfile;
    }

    destroy() {
        if (this.autoSaveTimer) {
            clearTimeout(this.autoSaveTimer);
            this.autoSaveTimer = null;
        }
    }
}
