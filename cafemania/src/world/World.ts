import Game from "@cafemania/game/Game";
import TileItem, { TileItemDirection } from "@cafemania/tileItem/TileItem";
import { TileItemType } from "@cafemania/tileItem/TileItemInfo";
import Tile from "@cafemania/tile/Tile"

export default class World
{
    private _game: Game

    private _tiles = new Phaser.Structs.Map<string, Tile>([])

    constructor(game: Game)
    {
        this._game = game

        const mapSize = {x: 15, y: 15}
        
        for(let y = 0; y < mapSize.y; y++)
        {
            for(let x = 0; x < mapSize.x; x++)
            {
                this.addTile(x, y)
            }
        }

        for (let y = 1; y < mapSize.y; y += 1) {
            for (let x = 0; x < mapSize.x-1; x += 1) {
                this.putTileItemInTile(this.getGame().tileItemFactory.createTileItem('floor1'), this.getTile(x, y))
            }
        }

        for (let x = 2; x < 12; x += 2) {
            this.putTileItemInTile(this.getGame().tileItemFactory.createTileItem('window1'), this.getTile(x, 1)) 
        }

        for (let x = 4; x < 12; x += 2) {
            this.putTileItemInTile(this.getGame().tileItemFactory.createTileItem('chair1'), this.getTile(x, 3)) 
        }

        for (let y = 1; y < 15; y += 1) this.putTileItemInTile(this.getGame().tileItemFactory.createTileItem('wall1'), this.getTile(mapSize.x-1, y))
        
        for (let x = 0; x < 14; x += 1) 
        {
            const tileItem = this.getGame().tileItemFactory.createTileItem('wall1')

            tileItem.direction = TileItemDirection.FRONT_FLIPPED

            this.putTileItemInTile(tileItem, this.getTile(x, 0))
        }

        this.putTileItemInTile(this.getGame().tileItemFactory.createTileItem('window1'), this.getTile(3, 3))
    }

    public putTileItemInTile(tileItem: TileItem, tile: Tile): void
    {
        const canBePlaced = this.canTileItemBePlaced(tileItem, tile.x, tile.y, tileItem.direction)

        if(!canBePlaced) return
        
        tile.addTileItem(tileItem)

        console.log(`[World] TileItem '${tileItem.getTileItemInfo().name}' was placed at tile (${tile.x}, ${tile.y})`)
    }

    public tileExists(x: number, y: number): boolean
    {
        return this._tiles.has(`${x}:${y}`)
    }

    public static getCoordsTileItemOccupes(sizeX: number, sizeY: number, direction: TileItemDirection): Phaser.Math.Vector2[]
    {
        const coords: Phaser.Math.Vector2[] = []

        const isFlipped = direction == TileItemDirection.FRONT_FLIPPED || direction == TileItemDirection.BACK_FLIPPED

        const size = {
            x: isFlipped ? sizeY : sizeX,
            y: isFlipped ? sizeX : sizeY
        }
        
        const off = TileItem.getOffsetByDirection(sizeX, sizeY, direction)

        for (let iy = 0; iy <= (size.y-1); iy++)
        {
            for (let ix = 0; ix <= (size.x-1); ix++)
            {
                let testingX = ix + off.x
                let testingY = iy + off.y

                if(isFlipped)
                {
                    testingX -= (size.x-1)
                    testingY -= (size.y-1)
                }

                coords.push(new Phaser.Math.Vector2(testingX, testingY))
            }
        }

        return coords
    }

    public getOccupiedTilesMap(compareTileItem?: TileItem): {[coord: string]: boolean }
    {
        const map: {[coord: string]: boolean} = {}

        const tiles = this.getTiles()

        const tileItems: TileItem[] = []

        for (const tile of tiles) 
        {
            map[tile.id] = false

            tile.getTileItems().map(tileItem => tileItems.push(tileItem))
        }

        for (const tileItem of tileItems)
        {
            const size = tileItem.getTileItemInfo().size
            const occupiedCoords = World.getCoordsTileItemOccupes(size.x, size.y, tileItem.direction)
            const tile = tileItem.getTile()

            for (const oc of occupiedCoords) {
                const key = `${tile.x + oc.x}:${tile.y + oc.y}`

                let canBePlaced = true

                if(compareTileItem)
                {
                    if(tileItem.getTileItemInfo().type == TileItemType.WALL) canBePlaced = false
                    if(compareTileItem.getTileItemInfo().type == tileItem.getTileItemInfo().type) canBePlaced = false
                    if(compareTileItem.getTileItemInfo().placeType == tileItem.getTileItemInfo().placeType && compareTileItem.getTileItemInfo().type != TileItemType.FLOOR && tileItem.getTileItemInfo().type != TileItemType.FLOOR) canBePlaced = false
                }

                if(!canBePlaced) map[key] = true
            }
        }

        return map
    }

    public canTileItemBePlaced(tileItem: TileItem, tileX: number, tileY: number, direction: TileItemDirection): boolean
    {
        const tileItemInfo = tileItem.getTileItemInfo()

        const coords = World.getCoordsTileItemOccupes(tileItemInfo.size.x, tileItemInfo.size.y, direction)

        const ocuppiedTiles = this.getOccupiedTilesMap(tileItem)

        const currentAtTiles = World.getCoordsTileItemOccupes(tileItemInfo.size.x, tileItemInfo.size.y, tileItem.direction)

        if(tileItem.isInAnyTile())
        {
            const atTile = tileItem.getTile()

            for (const coord of currentAtTiles)
            {
                ocuppiedTiles[`${atTile.x + coord.x}:${atTile.y + coord.y}`] = false
            }

        }

        for (const coord of coords)
        {
            if(!this.tileExists(tileX + coord.x, tileY + coord.y)) return false

            if(ocuppiedTiles[`${tileX + coord.x}:${tileY + coord.y}`]) return false
        }

        return true
    }

 
    public render(): void
    {
        const scene = this.getGame().getGameScene()

        if(!scene.groundLayer) scene.groundLayer = scene.add.layer()
        if(!scene.objectsLayer) scene.objectsLayer = scene.add.layer()

        for (const tile of this.getTiles())
        {
            tile.render()
        }
    }

    public getTile(x: number, y: number): Tile
    {
        return this._tiles.get(`${x}:${y}`)
    }

    public getGame(): Game
    {
        return this._game
    }

    public addTile(x: number, y: number): Tile
    {
        const tile = new Tile(this, x, y)

        this._tiles.set(tile.id, tile);

        return tile
    }

    public getTiles(): Tile[]
    {
        return this._tiles.values()
    }
}

