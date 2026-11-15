# FishingWorld — TODO & Tiến độ Nâng cấp

## Đã hoàn thành (Phase 1)
- [x] **Tái cấu trúc Core Engine & Entry Point:**
  - Kích hoạt `js/main.js` làm entry point chính và cập nhật `index.html`.
  - Đóng gói toàn bộ vòng lặp game vào `class Game` (`js/core/Game.js`) với lifecycle `init()`, `start()`, `stop()`, `update()`, `render()`, `destroy()`.
  - Tạo `js/core/EventBus.js` (Pub/Sub) và `js/core/GameState.js` (quản lý trạng thái `EXPLORING`, `FISHING_*`, `UI_MODAL`, `PAUSED`).
- [x] **Sửa lỗi Gameplay & Cải tiến Input / Camera:**
  - Sửa trùng lặp `isJustPressed()` và chuẩn hóa phím `Space` trong `js/core/Input.js`.
  - Nâng cấp `js/core/Camera.js` với smooth lerp và hiệu ứng screen shake.
  - Sửa lỗi không đồng bộ trạng thái cắn câu (`biting` vs `bite`) trong `js/fishing/FishingSystem.js` và `Game.js`.
  - Sửa lỗi logic vùng câu cá `isNearLake()` / `canStartFishing()` / `getBobberPosition()` trong `js/world/World.js`.
  - Thêm `js/ui/HUD.js` đồng bộ tên người chơi, vàng trên `.top-bar`, chỉ số túi cá và trạng thái lưu.
- [x] **Hệ thống Lưu trữ nền tảng (LocalStorage + Cloud-Ready):**
  - Tạo `StorageAdapter.js`, `LocalStorageAdapter.js`, `CloudStorageAdapter.js`, `AuthService.js`, `SaveManager.js` trong `js/storage/`.
  - Hỗ trợ serialize/deserialize `Player`, `Fish`, `Inventory` với auto-save và schema migration (`CURRENT_SCHEMA_VERSION = 1`).

## Việc cần làm tiếp theo

### Phase 2: Thế giới sống động, Đồ họa 2D, Nước động & Ngày/Đêm
- [x] Mở rộng `World.js` với các vùng nước sâu, đèn lồng bến gỗ, bụi cây, đá bờ hồ và hoa trang trí.
- [x] Cài đặt Y-Sorting (depth sorting) và Offscreen Canvas Caching cho địa hình tĩnh.
- [x] Nâng cấp `EffectManager.js` thành Canvas Particle Engine (gợn sóng nước, tia nước splash, sprite cá nhảy tại vị trí phao, chữ nổi floating text).
- [x] Thêm `TimeManager.js`, `LightingSystem.js`, `WeatherSystem.js` (chu kỳ Dawn/Day/Dusk/Night, đèn lồng bến gỗ, mưa nhẹ, đom đóm đêm).
- [x] Nâng cấp animation bước đi/vung cần của `Player.js`, dây câu Bezier của `FishingRod.js` và bộ âm thanh `AudioManager.js`.

### Phase 3: Chiều sâu Gameplay — Shop, Nâng cấp, Cá đa dạng & Mini-game
- [ ] Mở rộng `FishDatabase.js` (15–20+ loài theo khu vực, giờ, thời tiết, trọng lượng ngẫu nhiên).
- [ ] Xây dựng `FishpediaSystem.js`, `ItemDatabase.js`, `EquipmentSystem.js`, `ShopSystem.js`, `ProgressionSystem.js`, `QuestSystem.js`.
- [ ] Đặt NPC Thương nhân để mua cần câu, mồi câu, nâng cấp sức chứa túi cá.
- [ ] Nâng cấp `FishingMiniGame.js` (vùng mục tiêu ngẫu nhiên, vùng Perfect/Crit, cơ chế căng dây với cá hiếm, hỗ trợ Click/Tap).

### Phase 4: UI/UX hiện đại, Cloud Sync & Tối ưu hoàn thiện
- [ ] Thiết kế lại HUD và các Modal UI (`ShopUI`, `FishpediaUI`, `SettingsUI`, `ToastManager`, lọc/khóa cá trong `InventoryUI`).
- [ ] Tối ưu Responsive & thêm điều khiển cảm ứng (D-pad ảo / nút hành động) cho Mobile.
- [ ] Hoàn thiện giao diện Hồ sơ / Đăng nhập Cloud & `SyncManager` giải quyết xung đột local/cloud.
- [ ] Kiểm thử toàn diện edge-case và tối ưu hiệu năng 60 FPS.
