export class LightingSystem {
    constructor() {
        this.lightCanvas = document.createElement("canvas");
        this.lightCtx = this.lightCanvas.getContext("2d");
    }

    renderLighting(ctx, width, height, camera, ambientLight, lightSources = []) {
        // Nếu ban ngày (darkness <= 0.05), không vẽ ánh sáng bóng đêm
        if (ambientLight.darkness <= 0.05) {
            return;
        }

        if (this.lightCanvas.width !== width || this.lightCanvas.height !== height) {
            this.lightCanvas.width = width;
            this.lightCanvas.height = height;
        }

        const lctx = this.lightCtx;
        lctx.clearRect(0, 0, width, height);

        // Fill bóng tối nền
        lctx.fillStyle = `rgba(15, 20, 45, ${ambientLight.darkness})`;
        lctx.fillRect(0, 0, width, height);

        // Đổi Blend Mode để đục lỗ ánh sáng vàng ấm
        lctx.globalCompositeOperation = "destination-out";

        const cameraX = camera.getRenderX();
        const cameraY = camera.getRenderY();

        for (const light of lightSources) {
            // Quy đổi tọa độ world về màn hình screen
            const screenX = light.x - cameraX;
            const screenY = light.y - cameraY;
            const radius = light.radius || 80;

            // Kiểm tra nguồn sáng có nằm trong khung hình canvas không
            if (
                screenX + radius < 0 ||
                screenX - radius > width ||
                screenY + radius < 0 ||
                screenY - radius > height
            ) {
                continue;
            }

            const gradient = lctx.createRadialGradient(
                screenX,
                screenY,
                0,
                screenX,
                screenY,
                radius
            );

            const intensity = light.intensity || 1.0;
            gradient.addColorStop(0, `rgba(0, 0, 0, ${intensity})`);
            gradient.addColorStop(0.5, `rgba(0, 0, 0, ${intensity * 0.5})`);
            gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

            lctx.fillStyle = gradient;
            lctx.beginPath();
            lctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
            lctx.fill();
        }

        lctx.globalCompositeOperation = "source-over";

        // Draw overlay bóng tối đã khoét ánh sáng lên màn hình chính
        ctx.save();
        ctx.drawImage(this.lightCanvas, 0, 0);

        // Phủ màu ấm (tint) dịu nhẹ cho các điểm sáng
        lctx.globalCompositeOperation = "source-over";
        ctx.restore();
    }
}