export interface TileItemInfoCollision
{
    wallSize?: number
    isWall?: boolean
    wallAtFront?: boolean
    height: number
    x: number
    y: number
}

export enum TileItemType
{
    FLOOR,
    WALL,
    STOVE,
    WALL_OBJECT,
    CHAIR
}

export enum TileItemPlaceType
{
    WALL,
    FLOOR
}

export default interface TileItemInfo
{
    id: string
    name: string
    texture: string
    type: TileItemType
    placeType: TileItemPlaceType
    size: Phaser.Math.Vector2
    sprites: number
    layers: number
    extraLayers: number
    collision: TileItemInfoCollision 
}