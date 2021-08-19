import { Game } from "@cafemania/game/Game";
import { Grid } from "@cafemania/grid/Grid";
import { GameScene } from "@cafemania/scenes/GameScene";
import { Tile } from "@cafemania/tile/Tile";
import { TileItem, TileItemDirection } from "@cafemania/tileItem/TileItem";
import { TileItemType } from "@cafemania/tileItem/TileItemInfo";
import { TileItemRender } from "@cafemania/tileItem/TileItemRender";
import { WorldText } from "@cafemania/utils/WorldText";


export default class World
{
    private _game: Game

    private _tiles = new Phaser.Structs.Map<string, Tile>([])

    private _grid: Grid

    private _sideWalkSize: number = 30

    constructor(game: Game)
    {
        this._game = game
        this._grid = new Grid()

        this.createTileMap(12, 12)
    }

    public getGrid()
    {
        return this._grid
    }

    public update(delta: number)
    {
        this.getTiles().map(tile => tile.update(delta))
    }

    public render(delta: number): void
    {
        const scene = GameScene.Instance

        this.getTiles().map(tile => tile.render(delta))
    }

    private getTiles()
    {
        return Array.from(this._tiles.values())
    }

    private addTile(x: number, y: number)
    {
        const grid = this._grid

        grid.addCell(x, y)

        const tile = new Tile(x, y)

        this._tiles.set(tile.id, tile)

        return tile
        //console.log(`Created tile ${tile.id}`)
    }

    public getTile(x: number, y: number)
    {
        return this._tiles.get(`${x}:${y}`)
    }

    public canTileItemBePlacedAtTile(tileItem: TileItem, tile: Tile, direction?: TileItemDirection)
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

    public setTileItemDirection(tileItem: TileItem, direction: TileItemDirection)
    {
        const tile = tileItem.getTile()
        const canBePlaced = this.canTileItemBePlacedAtTile(tileItem, tile, direction)

        if(!canBePlaced) return false
        
        const grid = this.getGrid()
        const gridItem = grid.getItem(tileItem.id)
        const o = TileItemRender.valuesFromDirection(direction)

        gridItem.setChangeRotation(o[0])
        gridItem.setFlipCells(o[1])

        tileItem.setDirection(direction)

        return true
    }

    public putTileItemInTile(tileItem: TileItem, tile: Tile): void
    {
        //const canBePlaced = this.canTileItemBePlacedAtTile(tileItem, tile)

        //if(!canBePlaced) return

        const gridItem = this.getGrid().addItem(tileItem.id, tile.x, tile.y, tileItem.getInfo().size)
        
        tile.addTileItem(tileItem)

        if(tileItem.getInfo().type == TileItemType.FLOOR) gridItem.color = 0
        if(tileItem.getInfo().type == TileItemType.WALL) gridItem.color = 0xcccccc
    }

    private createTileMap(sizeX: number, sizeY: number)
    {
        const tileItemFactory = this.getGame().getTileItemFactory()
        
        
        for (let y = 0; y < sizeY; y++)
        {
            for (let x = 0; x < sizeX; x++)
            {
                const tile = this.addTile(x, y)

                const floor = tileItemFactory.createTileItem('floor1')

                this.putTileItemInTile(floor, tile)

                if(y % 4 == 2 && x >= 4)
                {
                    const chair = tileItemFactory.createTileItem('chair1')

                    this.putTileItemInTile(chair, tile)
                }

                if(y % 4 == 3 && x >= 4)
                {
                    const floorDecoration1 = tileItemFactory.createTileItem('floorDecoration1')

                    this.putTileItemInTile(floorDecoration1, tile)
                }
                    //this.startRandomlyRotate(chair, Math.random()*200+400)
            
                    //const floorDecoration1 = tileItemFactory.createTileItem('floorDecoration1')

                    //this.putTileItemInTile(floorDecoration1, tile)

                    //this.startRandomlyRotate(floorDecoration1, Math.random()*200+400)
                
            }
        }

        //const chair = tileItemFactory.createTileItem('chair1')
       //this.putTileItemInTile(chair, this.getTile(0, 0))

        //this.addTile(-1, 1)
        //this.addTile(-1, 2)

        for (let y = -1; y < sizeY; y++)
        {
            for (let x = -1; x < sizeX; x++)
            {
                if((x == -1 || y == -1) && !(x == -1 && y == -1))
                {
                    const tile = this.addTile(x, y)

                    const wall = tileItemFactory.createTileItem('wall1')

                    this.putTileItemInTile(wall, tile)

                    if(x == -1) this.setTileItemDirection(wall, TileItemDirection.FRONT_FLIPPED)
                }
            }
        }

        for (let y = -2; y < this._sideWalkSize; y++)
        {
            for (let x = -2; x < this._sideWalkSize; x++)
            {
                if((x == -2 || y == -2))
                {
                    const tile = this.addTile(x, y)

                    const floor = tileItemFactory.createTileItem('test_floor1')

                    this.putTileItemInTile(floor, tile)
                }
            }
        }

        //const scene = GameScene.getScene()

        //var rt = scene.add.renderTexture(0, 0, 800, 800);

        //scene.groundLayer.bat

        /*
        const floorDecoration1 = tileItemFactory.createTileItem('floorDecoration1')
        this.putTileItemInTile(floorDecoration1, this.getTile(0, 0))
        this.startRandomlyRotate(floorDecoration1, 700)

        const floorDecoration2 = tileItemFactory.createTileItem('floorDecoration2')
        this.putTileItemInTile(floorDecoration2, this.getTile(3, 6))
        this.startRandomlyRotate(floorDecoration2, 450)

        const floorDecoration3 = tileItemFactory.createTileItem('floorDecoration2')
        this.putTileItemInTile(floorDecoration3, this.getTile(4, 7))
        this.startRandomlyRotate(floorDecoration3, 450)

        this.putTileItemInTile(tileItemFactory.createTileItem('chair1'), this.getTile(3, 3))
        */
    }

    public getGame()
    {
        return this._game
    }

    private startRandomlyRotate(tileItem: TileItem, time: number)
    {
        let direction = 0
        
        setInterval(() => {

            const result = this.setTileItemDirection(tileItem, direction)
 
            if(!result)
            {
                new WorldText(GameScene.Instance, `Can't rotate!`, tileItem.getTile().getPosition(), 'red')
            }
            
            direction++
            if(direction >= 4) direction = 0

        }, time)
    }
}