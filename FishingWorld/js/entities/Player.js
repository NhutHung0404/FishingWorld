export class Player {

    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.width = 24;
        this.height = 28;
        this.speed = 200;

        this.direction = "down";
    }

    move(keys, deltaTime, canMoveTo) {

    let dx = 0;
    let dy = 0;

    if (keys["w"] || keys["arrowup"]) {
        dy--;
        this.direction = "up";
    }

    if (keys["s"] || keys["arrowdown"]) {
        dy++;
        this.direction = "down";
    }

    if (keys["a"] || keys["arrowleft"]) {
        dx--;
        this.direction = "left";
    }

    if (keys["d"] || keys["arrowright"]) {
        dx++;
        this.direction = "right";
    }

    // Chuan hoa toc do di cheo
    if (dx !== 0 && dy !== 0) {
        dx *= 0.7071;
        dy *= 0.7071;
    }

    const nextX = this.x + dx * this.speed * deltaTime;
    const nextY = this.y + dy * this.speed * deltaTime;

    // Kiem tra va cham truc X
    if (canMoveTo(nextX, this.y)) {
        this.x = nextX;
    }

    // Kiem tra va cham truc Y
    if (canMoveTo(this.x, nextY)) {
        this.y = nextY;
    }
    }

    // Ve nhan vat
    draw(ctx) {

        const x = this.x;
        const y = this.y;

        // Bong
        ctx.fillStyle = "#31533b";
        ctx.fillRect(x - 12, y + 9, 24, 8);

        // Chan
        ctx.fillStyle = "#343b58";
        ctx.fillRect(x - 8, y + 5, 6, 10);
        ctx.fillRect(x + 2, y + 5, 6, 10);

        // Than
        ctx.fillStyle = "#e9a34e";
        ctx.fillRect(x - 10, y - 7, 20, 17);

        // Ao
        ctx.fillStyle = "#e85d55";
        ctx.fillRect(x - 9, y - 5, 18, 13);

        // Dau
        ctx.fillStyle = "#f5c28b";
        ctx.fillRect(x - 8, y - 20, 16, 15);

        // Toc
        ctx.fillStyle = "#573c2b";
        ctx.fillRect(x - 9, y - 22, 18, 6);

        // Mat
        ctx.fillStyle = "#292929";

        if (this.direction === "down") {
            ctx.fillRect(x - 5, y - 15, 3, 3);
            ctx.fillRect(x + 3, y - 15, 3, 3);
        }

        if (this.direction === "up") {
            ctx.fillStyle = "#573c2b";
            ctx.fillRect(x - 8, y - 20, 16, 10);
        }

        if (this.direction === "left") {
            ctx.fillRect(x - 7, y - 15, 3, 3);
        }

        if (this.direction === "right") {
            ctx.fillRect(x + 4, y - 15, 3, 3);
        }

        // Mu
        ctx.fillStyle = "#e9d66b";
        ctx.fillRect(x - 12, y - 25, 24, 5);
        ctx.fillRect(x - 7, y - 31, 14, 7);
    }
}