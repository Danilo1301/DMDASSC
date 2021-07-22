export interface TileItemInfoCollision
{
    isWall: boolean
    height: number
    x: number
    y: number
}

export default class TileItemInfo
{
    public id: string = ""
    public name: string
    public texture: string
    public size: Phaser.Math.Vector2
    public sprites: number
    public layers: number
    public collision: TileItemInfoCollision = {
        isWall: false,
        height: 0,
        x: 0,
        y: 0
    }

    constructor(name: string, texture: string, size: Phaser.Math.Vector2, sprites: number, layers: number)
    {
        this.name = name;
        this.texture = texture;
        this.size = size;
        this.sprites = sprites;
        this.layers = layers;
    }
}