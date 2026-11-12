export class World {

    constructor() {

        // Kich thuoc ban do
        this.width = 1800;
        this.height = 1200;

        // Kich thuoc moi o co
        this.tileSize = 32;

        // Ho nuoc
        this.lake = {
            x: 900,
            y: 480,
            rx: 400,
            ry: 210
        };

        // Ben go
        this.dock = {
            x: 850,
            y: 440,
            width: 100,
            height: 300
        };

        // Danh sach cay
        this.trees = [
            { x: 500, y: 760 },
            { x: 650, y: 900 },
            { x: 1300, y: 750 },
            { x: 1350, y: 550 },
            { x: 500, y: 350 },
            { x: 1200, y: 950 },
            { x: 550, y: 1000 },
            { x: 1450, y: 1000 },
            { x: 300, y: 500 },
            { x: 1500, y: 300 },
            { x: 700, y: 150 },
            { x: 1100, y: 150 }
        ];
    }
    drawGrass(ctx) {

    ctx.fillStyle = "#70a85c";
    ctx.fillRect(
        0, 0,
        this.width,
        this.height
    );

    for (let y = 0; y < this.height; y += this.tileSize) {
        for (let x = 0; x < this.width; x += this.tileSize) {

            if ((x / this.tileSize + y / this.tileSize) % 2 === 0) {
                ctx.fillStyle = "#79b466";
                ctx.fillRect(
                    x, y,
                    this.tileSize,
                    this.tileSize
                );
            }
        }
    }

    // Co nho trang tri
    for (let i = 0; i < 300; i++) {

        const x = (i * 137) % this.width;
        const y = (i * 79) % this.height;

        ctx.fillStyle = "#4e914d";
        ctx.fillRect(x, y, 4, 4);
    }
    }
}