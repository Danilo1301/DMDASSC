
import { GameScene } from "@cafemania/scenes/GameScene"
import { Tile } from "@cafemania/tile/Tile"
import { TileItem } from "@cafemania/tileItem/TileItem"
import { TileItemPlaceType, TileItemType } from "@cafemania/tileItem/TileItemInfo"
import { TileItemWall } from "@cafemania/tileItem/TileItemWall"
import PathFind from "@cafemania/utils/PathFind"
import { Player } from "./Player"

import { Task } from "./TaskManager"

export class TaskWalkToTile extends Task
{
    private player: Player
    private tileX: number
    private tileY: number
    private dontEnterTile: boolean

    constructor(player: Player, x: number, y: number, dontEnterTile?: boolean)
    {
        super()

        this.player = player
        this.tileX = x
        this.tileY = y
        this.dontEnterTile = dontEnterTile || false
    }

    public onStart()
    {



        const world = this.player.getWorld()
        const pathFind = new PathFind()

        const grid = world.getGrid()

        const checkTileItem = (tile: Tile, tileItem: TileItem) =>
        {
            const info = tileItem.getInfo()
            const type = info.type
            const placeType = info.placeType

            if(placeType == TileItemPlaceType.FLOOR && type != TileItemType.FLOOR) return false

            return true
        }

        

        grid.getCells().map(cell =>
        {
            let canWalk = true

            const tile = world.getTile(cell.x, cell.y)

            let hasWallWithDoor = false

            for (const item of cell.ocuppiedByItems)
            {
                const tileItem = world.getTile(item.getOriginCell().x, item.getOriginCell().y).getTileItem(item.id)!
                
                const result = checkTileItem(tile, tileItem)

                if(result === false) canWalk = false

                //

                
                if(tileItem.getInfo().type == TileItemType.WALL)
                {
                    const wall = tileItem as TileItemWall

                    //console.log("itza wallru", wall.getDoorInFront())

                    if(wall.getDoorInFront() != undefined) hasWallWithDoor = true
                }

            }

            const isEndTile = (tile.x == this.tileX && tile.y == this.tileY)
            const hasDoor = tile.hasDoor()

            if(isEndTile) canWalk = true
            if(hasDoor) canWalk = true

            if(hasWallWithDoor) canWalk = true

            pathFind.add(cell.x, cell.y, canWalk)
        })

        const atTile = this.player.getAtTile()

        pathFind.setStart(atTile?.x || 0, atTile?.y || 0)
        pathFind.setEnd(this.tileX, this.tileY)
        pathFind.find(async (path) =>
        {
            if(path.length == 0) return
            path.splice(0, 1)

            const tasks: Task[] = []

            for (const p of path)
            {
                const isEndTile =  (p.x == this.tileX && p.y == this.tileY)

                if(isEndTile && this.dontEnterTile) continue
       
                const task = new TaskWalkToSingleTile(this.player, world.getTile(p.x, p.y), !isEndTile)
                tasks.push(task)
            } 

            tasks.reverse().map(task => this.player.getTaskManager().addTaskAt(task, 1))
        })

        this.completeTask()
    }
}

export class TaskWalkToSingleTile extends Task
{
    private player: Player
    private tile: Tile
    private keepMoving: boolean

    constructor(player: Player, tile: Tile, keepMoving: boolean)
    {
        super()

        this.player = player
        this.tile = tile
        this.keepMoving = keepMoving
    }

    public onStart()
    {
        this.player.moveToTile(this.tile.x, this.tile.y, () => {


            //GameScene.Instance.drawWorldText("ok", this.player.getPosition())
            //if(this.keepMoving) this.player.setIsWalking(true)

            this.completeTask()
        })
    }
}

export class TaskPlayAnim extends Task
{
    private player: Player
    private anim: string
    private time: number

    constructor(player: Player, anim: string, time: number)
    {
        super()

        this.player = player
        this.anim = anim
        this.time = time
    }

    public onStart()
    {
        //this.player.getAnimationManager().play(this.anim, false)

        if(this.time <= 0)
        {
            this.completeTask()

            return
        }

        setTimeout(() => {
            this.completeTask()
        }, this.time);
    }
}