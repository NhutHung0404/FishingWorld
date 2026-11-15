export class StorageAdapter {
    getType() {
        return "base";
    }

    async loadProfile(_profileId) {
        throw new Error("StorageAdapter.loadProfile() must be implemented by subclass.");
    }

    async saveProfile(_profileId, _data) {
        throw new Error("StorageAdapter.saveProfile() must be implemented by subclass.");
    }

    async clearProfile(_profileId) {
        throw new Error("StorageAdapter.clearProfile() must be implemented by subclass.");
    }
}
