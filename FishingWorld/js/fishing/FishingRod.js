export class FishingRod {

    draw(ctx, player) {

        const x = player.x;
        const y = player.y;

        ctx.save();

        ctx.strokeStyle = "#70452b";
        ctx.lineWidth = 3;
        ctx.lineCap = "round";

        ctx.beginPath();

        if (player.direction === "down") {
            ctx.moveTo(x + 8, y);
            ctx.lineTo(x + 25, y - 35);
        }
        else if (player.direction === "up") {
            ctx.moveTo(x + 8, y - 5);
            ctx.lineTo(x + 25, y - 40);
        }
        else if (player.direction === "left") {
            ctx.moveTo(x - 8, y);
            ctx.lineTo(x - 40, y - 25);
        }
        else {
            ctx.moveTo(x + 8, y);
            ctx.lineTo(x + 40, y - 25);
        }

        ctx.stroke();
        ctx.restore();
    }
}