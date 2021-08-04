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
    CHAIR,
    TABLE
}

export enum TileItemPlaceType
{
    WALL,
    FLOOR
}

export enum TileItemRotationType
{
    DONT_ROTATE,
    SIDE_ONLY,
    SIDE_AND_BACK
}

export default interface TileItemInfo
{
    id: string
    name: string
    texture: string
    rotationType: TileItemRotationType
    type: TileItemType
    placeType: TileItemPlaceType
    size: Phaser.Math.Vector2
    sprites: number
    layers: number
    extraLayers: number
    collision: TileItemInfoCollision 
}