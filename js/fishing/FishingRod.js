export class FishingRod {

    draw(ctx, player, bobberX = null, bobberY = null, active = false) {
        const x = player.x;
        const y = player.y;

        let rodTipX = x + 25;
        let rodTipY = y - 35;

        if (player.direction === "up") {
            rodTipX = x + 25;
            rodTipY = y - 40;
        } else if (player.direction === "left") {
            rodTipX = x - 40;
            rodTipY = y - 25;
        } else if (player.direction === "right") {
            rodTipX = x + 40;
            rodTipY = y - 25;
        }

        ctx.save();
        ctx.strokeStyle = "#70452b";
        ctx.lineWidth = 3;
        ctx.lineCap = "round";

        ctx.beginPath();
        if (player.direction === "down") {
            ctx.moveTo(x + 8, y);
            ctx.lineTo(rodTipX, rodTipY);
        } else if (player.direction === "up") {
            ctx.moveTo(x + 8, y - 5);
            ctx.lineTo(rodTipX, rodTipY);
        } else if (player.direction === "left") {
            ctx.moveTo(x - 8, y);
            ctx.lineTo(rodTipX, rodTipY);
        } else {
            ctx.moveTo(x + 8, y);
            ctx.lineTo(rodTipX, rodTipY);
        }
        ctx.stroke();

        // Vẽ dây câu Bezier cong tự nhiên
        if (active && bobberX !== null && bobberY !== null) {
            ctx.strokeStyle = "#f5e8bd";
            ctx.lineWidth = 1;

            const midX = (rodTipX + bobberX) / 2;
            const dist = Math.hypot(bobberX - rodTipX, bobberY - rodTipY);
            // Độ võng dây câu tùy theo khoảng cách
            const sag = Math.min(40, dist * 0.15);
            const midY = (rodTipY + bobberY) / 2 + sag;

            ctx.beginPath();
            ctx.moveTo(rodTipX, rodTipY);
            ctx.quadraticCurveTo(midX, midY, bobberX, bobberY);
            ctx.stroke();
        }

        ctx.restore();
    }
}