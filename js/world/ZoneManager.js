import {
    ZONE_IDS,
    DEFAULT_ZONE_ID,
    ZoneDatabase,
    getAllZones
} from "./ZoneDatabase.js";

export class ZoneManager {
    constructor(eventBus = null, initialZoneId = DEFAULT_ZONE_ID) {
        this.eventBus = eventBus;
        this.currentZoneId = this.hasZone(initialZoneId)
            ? initialZoneId
            : DEFAULT_ZONE_ID;
    }

    hasZone(zoneId) {
        return Boolean(zoneId && Object.prototype.hasOwnProperty.call(ZoneDatabase, zoneId));
    }

    getCurrentZoneId() {
        return this.currentZoneId;
    }

    getCurrentZoneConfig() {
        return ZoneDatabase[this.currentZoneId] || ZoneDatabase[DEFAULT_ZONE_ID];
    }

    getZoneConfig(zoneId) {
        if (!this.hasZone(zoneId)) {
            return ZoneDatabase[DEFAULT_ZONE_ID];
        }
        return ZoneDatabase[zoneId];
    }

    isZoneUnlocked(zoneId, playerLevel = 1) {
        if (!this.hasZone(zoneId)) {
            return false;
        }
        const level = Math.max(1, Number(playerLevel) || 1);
        const config = ZoneDatabase[zoneId];
        return level >= (config.minLevel || 1);
    }

    canChangeZone(zoneId, playerLevel = 1) {
        if (!this.hasZone(zoneId)) {
            return { allowed: false, reason: "invalid_zone" };
        }

        if (zoneId === this.currentZoneId) {
            return { allowed: false, reason: "already_in_zone" };
        }

        const config = ZoneDatabase[zoneId];
        const level = Math.max(1, Number(playerLevel) || 1);
        if (level < (config.minLevel || 1)) {
            return {
                allowed: false,
                reason: "level_too_low",
                requiredLevel: config.minLevel || 1
            };
        }

        return { allowed: true, reason: null };
    }

    changeZone(zoneId, playerLevel = 1) {
        const check = this.canChangeZone(zoneId, playerLevel);
        if (!check.allowed) {
            return {
                success: false,
                reason: check.reason,
                requiredLevel: check.requiredLevel || null,
                zoneId: this.currentZoneId
            };
        }

        const previousZoneId = this.currentZoneId;
        this.currentZoneId = zoneId;
        const zoneConfig = this.getCurrentZoneConfig();

        this.eventBus?.emit("zone:changed", {
            previousZoneId,
            zoneId: this.currentZoneId,
            zoneConfig
        });

        return {
            success: true,
            previousZoneId,
            zoneId: this.currentZoneId,
            zoneConfig
        };
    }

    setCurrentZone(zoneId) {
        this.currentZoneId = this.hasZone(zoneId) ? zoneId : DEFAULT_ZONE_ID;
        return this.getCurrentZoneConfig();
    }

    getAvailableZones(playerLevel = 1) {
        const level = Math.max(1, Number(playerLevel) || 1);
        return getAllZones().map((zone) => ({
            ...zone,
            unlocked: level >= (zone.minLevel || 1),
            isCurrent: zone.id === this.currentZoneId
        }));
    }

    toJSON() {
        return {
            currentZoneId: this.currentZoneId
        };
    }

    fromJSON(data) {
        if (!data || typeof data !== "object") {
            this.currentZoneId = DEFAULT_ZONE_ID;
            return this.currentZoneId;
        }
        const candidate = data.currentZoneId;
        this.currentZoneId = this.hasZone(candidate) ? candidate : DEFAULT_ZONE_ID;
        return this.currentZoneId;
    }
}

export { ZONE_IDS, DEFAULT_ZONE_ID };
