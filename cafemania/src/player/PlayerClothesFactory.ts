import { Game } from "@cafemania/game/Game";

export enum ClothingType {
    EYES,
    EYEBROWS,
    MOUTH,
    HAIR,
    HAT,
    //glasses/accessories
    LEGS,
    BODY,
    SHOES
}

export interface IPlayerClothing {
    id: string
    name: string
    texture: string
    model: string
    type: ClothingType
}

export class PlayerClothesFactory {

    private _clothes: {[id: string]: IPlayerClothing} = {};

    constructor(game: Game) {
        this.add({
            id: 'hair1',
            name: 'Hair 1',
            texture: 'hair/1',
            model: 'hair/1',
            type: ClothingType.HAIR
        });

        this.add({
            id: 'hair2',
            name: 'Hair 2',
            texture: 'hair/1',
            model: 'hair/2',
            type: ClothingType.HAIR
        });

        this.add({
            id: 'shoes1',
            name: 'Shoes 1',
            texture: 'shoes/1',
            model: 'shoes/1',
            type: ClothingType.SHOES
        });
        this.add({
            id: 'shoes2',
            name: 'Shoes 2',
            texture: 'shoes/1',
            model: 'shoes/2',
            type: ClothingType.SHOES
        });

        console.log(this._clothes);
    }

    public get(id: string) {
        return this._clothes[id];
    }

    public add(clothing: IPlayerClothing) {
        this._clothes[clothing.id] = clothing;
    }
}