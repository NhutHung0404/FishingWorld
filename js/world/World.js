export class World {

    constructor() {
        // Kích thước bản đồ
        this.width = 1800;
        this.height = 1200;
        this.tileSize = 32;

        // Hồ nước chính
        this.lake = {
            x: 900,
            y: 480,
            rx: 400,
            ry: 210
        };

        // Bến gỗ
        this.dock = {
            x: 850,
            y: 440,
            width: 100,
            height: 300
        };

        // Danh sách cây
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

        // Đèn lồng chiếu sáng ban đêm
        this.lanterns = [
            { x: 858, y: 455 },
            { x: 942, y: 455 },
            { x: 858, y: 690 },
            { x: 942, y: 690 },
            { x: 535, y: 540 },
            { x: 1280, y: 420 }
        ];

        // Bụi cây trang trí
        this.bushes = [
            { x: 450, y: 680 },
            { x: 760, y: 770 },
            { x: 1040, y: 760 },
            { x: 1260, y: 620 },
            { x: 620, y: 270 },
            { x: 1160, y: 260 }
        ];

        // Đá bờ hồ (Khu vực Bờ Đá Sâu phía Đông)
        this.rocks = [
            { x: 1310, y: 480, r: 16 },
            { x: 1330, y: 510, r: 12 },
            { x: 480, y: 490, r: 14 },
            { x: 740, y: 260, r: 15 }
        ];

        // Offscreen canvas cache cho địa hình tĩnh
        this.bgCacheCanvas = null;
        this.buildBackgroundCache();
    }

    buildBackgroundCache() {
        const canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;
        const ctx = canvas.getContext("2d");

        // Cỏ nền
        ctx.fillStyle = "#70a85c";
        ctx.fillRect(0, 0, this.width, this.height);

        for (let y = 0; y < this.height; y += this.tileSize) {
            for (let x = 0; x < this.width; x += this.tileSize) {
                if ((x / this.tileSize + y / this.tileSize) % 2 === 0) {
                    ctx.fillStyle = "#79b466";
                    ctx.fillRect(x, y, this.tileSize, this.tileSize);
                }
            }
        }

        // Cỏ nhỏ trang trí
        for (let i = 0; i < 350; i++) {
            const x = (i * 137) % this.width;
            const y = (i * 79) % this.height;
            ctx.fillStyle = "#4e914d";
            ctx.fillRect(x, y, 4, 4);
        }

        // Hoa nhỏ rải rác
        const flowerColors = ["#f9eb7c", "#ff99c8", "#ffffff"];
        for (let i = 0; i < 90; i++) {
            const fx = (i * 211 + 50) % this.width;
            const fy = (i * 149 + 30) % this.height;
            if (!this.isWater(fx, fy)) {
                ctx.fillStyle = flowerColors[i % flowerColors.length];
                ctx.fillRect(fx, fy, 4, 4);
            }
        }

        // Bờ hồ
        ctx.fillStyle = "#b3a06b";
        ctx.beginPath();
        ctx.ellipse(
            this.lake.x,
            this.lake.y,
            this.lake.rx + 12,
            this.lake.ry + 12,
            0, 0, Math.PI * 2
        );
        ctx.fill();

        // Mặt nước hồ
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

        // Vùng nước sâu (phía Đông & Giữa hồ)
        ctx.fillStyle = "#2b7f96";
        ctx.beginPath();
        ctx.ellipse(
            this.lake.x + 80,
            this.lake.y - 10,
            this.lake.rx * 0.55,
            this.lake.ry * 0.55,
            0, 0, Math.PI * 2
        );
        ctx.fill();

        this.bgCacheCanvas = canvas;
    }

    drawBackground(ctx, timeSec = 0) {
        if (this.bgCacheCanvas) {
            ctx.drawImage(this.bgCacheCanvas, 0, 0);
        }

        // Sóng nước động nhẹ trên mặt hồ
        ctx.fillStyle = "#70c7d4";
        for (let i = 0; i < 35; i++) {
            const baseX = this.lake.x - 340 + (i * 73) % 680;
            const y = this.lake.y - 165 + (i * 47) % 330;
            const x = baseX + Math.sin(timeSec * 1.5 + i) * 6;

            if (this.isWater(x, y) && !this.onDock(x, y)) {
                ctx.fillRect(x, y, 16, 2.5);
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

    drawSingleTree(ctx, tree) {
        // Bóng cây
        ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
        ctx.beginPath();
        ctx.ellipse(tree.x, tree.y + 22, 18, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Thân cây
        ctx.fillStyle = "#70452b";
        ctx.fillRect(tree.x - 8, tree.y, 16, 24);

        // Tán cây
        ctx.fillStyle = "#286b3a";
        ctx.fillRect(tree.x - 24, tree.y - 32, 48, 40);

        ctx.fillStyle = "#3d914d";
        ctx.fillRect(tree.x - 16, tree.y - 40, 32, 32);
    }

    drawSingleBush(ctx, bush) {
        ctx.fillStyle = "#2b6e3c";
        ctx.beginPath();
        ctx.arc(bush.x, bush.y, 14, 0, Math.PI * 2);
        ctx.arc(bush.x - 10, bush.y + 4, 10, 0, Math.PI * 2);
        ctx.arc(bush.x + 10, bush.y + 4, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#489957";
        ctx.beginPath();
        ctx.arc(bush.x - 3, bush.y - 4, 9, 0, Math.PI * 2);
        ctx.fill();
    }

    drawSingleRock(ctx, rock) {
        ctx.fillStyle = "#7c8589";
        ctx.beginPath();
        ctx.arc(rock.x, rock.y, rock.r, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#9da7ac";
        ctx.beginPath();
        ctx.arc(rock.x - 3, rock.y - 3, rock.r * 0.65, 0, Math.PI * 2);
        ctx.fill();
    }

    drawSingleLantern(ctx, lantern, isNight) {
        // Cột gỗ
        ctx.fillStyle = "#4a2c16";
        ctx.fillRect(lantern.x - 3, lantern.y - 26, 6, 26);

        // Đế đèn
        ctx.fillStyle = "#2c353d";
        ctx.fillRect(lantern.x - 7, lantern.y - 34, 14, 10);

        // Lồng đèn phát sáng về đêm
        ctx.fillStyle = isNight ? "#ffdd66" : "#d9e3e8";
        ctx.fillRect(lantern.x - 4, lantern.y - 31, 8, 6);
    }

    getRenderables(player, fishingRod, fishingSystem, isNight) {
        const list = [];

        for (const tree of this.trees) {
            list.push({
                y: tree.y + 20,
                draw: (ctx) => this.drawSingleTree(ctx, tree)
            });
        }

        for (const bush of this.bushes) {
            list.push({
                y: bush.y + 8,
                draw: (ctx) => this.drawSingleBush(ctx, bush)
            });
        }

        for (const rock of this.rocks) {
            list.push({
                y: rock.y + rock.r * 0.5,
                draw: (ctx) => this.drawSingleRock(ctx, rock)
            });
        }

        for (const lantern of this.lanterns) {
            list.push({
                y: lantern.y,
                draw: (ctx) => this.drawSingleLantern(ctx, lantern, isNight)
            });
        }

        list.push({
            y: player.y + 12,
            draw: (ctx) => {
                player.draw(ctx);
                fishingRod.draw(
                    ctx,
                    player,
                    fishingSystem.bobberX,
                    fishingSystem.bobberY,
                    fishingSystem.active
                );
            }
        });

        list.sort((a, b) => a.y - b.y);
        return list;
    }

    getLightSources(player, fishingSystem) {
        const lights = [];

        // Đèn lồng
        for (const l of this.lanterns) {
            lights.push({ x: l.x, y: l.y - 28, radius: 110, intensity: 0.95 });
        }

        // Hào quang nhẹ quanh người chơi
        lights.push({ x: player.x, y: player.y - 10, radius: 95, intensity: 0.75 });

        // Phao sáng nếu cá đang cắn
        if (fishingSystem.active && fishingSystem.isBitingOrTiming()) {
            lights.push({
                x: fishingSystem.bobberX,
                y: fishingSystem.bobberY,
                radius: 45,
                intensity: 0.85
            });
        }

        return lights;
    }

    drawTrees(ctx) {
        for (const tree of this.trees) {
            this.drawSingleTree(ctx, tree);
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
        for (const rock of this.rocks) {
            const dx = x - rock.x;
            const dy = y - rock.y;
            if (Math.sqrt(dx * dx + dy * dy) < rock.r + 12) {
                return true;
            }
        }
        return false;
    }

    canMoveTo(x, y) {
        if (
            x < 15 ||
            y < 15 ||
            x > this.width - 15 ||
            y > this.height - 15
        ) {
            return false;
        }

        const points = [
            [x - 10, y - 12],
            [x + 10, y - 12],
            [x - 10, y + 12],
            [x + 10, y + 12]
        ];

        for (const [px, py] of points) {
            if (this.isWater(px, py) && !this.onDock(px, py)) {
                return false;
            }
        }

        if (this.isTreeCollision(x, y)) {
            return false;
        }

        return true;
    }

    isNearLake(x, y, margin = 85) {
        if (this.onDock(x, y) || this.isNearDock(x, y)) {
            return true;
        }

        const rxOuter = this.lake.rx + margin;
        const ryOuter = this.lake.ry + margin;
        const dx = (x - this.lake.x) / rxOuter;
        const dy = (y - this.lake.y) / ryOuter;

        return dx * dx + dy * dy <= 1;
    }

    canStartFishing(x, y) {
        return this.isNearDock(x, y) || this.isNearLake(x, y, 65);
    }

    getBobberPosition(x, y, direction = "down") {
        const offsets = {
            up: { dx: 0, dy: -85 },
            down: { dx: 0, dy: 85 },
            left: { dx: -85, dy: 0 },
            right: { dx: 85, dy: 0 }
        };

        const offset = offsets[direction] || offsets.down;
        const candidateX = x + offset.dx;
        const candidateY = y + offset.dy;

        if (this.isWater(candidateX, candidateY) && !this.onDock(candidateX, candidateY)) {
            return { x: candidateX, y: candidateY };
        }

        // Fallback: cast toward the lake center outside the dock
        const angle = Math.atan2(this.lake.y - y, this.lake.x - x);
        for (let dist = 70; dist <= 220; dist += 25) {
            const tx = x + Math.cos(angle) * dist;
            const ty = y + Math.sin(angle) * dist;
            if (this.isWater(tx, ty) && !this.onDock(tx, ty)) {
                return { x: Math.round(tx), y: Math.round(ty) };
            }
        }

        return {
            x: this.lake.x - 90,
            y: this.lake.y + 40
        };
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