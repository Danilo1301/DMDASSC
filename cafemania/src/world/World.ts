import { Game } from "@cafemania/game/Game";
import { Grid } from "@cafemania/grid/Grid";
import { Player, PlayerType } from "@cafemania/player/Player";
import { GameScene } from "@cafemania/scenes/GameScene";
import { Tile } from "@cafemania/tile/Tile";
import { TileItem } from "@cafemania/tileItem/TileItem";
import { TileItemDoor } from "@cafemania/tileItem/TileItemDoor";
import { TileItemType } from "@cafemania/tileItem/TileItemInfo";
import { TileItemRender } from "@cafemania/tileItem/TileItemRender";
import { TileItemWall } from "@cafemania/tileItem/TileItemWall";
import { Direction } from "@cafemania/utils/Direction";
import { WorldText } from "@cafemania/utils/WorldText";
import { Utils } from "@cafemania/utils/Utils";
import { TileItemCounter } from "@cafemania/tileItem/TileItemCounter";
import { TileItemChair } from "@cafemania/tileItem/TileItemChair";
import { PlayerClient } from "@cafemania/player/PlayerClient";
import { PlayerWaiter } from "@cafemania/player/PlayerWaiter";
import { v4 as uuidv4 } from 'uuid';
import { TileItemTable } from "@cafemania/tileItem/TileItemTable";
import { PlayerCheff } from "@cafemania/player/PlayerCheff";

export enum WorldEvent
{
    PLAYER_CLIENT_SPAWNED = "PLAYER_CLIENT_SPAWNED",
    PLAYER_CLIENT_SIT_CHAIR_DATA = "PLAYER_CLIENT_SIT_CHAIR_DATA", //change to find chair
    PLAYER_CLIENT_REACHED_DOOR = "PLAYER_CLIENT_REACHED_DOOR",
    PLAYER_CLIENT_REACHED_CHAIR = "PLAYER_CLIENT_REACHED_CHAIR",
    PLAYER_WAITER_SERVE_CLIENT = "PLAYER_WAITER_SERVE_CLIENT",
    PLAYER_WAITER_FINISH_SERVE = "PLAYER_WAITER_FINISH_SERVE",

    PLAYER_CLIENT_EXITED_CAFE = "PLAYER_CLIENT_EXITED_CAFE",
    TILE_ITEM_UPDATED = "TILE_ITEM_UPDATED",
    TILE_ITEM_STOVE_BEGIN_COOK = "TILE_ITEM_STOVE_BEGIN_COOK"

    //PLAYER_CLIENT_ARRIVED_DOOR = "PLAYER_CLIENT_ARRIVED_DOOR",
    //PLAYER_CLIENT_GO_TO_CHAIR = "PLAYER_CLIENT_GO_TO_CHAIR",
    //PLAYER_CLIENT_SAT_ON_CHAIR = "PLAYER_CLIENT_SAT_ON_CHAIR",
    //PLAYER_WAITER_BEGIN_SERVE = "PLAYER_WAITER_BEGIN_SERVE",
    //PLAYER_WAITER_FINISHED_SERVE = "PLAYER_WAITER_FINISHED_SERVE"
}

export enum WorldType
{
    DEFAULT,
    CLIENT,
    SERVER
}

export class World
{
    public events = new Phaser.Events.EventEmitter()
    
    private _game: Game

    private _id: string

    private _tiles = new Phaser.Structs.Map<string, Tile>([])
    private _sideWalkTiles = new Phaser.Structs.Map<string, Tile>([])

    private _tileItems = new Phaser.Structs.Map<string, TileItem>([])

    private _players = new Phaser.Structs.Map<string, Player>([])

    private _grid: Grid

    private _sideWalkSize: number = 15
   
    private _canSpawnPlayer: boolean = false
    private _lastSpawnedPlayer: number = 0
    private _spawnedPlayersAmount: number = 0
    private _maxSpawnPlayers: number = 15

    protected _type: WorldType = WorldType.DEFAULT

    constructor(game: Game)
    {
        this._game = game
        this._id = uuidv4()
        this._grid = new Grid()

        this.events.on(WorldEvent.PLAYER_CLIENT_EXITED_CAFE, () =>
        {
            this._spawnedPlayersAmount--
        })
    }

    public get type()
    {
        return this._type
    }

    public get id()
    {
        return this._id
    }

    public getSideWalkSize()
    {
        return this._sideWalkSize
    }

    public getLeftSideWalkSpawn()
    {
        return this.getTile(-2, this.getSideWalkSize()-1)
    }

    public getRightSideWalkSpawn()
    {
        return this.getTile(this.getSideWalkSize()-1, -2)
    }

    public getGrid()
    {
        return this._grid
    }


    public update(delta: number)
    {
        this.getTiles().map(tile => tile.update(delta))
        this.getPlayers().map(player => player.update(delta))

        if(this._canSpawnPlayer) this.updateSpawnPlayerClient()
    }

    public render(delta: number): void
    {
        const scene = GameScene.Instance

        this.getTiles().map(tile => tile.render(delta))
        this.getPlayers().map(player => player.render(delta))

    }

    public findTileItem(id: string): TileItem | undefined
    {
        return this._tileItems.get(id)
    }

    public findPlayer(id: string): Player | undefined
    {
        return this._players.get(id)
    }

    public changePlayerId(player: Player, id: string)
    {
        this._players.delete(player.id)

        player.setId(id)

        this._players.set(player.id, player)
    }

    private updateSpawnPlayerClient()
    {
        const now = new Date().getTime()

        if(now - this._lastSpawnedPlayer >= 3000 && this._spawnedPlayersAmount < this._maxSpawnPlayers)
        {
            this._lastSpawnedPlayer = now
            this._spawnedPlayersAmount++

            this.spawnPlayerClient()
        }
    }
    
    public hasTile(x: number, y: number)
    {
        return this._tiles.has(`${x}:${y}`)
    }

    public getTiles()
    {
        return Array.from(this._tiles.values())
    }

    public addTile(x: number, y: number)
    {
        const grid = this._grid

        grid.addCell(x, y)

        const tile = new Tile(this, x, y)

        this._tiles.set(tile.id, tile)

        return tile
        //console.log(`Created tile ${tile.id}`)
    }

    public addSideWalkTile(x: number, y: number)
    {
        const tile = this.addTile(x, y)

        this._sideWalkTiles.set(tile.id, tile)

        return tile
    }

    public getRandomWalkableTile(insideCafe?: boolean): Tile
    {
 
        let tiles = this.getTiles().filter(tile => tile.isWalkable())

        if(insideCafe)
            tiles = tiles.filter(tile => tile.x >= 0 && tile.y >= 0)

        return Utils.shuffleArray(tiles)[0]
    }

    public getTile(x: number, y: number)
    {
        return this._tiles.get(`${x}:${y}`)
    }

    public canTileItemBePlacedAtTile(tileItem: TileItem, tile: Tile, direction?: Direction)
    {
        if(direction === undefined) direction = tileItem.direction

        const grid = this.getGrid()
        const cell = grid.getCell(tile.x, tile.y)
        const size = tileItem.getInfo().size

        const o = TileItemRender.valuesFromDirection(direction)

        return grid.canItemBePlaced(cell, size, o[0], o[1], (compareCell, compareItem) =>
        {
            if(!compareItem)
                return true

            if(compareItem.id == tileItem.id)
                return true
            
            const compareTileItem = this.getTile(compareItem.getOriginCell().x, compareItem.getOriginCell().y).getTileItem(compareItem.id)!

            if(tileItem.getInfo().type == TileItemType.WALL)
                return false

            if(compareTileItem.getInfo().type == tileItem.getInfo().type)
                return false
                
            if(compareTileItem.getInfo().placeType == tileItem.getInfo().placeType && compareTileItem.getInfo().type != TileItemType.FLOOR && tileItem.getInfo().type != TileItemType.FLOOR)
                return false
                
            return true
        })
    }

    public setTileItemDirection(tileItem: TileItem, direction: Direction)
    {
        const tile = tileItem.getTile()
        const canBePlaced = this.canTileItemBePlacedAtTile(tileItem, tile, direction)

        if(!canBePlaced) return false
        
        const gridItem = this.getGrid().getItem(tileItem.id)
        const o = TileItemRender.valuesFromDirection(direction)

        gridItem.setChangeRotation(o[0])
        gridItem.setFlipCells(o[1])

        return true
    }

    public putTileItemInTile(tileItem: TileItem, tile: Tile): void
    {
        //const canBePlaced = this.canTileItemBePlacedAtTile(tileItem, tile)

        //if(!canBePlaced) return

        tile.addTileItem(tileItem)

        if(!this._tileItems.has(tileItem.id)) this._tileItems.set(tileItem.id, tileItem)

        const gridItem = this.getGrid().addItem(tileItem.id, tile.x, tile.y, tileItem.getInfo().size)
        const type = tileItem.getInfo().type

        if(type == TileItemType.FLOOR) gridItem.color = 0
        if(type == TileItemType.WALL) gridItem.color = 0xcccccc
    }

    public setPlayerClientSpawnEnabled(value: boolean)
    {
        this._canSpawnPlayer = value
    }

    public resetSpawnedClientsCounter()
    {
        this._spawnedPlayersAmount = 0
    }

    public isTileInSideWalk(tile: Tile)
    {
        return this._sideWalkTiles.has(tile.id)
    }

    public generateSideWalks(size?: number)
    {
        if(size != undefined) this._sideWalkSize = size

        for (let y = -2; y < this.getSideWalkSize(); y++)
        {
            for (let x = -2; x < this.getSideWalkSize(); x++)
            {
                if((x == -2 || y == -2))
                {
                    if(this.hasTile(x, y)) continue

                    const tile = this.addSideWalkTile(x, y)
                    this.addNewTileItem('test_floor1', tile)
                }
            }
        }
    }

    public resetChairsAndTables()
    {
        this.getChairs().map(chair => {
            chair.setIsReserved(false)
            chair.setPlayerSitting(undefined)
        })

        this.getTables().map(table => {
            table.clearDish()
        })
    }

    public createDefaultWaiters()
    {
        this.createPlayerWaiter(2, 6)
        this.createPlayerWaiter(2, 8)

        this.createPlayerCheff(2,4)
    }

    public removeAllPlayers()
    {
        this.getPlayers().map(player => this.removePlayer(player))
    }

    public createDefaultMap(sizeX: number, sizeY: number)
    {
        this.createTileMap(sizeX, sizeY)

        const tileItemFactory = this.getGame().getTileItemFactory()

        this.addNewTileItem('door1', this.getTile(0, 1), Direction.EAST)

        this.addNewTileItem('stove1', this.getTile(0, 2), Direction.EAST)
        this.addNewTileItem('stove1', this.getTile(0, 3), Direction.EAST)

        this.addNewTileItem('counter1', this.getTile(0, 4), Direction.EAST)
        this.addNewTileItem('counter1', this.getTile(0, 5), Direction.EAST)
        this.addNewTileItem('counter1', this.getTile(0, 6), Direction.EAST)
        this.addNewTileItem('counter1', this.getTile(0, 7), Direction.EAST)
        this.addNewTileItem('counter1', this.getTile(0, 8), Direction.EAST)
        


        for (let y = 0; y < sizeY-1; y++)
        {
            for (let x = 0; x < sizeX; x++)
            {
                const tile = this.getTile(x, y)

                if(y % 3 == 1 && x >= 4)
                {
                    const chair = tileItemFactory.createTileItem('chair1')
                    this.putTileItemInTile(chair, tile)
                    chair.setDirection(Direction.NORTH)
                }

                if(y % 3 == 0 && x >= 4)
                {
                    const floorDecoration1 = tileItemFactory.createTileItem('table1')
                    this.putTileItemInTile(floorDecoration1, tile)
                }
            }
        }
    }

    public createTileMap(sizeX: number, sizeY: number)
    {
        this._sideWalkSize = Math.max(sizeX, sizeY) + 3

        const tileItemFactory = this.getGame().getTileItemFactory()

        for (let y = 0; y < sizeY; y++)
        {
            for (let x = 0; x < sizeX; x++)
            {
                const tile = this.addTile(x, y)
                this.addNewTileItem('floor1', tile)
            }
        }

        for (let y = -1; y < sizeY; y++)
        {
            for (let x = -1; x < sizeX; x++)
            {
                if((x == -1 || y == -1) && !(x == -1 && y == -1))
                {
                    const tile = this.addTile(x, y)
                    const direction = x == -1 ? Direction.EAST : undefined
                    const wall = this.addNewTileItem('wall1', tile, direction)
                }
            }
        }

        this.generateSideWalks()
    }

    public addNewTileItem(id: string, tile: Tile, direction?: Direction, tileItemId?: string)
    {
        const tileItem = this.getGame().getTileItemFactory().createTileItem(id)

        if(tileItemId != null) tileItem.setId(tileItemId)

        this.putTileItemInTile(tileItem, tile)

        if(direction != undefined) tileItem.setDirection(direction)

        return tileItem
    }

  
    public getPlayers()
    {
        return this._players.values()
    }

    public getPlayerClients()
    {
        return this.getPlayers().filter(player => player.type == PlayerType.CLIENT) as PlayerClient[]
    }

    public getPlayerWaiters()
    {
        return this.getPlayers().filter(player => player.type == PlayerType.WAITER) as PlayerWaiter[]
    }

    public getPlayerCheff()
    {
        return this.getPlayers().filter(player => player.type == PlayerType.CHEFF)[0] as PlayerCheff
    }

    public removePlayer(player: Player)
    {
        this._players.delete(player.id)
        player.destroy()
    }

    public createPlayer(tileX: number, tileY: number)
    {
        return this.setupPlayer(new Player(this), tileX, tileY)
    }

    public spawnPlayerClient()
    {
        const spawnTile = Math.random() > 0.5 ? this.getLeftSideWalkSpawn() : this.getRightSideWalkSpawn()
        
        const player = this.createPlayerClient(spawnTile.x, spawnTile.y)

        this.events.emit(WorldEvent.PLAYER_CLIENT_SPAWNED, player)

        player.startClientBehavior()
    }

    public createPlayerClient(tileX: number, tileY: number)
    {
        const player = this.setupPlayer(new PlayerClient(this), tileX, tileY) as PlayerClient

        return player
    }

    public createPlayerWaiter(tileX: number, tileY: number)
    {
        const player = this.setupPlayer(new PlayerWaiter(this), tileX, tileY) as PlayerWaiter

        return player
        
    }

    public createPlayerCheff(tileX: number, tileY: number)
    {
        const player = this.setupPlayer(new PlayerCheff(this), tileX, tileY) as PlayerCheff
        return player
    }
    
    private setupPlayer(player: Player, tileX, tileY)
    {
        this._players.set(player.id, player)

        player.setAtTile(tileX, tileY)

        return player
    }

    public getDoors(): TileItemDoor[]
    {
        return this.getAllTileItemsOfType(TileItemType.DOOR) as TileItemDoor[]
    }

    public getCounters(empty?: boolean): TileItemCounter[]
    {
        let counters = this.getAllTileItemsOfType(TileItemType.COUNTER) as TileItemCounter[]

        if(empty) counters = counters.filter(counter => counter.isEmpty())

        return counters
    }

    public getTables(): TileItemTable[]
    {
        let tables = this.getAllTileItemsOfType(TileItemType.TABLE) as TileItemTable[]
        return tables
    }

    public getChairs(empty?: boolean): TileItemChair[]
    {
        let chairs = this.getAllTileItemsOfType(TileItemType.CHAIR) as TileItemChair[]

        if(empty)
        {
            chairs = chairs.filter(chair =>
            {
                if(!chair.isEmpty()) return false
                if(chair.isReserved()) return false
                return true
            })
        }

        return chairs
    }

    public getAllTileItemsOfType(type: TileItemType)
    {
        const tileItems: TileItem[] = []

        this.getTiles().map(tile =>
        {
            tile.getTileItems().map(tileItem =>
            {
                if(tileItem.getInfo().type == type) tileItems.push(tileItem)
            })
        })

        return tileItems
    }

    public getGame()
    {
        return this._game
    }

    private startRandomlyRotate(tileItem: TileItem, time: number)
    {
        let direction = 0
        
        setInterval(() => {

            const result = tileItem.setDirection(direction)
 
            if(!result)
            {
                new WorldText(GameScene.Instance, `Can't rotate!`, tileItem.getTile().getPosition(), 0xff0000)
            }
            
            direction = Math.floor(Math.random()*4)

        }, time)
    }
}