# System Patterns

## Architecture Overview
Hệ thống sử dụng kiến trúc Hướng đối tượng (OOP) theo chuẩn ES6 Modules kết hợp với Mô hình Phát sự kiện (Event-Driven Pattern via `EventBus`).

```
js/
├── main.js (Entry Point & Bootstrap)
├── core/
│   ├── Game.js (Main Orchestrator)
│   ├── Renderer.js (Game Loop & Canvas Resizing)
│   ├── Camera.js (Viewport Follow)
│   ├── Input.js (Keyboard Input Handling)
│   ├── GameState.js (Enum trạng thái Game)
│   └── EventBus.js (Pub/Sub Event System)
├── entities/
│   ├── Player.js
│   └── Fish.js
├── fishing/
│   ├── FishingSystem.js
│   ├── FishingMiniGame.js
│   ├── FishingRod.js
│   └── FishDatabase.js
├── systems/
│   ├── Inventory.js
│   ├── EquipmentSystem.js
│   ├── ProgressionSystem.js
│   ├── FishpediaSystem.js
│   ├── QuestSystem.js
│   ├── ShopSystem.js
│   ├── TimeManager.js
│   ├── WeatherSystem.js
│   ├── LightingSystem.js
│   ├── AudioManager.js
│   ├── EffectManager.js
│   └── ItemDatabase.js
├── storage/
│   ├── SaveManager.js
│   ├── LocalStorageAdapter.js
│   ├── CloudStorageAdapter.js
│   └── AuthService.js
├── ui/
│   ├── HUD.js
│   ├── InventoryUI.js
│   ├── FishingUI.js
│   ├── ShopUI.js
│   ├── FishpediaUI.js
│   ├── QuestUI.js
│   ├── SettingsUI.js
│   ├── Phase3ModalsUI.js (Adapter tương thích)
│   ├── TouchControls.js
│   └── ToastManager.js
└── world/
    └── World.js
```

## Key Patterns
- **Dependency Injection**: `Game.js` nhận DOM UI, `EventBus`, `SaveManager`, `AuthService` và truyền cho các system/UI component.
- **Event-Driven**: Các hệ thống (`Inventory`, `Progression`, `Quest`, `Fishpedia`) phát sự kiện qua `EventBus` (`gold:changed`, `xp:gained`, `fish:caught`), UI lắng nghe để cập nhật hiển thị mà không gắn chặt logic.
- **Lifecycle Clean-up**: Mỗi UI component và System cung cấp phương thức `destroy()` để unbind event listener, dọn dẹp bộ nhớ và hủy timer.
- **Single Responsibility Principle (SRP)**: Mỗi UI module quản lý duy nhất một cửa sổ giao diện tương ứng (HUD, InventoryUI, ShopUI, FishpediaUI, QuestUI, SettingsUI).
