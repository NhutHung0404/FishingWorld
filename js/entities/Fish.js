export class Fish {

    constructor(name, rarity, price, chance, size) {

        this.name = name;
        this.rarity = rarity;
        this.price = price;
        this.chance = chance;
        this.size = size;

    }

    getInfo() {

        return `${this.name} - ${this.rarity}`;

    }

    getPrice() {

        return this.price;

    }

}