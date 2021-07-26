export interface TileItemInfoCollision
{
    wallSize: number
    isWall: boolean
    height: number
    x: number
    y: number
}

export default class TileItemInfo
{
    public id: string = ""
    public name: string = ""
    public texture: string = ""
    public size: Phaser.Math.Vector2 = new Phaser.Math.Vector2(1, 1)
    public sprites: number = 1
    public layers: number = 1
    public extraLayers: number = 0
    public collision: TileItemInfoCollision = {
        wallSize: 0,
        isWall: false,
        height: 0,
        x: 0,
        y: 0
    }
}