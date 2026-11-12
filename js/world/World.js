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

    drawLake(ctx) {

    // Bo ho
    ctx.fillStyle = "#b3a06b";

    ctx.beginPath();
    ctx.ellipse(
        this.lake.x,
        this.lake.y,
        this.lake.rx + 10,
        this.lake.ry + 10,
        0, 0, Math.PI * 2
    );
    ctx.fill();

    // Mat nuoc
    ctx.fillStyle = "#399bb5";

    ctx.beginPath();
    ctx.ellipse(
        this.lake.x,
        this.lake.y,
        this.lake.rx,
        this.lake.ry,
        0, 0, Math.PI * 2
    );
    ctx.fill();

    // Song nuoc
    for (let i = 0; i < 40; i++) {

        const x = this.lake.x - 350 + (i * 73) % 700;
        const y = this.lake.y - 170 + (i * 47) % 340;

        if (this.isWater(x, y)) {
            ctx.fillStyle = "#70c7d4";
            ctx.fillRect(x, y, 18, 3);
        }
    }
    }

    isWater(x, y) {

        const dx = (x - this.lake.x) / this.lake.rx;
        const dy = (y - this.lake.y) / this.lake.ry;
        return dx * dx + dy * dy < 1;
    }

    onDock(x, y) {
    return (
        x >= this.dock.x &&
        x <= this.dock.x + this.dock.width &&
        y >= this.dock.y &&
        y <= this.dock.y + this.dock.height
    );
    }

    drawDock(ctx) {
    const dock = this.dock;

    ctx.fillStyle = "#8b5a2b";
    ctx.fillRect(
        dock.x,
        dock.y,
        dock.width,
        dock.height
    );

    ctx.strokeStyle = "#5c371d";
    ctx.lineWidth = 3;

    for (let y = dock.y; y < dock.y + dock.height; y += 24) {
        ctx.beginPath();
        ctx.moveTo(dock.x, y);
        ctx.lineTo(dock.x + dock.width, y);
        ctx.stroke();
    }
    }

    drawTrees(ctx) {
    for (const tree of this.trees) {
        // Thân cây
        ctx.fillStyle = "#70452b";
        ctx.fillRect(tree.x - 8, tree.y, 16, 24);

        // Tán cây
        ctx.fillStyle = "#286b3a";
        ctx.fillRect(tree.x - 24, tree.y - 32, 48, 40);

        ctx.fillStyle = "#3d914d";
        ctx.fillRect(tree.x - 16, tree.y - 40, 32, 32);
    }
    }

    isTreeCollision(x, y) {
    for (const tree of this.trees) {
        const dx = x - tree.x;
        const dy = y - tree.y;

        if (Math.sqrt(dx * dx + dy * dy) < 28) {
            return true;
        }
    }

    return false;
    }

    isNearLake(x, y, distance = 200) {
    const dx = x - this.lake.x;
    const dy = y - this.lake.y;

    return Math.sqrt(dx * dx + dy * dy) < distance;
    }

    isNearDock(x, y) {
    const centerX = this.dock.x + this.dock.width / 2;
    const centerY = this.dock.y + this.dock.height / 2;

    return (
        Math.abs(x - centerX) < this.dock.width / 2 + 15 &&
        Math.abs(y - centerY) < this.dock.height / 2 + 15
    );
    }
}