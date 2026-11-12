export class Camera {

    constructor(canvas, worldWidth, worldHeight) {
        this.canvas = canvas;

        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;

        this.x = 0;
        this.y = 0;
    }

    // Camera theo doi nhan vat
    follow(player) {

        this.x = player.x - this.canvas.width / 2;
        this.y = player.y - this.canvas.height / 2;

        // Gioi han camera theo ban do
        this.x = Math.max(
            0,
            Math.min(
                this.x,
                this.worldWidth - this.canvas.width
            )
        );

        this.y = Math.max(
            0,
            Math.min(
                this.y,
                this.worldHeight - this.canvas.height
            )
        );
    }
}