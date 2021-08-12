import Game from "@cafemania/game/Game";
import TileItem, { TileItemDirection } from "@cafemania/tileItem/TileItem";
import { TileItemType } from "@cafemania/tileItem/TileItemInfo";
import Tile from "@cafemania/tile/Tile"
import Player from "@cafemania/player/Player";
import GameScene from "@cafemania/game/scene/GameScene";
import TileItemChair from "@cafemania/tileItem/TileItemChair";
import PlayerWaiter from "@cafemania/player/PlayerWaiter";
import PlayerClient from "@cafemania/player/PlayerClient";

export enum WorldType
{
    SERVER,
    CLIENT,
    VISIT
}

export default class World
{
    public static SIDE_WALK_SIZE = 25

    private _game: Game

    private _tiles = new Phaser.Structs.Map<string, Tile>([])

    private _players = new Phaser.Structs.Map<string, Player>([])

    private _mapSize = new Phaser.Math.Vector2(0, 0)
    
    private _type: WorldType

    private _paused: boolean = false

    private _lastSpawnedPlayer: number = -1
    private _playerSpawnTime: number = 5000
    private _canSpawnPlayer: boolean = false

    constructor(game: Game, type: WorldType)
    {
        this._game = game
        this._type = type

        if(this.type == WorldType.SERVER)
        {
            return
            
            this.generateNewCafe()

            this._canSpawnPlayer = true

            const waiter1 = this.createPlayerWaiter()
            waiter1.setAtTile(this.getTile(0, 5))
            
            const waiter2 = this.createPlayerWaiter()
            waiter2.setAtTile(this.getTile(-1, 5))
        }

        if(this.type == WorldType.CLIENT)
        {
            this.generateNewCafe()

            this._canSpawnPlayer = true

            const waiter1 = this.createPlayerWaiter()
            waiter1.setAtTile(this.getTile(0, 5))
            
            const waiter2 = this.createPlayerWaiter()
            waiter2.setAtTile(this.getTile(-1, 5))
        }
    }

    public get type(): WorldType { return this._type }


    public removePlayer(player: Player)
    {
        this._players.delete(player.id)

        player.destroy()
    }

    public generateNewCafe()
    {
        /*
        this._mapSize.set(
            Math.round(Math.random()*10+6),
            Math.round(Math.random()*10+6)
        )
        */

        this._mapSize.set(
            10,
            7
        )

        console.log(`[World] Generated map ${this._mapSize.x} x ${this._mapSize.y}`)

        const mapSize = this._mapSize
        const sidewalkSize = World.SIDE_WALK_SIZE
        
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

        for (let x = -4; x < -1; x += 1) {
            for (let y = 1; y < 6; y += 3) {

                //if(Math.random() >= 0.3)
                    this.putTileItemInTile(tileItemFactory.createTileItem('table1'), this.getTile(x, y)) 

                const chair = tileItemFactory.createTileItem('chair1') as TileItemChair
                chair.setDirection(TileItemDirection.BACK_FLIPPED)

                this.putTileItemInTile(chair, this.getTile(x, y+1)) 
            } 
        }

        this.putTileItemInTile(tileItemFactory.createTileItem('stove1'), this.getTile(0, 1)) 
        this.putTileItemInTile(tileItemFactory.createTileItem('stove1'), this.getTile(0, 2)) 
        this.putTileItemInTile(tileItemFactory.createTileItem('stove1'), this.getTile(0, 3)) 
        this.putTileItemInTile(tileItemFactory.createTileItem('stove1'), this.getTile(0, 4)) 
  
        this.putTileItemInTile(tileItemFactory.createTileItem('counter1'), this.getTile(-8, 1)) 
        this.putTileItemInTile(tileItemFactory.createTileItem('counter1'), this.getTile(-8, 2)) 
        this.putTileItemInTile(tileItemFactory.createTileItem('counter1'), this.getTile(-8, 3)) 
    }


    public getAllTileItemsOfType(type: TileItemType)
    {
        const tileItems: TileItem[] = []
        const tiles = this.getTiles()

        for (const tile of tiles) {

            const items = tile.getTileItemsOfType(type)

            items.map(i => tileItems.push(i))
        }

        return tileItems
    }

    public createPlayer(id?: string): Player
    {
        const player = new Player(this)

        if(id) player.setId(id)

        this._players.set(player.id, player)
        
        return player
    }

    public createPlayerClient(id?: string): PlayerClient
    {
        const player = new PlayerClient(this)

        if(id) player.setId(id)

        this._players.set(player.id, player)
        
        return player
    }

    public createPlayerWaiter(id?: string): PlayerWaiter
    {
        const player = new PlayerWaiter(this)
        player.setAtTile(this.getTile(-5, 0))

        if(id) player.setId(id)

        this._players.set(player.id, player)

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

    public processPlayerClientSpawn()
    {
        if(!this._canSpawnPlayer) return

        const now = new Date().getTime()

        if(now - this._lastSpawnedPlayer >= this._playerSpawnTime)
        {
            this._lastSpawnedPlayer = now

            this.spawnPlayerClient()
        }
    }

    public findEmptyChairs()
    {
        const chairs = <TileItemChair[]>this.getAllTileItemsOfType(TileItemType.CHAIR) 
        const emptyChairs: TileItemChair[] = []

        for (const chair of chairs)
        {
            if(!chair.isReserved && chair.hasTableInFront)
                emptyChairs.push(chair)
        }

        return emptyChairs
    }

    public spawnPlayerClient()
    {
        console.log(`[World] Player created`)

        const player = this.createPlayerClient()

        
        player.startClientBehaviour()
    }

    public update(delta: number)
    {
        if(this._paused) return

        this.processPlayerClientSpawn()


        for (const tile of this.getTiles()) tile.update(delta)
        for (const player of this.getPlayers()) player.update(delta)
    }

    public render(): void
    {
        const scene = GameScene.getScene()

        if(!scene.groundLayer) scene.groundLayer = scene.add.layer()
        if(!scene.objectsLayer) scene.objectsLayer = scene.add.layer()


        for (const tile of this.getTiles()) tile.render()
        for (const player of this.getPlayers()) player.render()
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

    public getPlayers(): Player[]
    {
        return this._players.values()
    }

    public getPlayer(id: string): Player
    {
        return this._players.get(id)
    }

    public hasPlayer(id: string): boolean
    {
        return this._players.has(id)
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
