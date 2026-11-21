# Technical Context

## Tech Stack
- **Language**: JavaScript (ES6+ Native ES Modules).
- **Rendering**: HTML5 Canvas 2D API (Co giãn theo Device Pixel Ratio - DPR).
- **Styling**: Pure CSS (`css/style.css`) với Flexbox/Grid và CSS variables cho overlay UI.
- **Build/Bundler**: Không sử dụng bundler (No Webpack/Vite), chạy trực tiếp native ES module `<script type="module" src="js/main.js">`.

## Controls & Input
- **Desktop Keyboard**:
  - `WASD`: Di chuyển nhân vật.
  - `E`: Câu cá / Hành động.
  - `I`: Đóng/mở Túi cá.
  - `F`: Đóng/mở Cửa hàng.
  - `P`: Đóng/mở Sổ tay cá (Fishpedia).
  - `Q`: Đóng/mở Nhiệm vụ.
  - `Space`: Giữ/Kéo dây trong minigame.
- **Mobile Touch**: Virtual D-pad (di chuyển) & Action buttons (I, F, Q, P, E).

## Verification Tools
- Kiểm tra cú pháp JavaScript: `node --check <file.js>`
