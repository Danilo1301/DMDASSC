import Game from "@cafemania/game/Game";
import TileItem, { TileItemDirection } from "@cafemania/tileItem/TileItem";
import Tile from "@cafemania/world/tile/Tile"

/*
private _layers = new Map<Layer, Phaser.GameObjects.Layer>()

enum Layer {
    GROUND,
    OBJECTS,
    COLLISION
}

const ground = this.add.layer()
        ground.setDepth(0)

        const objects = this.add.layer()
        objects.setDepth(5)

        const collision = this.add.layer()
        collision.setDepth(10)

        this._layers.set(Layer.GROUND, ground)
        this._layers.set(Layer.OBJECTS, objects)
        this._layers.set(Layer.COLLISION, collision)
*/

export default class World
{
    private _game: Game;

    private _tiles = new Phaser.Structs.Map<string, Tile>([])

    constructor(game: Game)
    {
        this._game = game

        for(let y = 0; y < 15; y++)
        {
            for(let x = 0; x < 15; x++)
            {
                this.addTile(x, y)
            }
        }

        this.putTileItemInTile(this.getGame().tileItemFactory.createTileItem('fogao0'), this.getTile(0, 0))
        this.putTileItemInTile(this.getGame().tileItemFactory.createTileItem('fogao0'), this.getTile(1, 1))

        this.putTileItemInTile(this.getGame().tileItemFactory.createTileItem('fogao0'), this.getTile(0, 3))

        this.putTileItemInTile(this.getGame().tileItemFactory.createTileItem('fogao0'), this.getTile(1, 6))
        
 
        //this.putTileItemInTile(this.getGame().tileItemFactory.createTileItem('1by1'), this.getTile(3, 3))
        //his.putTileItemInTile(this.getGame().tileItemFactory.createTileItem('2by3'), this.getTile(0, 0))
        //this.putTileItemInTile(this.getGame().tileItemFactory.createTileItem('chao0'), this.getTile(9, 2))
        //this.putTileItemInTile(this.getGame().tileItemFactory.createTileItem('fogao0'), this.getTile(1, 6))
        //this.putTileItemInTile(this.getGame().tileItemFactory.createTileItem('3by3'), this.getTile(9, 7))
  

        //tileItem.setDirection(TileItemDirection.BACK_FLIPPED)


     
        

        //this.getTile(1, 0).addTileItem( this.getGame().tileItemFactory.createTileItem('chair0') )
        //this.getTile(0, 0).addTileItem( this.getGame().tileItemFactory.createTileItem('chair0') )
        //this.getTile(1, 1).addTileItem( this.getGame().tileItemFactory.createTileItem('fogao0') )


        

        //this.getTile(1, 0).addTileItem( this.getGame().tileItemFactory.createTileItem('fogao0')  )
        //this.getTile(1, 0).addTileItem( this.getGame().tileItemFactory.createTileItem('fogao0')  )
        //this.getTile(2, 2).addTileItem( this.getGame().tileItemFactory.createTileItem('fogao0')  )
    }

    public putTileItemInTile(tileItem: TileItem, tile: Tile)
    {
        const canBePlaced = this.canTileItemBePlaced(tileItem, tile.x, tile.y, tileItem.direction)

        if(canBePlaced) 
        {
            console.log(`[World] TileItem '${tileItem.getTileItemInfo().name}' was placed at tile (${tile.x, tile.y})`)

            tile.addTileItem(tileItem)
        }
    }

    public tileExists(x: number, y: number)
    {
        return this._tiles.has(`${x}:${y}`)
    }

    public getCoordsTileItemOccupes(sizeX: number, sizeY: number, direction: TileItemDirection)
    {

    }

    public canTileItemBePlaced(tileItem: TileItem, tileX: number, tileY: number, direction: TileItemDirection)
    {
        const tileItemInfo = tileItem.getTileItemInfo()

        const isFlipped = direction == TileItemDirection.FRONT_FLIPPED || direction == TileItemDirection.BACK_FLIPPED

        const size = {
            x: isFlipped ? tileItemInfo.size.y : tileItemInfo.size.x,
            y: isFlipped ? tileItemInfo.size.x : tileItemInfo.size.y
        }
        
        const off = TileItem.getOffsetByDirection(tileItemInfo.size.x, tileItemInfo.size.y, direction)

        for (let iy = 0; iy <= (size.y-1); iy++)
        {
            
            for (let ix = 0; ix <= (size.x-1); ix++)
            {
                let testingX = tileX + ix + off.x
                let testingY = tileY + iy + off.y

                if(isFlipped)
                {
                    testingX -= (size.x-1)
                    testingY -= (size.y-1)
                }

                if(!this.tileExists(testingX, testingY)) return false
            }
        }

        return true
    }

 
    public render(): void
    {
        for (const tile of this.getTiles())
        {
            tile.render()
        }
    }

    public getTile(x: number, y: number)
    {
        return this._tiles.get(`${x}:${y}`)
    }

    public getGame()
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

