# Progress

## Completed Features & Verifications
- [x] **Core Game Loop & Renderer**: `Game.js`, `Renderer.js` (Tách thành công ở Step 1), `Camera.js`, `Input.js`, `GameState.js`.
- [x] **Fishing Mechanics**: `FishingSystem.js`, `FishingMiniGame.js`, `FishingRod.js`, `FishDatabase.js`.
- [x] **Game Systems**: `Inventory.js`, `EquipmentSystem.js`, `ProgressionSystem.js`, `FishpediaSystem.js`, `QuestSystem.js`, `ShopSystem.js`, `TimeManager.js`, `WeatherSystem.js`, `LightingSystem.js`, `AudioManager.js`, `EffectManager.js`.
- [x] **Storage & Auth**: `SaveManager.js`, `LocalStorageAdapter.js`, `CloudStorageAdapter.js`, `AuthService.js`.
- [x] **Phase 4.1 UI**: `HUD.js` (Hiển thị XP, Gold, Level, Time, Weather, SaveStatus).
- [x] **Phase 4.2 Mobile UI**: `TouchControls.js` (D-pad & Touch Action buttons), co giãn Canvas DPR.
- [x] **Phase 5.1 Step 1**: Tách `Renderer.js` khỏi `Game.js` (Đã xác minh trong mã nguồn).
- [x] **Phase 5.1 Step 2**: Tách `Phase3ModalsUI.js` thành `ShopUI.js`, `FishpediaUI.js`, `QuestUI.js`, `SettingsUI.js` (Đã tách, tích hợp vào `Game.js`, có `destroy()` và giữ `Phase3ModalsUI` làm adapter).

## Pending / Unverified Features
- [ ] `SettingsUI.js`: Chưa có giao diện Settings modal trong HTML hiện tại (đã tạo module stub cơ bản tương thích).
- [ ] Aquarium, Multi-Zone World, Cloud Sync UI (Dành cho các Phase tiếp theo).
