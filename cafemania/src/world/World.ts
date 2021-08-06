import Game from "@cafemania/game/Game";
import TileItem, { TileItemDirection } from "@cafemania/tileItem/TileItem";
import { TileItemType } from "@cafemania/tileItem/TileItemInfo";
import Tile from "@cafemania/tile/Tile"
import Player from "@cafemania/player/Player";
import GameScene from "@cafemania/game/scene/GameScene";
import TileItemChair from "@cafemania/tileItem/TileItemChair";

export default class World
{
    private _game: Game

    private _tiles = new Phaser.Structs.Map<string, Tile>([])

    private _players = new Phaser.Structs.Map<string, Player>([])

    public sidewalkSize = 25

    constructor(game: Game)
    {
        this._game = game

        const mapSize = new Phaser.Math.Vector2(20, 20)
        const sidewalkSize = this.sidewalkSize
        
        const tileItemFactory = this.getGame().tileItemFactory

        for(let x = -sidewalkSize; x <= 2; x++)
        {
            const y = -2

            this.addTile(x, y)
            this.putTileItemInTile(tileItemFactory.createTileItem('floor1'), this.getTile(x, y))
        }

        for(let y = -1; y <= sidewalkSize; y++)
        {
            const x = 2

            this.addTile(x, y)
            this.putTileItemInTile(tileItemFactory.createTileItem('floor1'), this.getTile(x, y))
        }

        for(let y = 0; y <= mapSize.y; y++)
        {
            for(let x = -mapSize.x; x <= 0; x++)
            {
                let addWall = x == 0 ? 1 : y == 0 ? 2 : 0

                if(x == 0 && y == 0) continue

                

                const tile = this.addTile(x + 1, y - 1)

                if(addWall != 0)
                {
                    if(x == -14) continue

                    const wall = tileItemFactory.createTileItem('wall1')

                    if(addWall == 2) wall.setDirection(TileItemDirection.FRONT_FLIPPED)
                 
                    //wall.setIsTransparent(true)
                    
                    this.putTileItemInTile(wall, tile)
                } else {
                    this.putTileItemInTile(tileItemFactory.createTileItem('floor1'), tile)
                }

               
            }
        }

        this.testGenPlayers()

        for (let x = -15; x < -12; x += 1) {
            for (let y = 1; y < 9; y += 3) {

                //if(Math.random() >= 0.3)
                    this.putTileItemInTile(tileItemFactory.createTileItem('table1'), this.getTile(x, y)) 

                const chair = tileItemFactory.createTileItem('chair1') as TileItemChair
                chair.setDirection(TileItemDirection.BACK_FLIPPED)

                this.putTileItemInTile(chair, this.getTile(x, y+1)) 
            }
            
        }

        //this.putTileItemInTile(tileItemFactory.createTileItem('stove2'), this.getTile(-18, 2)) 

        this.putTileItemInTile(tileItemFactory.createTileItem('stove1'), this.getTile(-18, 4)) 
        this.putTileItemInTile(tileItemFactory.createTileItem('stove1'), this.getTile(-18, 5)) 
        this.putTileItemInTile(tileItemFactory.createTileItem('stove1'), this.getTile(-17, 4)) 
        this.putTileItemInTile(tileItemFactory.createTileItem('stove1'), this.getTile(-17, 5)) 
  
        this.putTileItemInTile(tileItemFactory.createTileItem('counter1'), this.getTile(-18, 8)) 
        this.putTileItemInTile(tileItemFactory.createTileItem('counter1'), this.getTile(-18, 9)) 
        this.putTileItemInTile(tileItemFactory.createTileItem('counter1'), this.getTile(-18, 10)) 

        return

        for(let x = -10; x < mapSize.x + 8; x++)
        {
            const y = -1

            this.addTile(x, y)

            this.putTileItemInTile(tileItemFactory.createTileItem('floor1'), this.getTile(x, y))
        }

        for(let y = 0; y < mapSize.y; y++)
        {
            const x = mapSize.x

            this.addTile(x, y)

            this.putTileItemInTile(tileItemFactory.createTileItem('floor1'), this.getTile(x, y))
        }
        

        for(let y = 0; y < mapSize.y; y++)
        {
            for(let x = 0; x < mapSize.x; x++)
            {
                this.addTile(x, y)
            }
        }

        
        
        for (let y = 1; y < mapSize.y; y += 1) {
            for (let x = 0; x < mapSize.x-1; x += 1) {
                this.putTileItemInTile(tileItemFactory.createTileItem('floor1'), this.getTile(x, y))
            }
        }

        for (let x = 2; x < 6; x += 1) {
            for (let y = 1; y < 9; y += 3) {

                //if(Math.random() >= 0.3)
                    this.putTileItemInTile(tileItemFactory.createTileItem('table1'), this.getTile(x, y)) 

                const chair = tileItemFactory.createTileItem('chair1') as TileItemChair
                chair.setDirection(TileItemDirection.BACK_FLIPPED)

                this.putTileItemInTile(chair, this.getTile(x, y+1)) 
            }
            
        }
    
        


 
        
        /*
        for (let y = 1; y < 15; y += 1) this.putTileItemInTile(tileItemFactory.createTileItem('wall1'), this.getTile(mapSize.x-1, y))
        

        for (let x = 0; x < 14; x += 1) 
        {
            const tileItem = tileItemFactory.createTileItem('wall1')

            tileItem.setDirection(TileItemDirection.BACK_FLIPPED)

            this.putTileItemInTile(tileItem, this.getTile(x, 0))
        }
        */

        this.putTileItemInTile(tileItemFactory.createTileItem('window1'), this.getTile(13, 1))

        this.testGenPlayers()

        this.getAllTileItemsOfType(TileItemType.COUNTER)
    }

    public getAllTileItemsOfType(type: TileItemType)
    {
        const tileItems: TileItem[] = []
        const tiles = this.getTiles()

        for (const tile of tiles) {
            for (const tileItem of tile.getTileItems()) {

                if(tileItem.getTileItemInfo().type == type)
                {
                    tileItems.push(tileItem as TileItemChair)
                }
            }
        }

        return tileItems
    }

    private async testGenPlayers()
    {
        for (let i = 0; i < 30; i++) 
        {
            await new Promise<void>(resolve => {
                const player = this.createPlayer()

                //player.setAtTile(this.getTile(-this.sidewalkSize, -2))
                player.setAtTile(this.getTile(-19, 0))
         
   

                const chairs = <TileItemChair[]>this.getAllTileItemsOfType(TileItemType.CHAIR) 

                const emptyChairs: TileItemChair[] = []

              
                for (const chair of chairs)
                {
                    if(!chair.getIsReserved() && chair.hasTableInFront())
                    {
                        emptyChairs.push(chair)
                    }
                }

                if(emptyChairs.length > 0)
                {
                    const chair = emptyChairs[Math.round(Math.random()*(emptyChairs.length-1))]

                    chair.setReserved(true)

                    //console.log("Going to chair", chair)

                    const tile = chair.getTile()

                    player.taskWalkToTile(tile)
                    player.taskExecuteAction(() => {
                        player.sitAtChair(chair)
                        player.setAtTile(tile)

                        setTimeout(() => {
                            //player.setIsEating(true)

                            //player.taskWalkToTile(this.getTile(0, 1))
                        }, 3000);
                    })
                
                    /*
                    
                    player.testWalkToTile(tile.x, tile.y, true, () => {
                        player.sitAtChair(chair)

                        setTimeout(() => {
                            player.setIsEating(true)
                        }, 3000);
                    })
                    */
                    
                } else {
                    console.log("No empty chairs")

                    setInterval(() => {

                        const x = Math.round(Math.random()*-19), y = Math.round(Math.random()*19)

                        console.log(x, y)

                        if(!player.isWalking) player.testWalkToTile(x, y)
                    }, 3000)
                }

                 
                /*
                setInterval(() => {

                    if(!player._walking)
                        player.testWalkToTile(Math.round(Math.random()*14), Math.round(Math.random()*14))
                }, 2000)
                */


                

                setTimeout(() => {
                    resolve()
                }, Math.random()*1000+2000);
            })
        }
    }

    public createPlayer(): Player
    {
        const player = new Player(this)
        this._players.set(player.id, player)
        player.setAtTile(this.getTile(0, 0))
        return player
    }

    public putTileItemInTile(tileItem: TileItem, tile: Tile): void
    {
        const canBePlaced = this.canTileItemBePlaced(tileItem, tile.x, tile.y, tileItem.direction)

        if(!canBePlaced) return
        
        tile.addTileItem(tileItem)

        //console.log(`[World] TileItem '${tileItem.getTileItemInfo().name}' was placed at tile (${tile.x}, ${tile.y})`)
    }

    public tileExists(x: number, y: number): boolean
    {
        return this._tiles.has(`${x}:${y}`)
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

            let ocuppied = false

            if(compareTileItem)
            {
                if(tileItem.getTileItemInfo().type == TileItemType.WALL)
                    ocuppied = true

                if(compareTileItem.getTileItemInfo().type == tileItem.getTileItemInfo().type) 
                    ocuppied = true
                    
                if(compareTileItem.getTileItemInfo().placeType == tileItem.getTileItemInfo().placeType && compareTileItem.getTileItemInfo().type != TileItemType.FLOOR && tileItem.getTileItemInfo().type != TileItemType.FLOOR)
                    ocuppied = true
            }
            else
            {
                if(tileItem.getTileItemInfo().type != TileItemType.FLOOR)
                    ocuppied = true
            }

            for (const oc of occupiedCoords) {
                const key = `${tile.x + oc.x}:${tile.y + oc.y}`

                if(ocuppied) map[key] = ocuppied
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

    public update(delta: number)
    {
        for (const tile of this.getTiles()) tile.update(delta)
        for (const player of this._players.values()) player.update(delta)
    }

    public render(): void
    {
        const scene = GameScene.getScene()

        if(!scene.groundLayer) scene.groundLayer = scene.add.layer()
        if(!scene.objectsLayer) scene.objectsLayer = scene.add.layer()


        for (const tile of this.getTiles()) tile.render()
        for (const player of this._players.values()) player.render()
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
}
