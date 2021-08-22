
import { GameScene } from "@cafemania/scenes/GameScene"
import { Tile } from "@cafemania/tile/Tile"
import { TileItem } from "@cafemania/tileItem/TileItem"
import { TileItemPlaceType, TileItemType } from "@cafemania/tileItem/TileItemInfo"
import { TileItemWall } from "@cafemania/tileItem/TileItemWall"
import PathFind from "@cafemania/utils/PathFind"
import { Player } from "./Player"

import { Task } from "./PlayerTaskManager"

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
            const tile = world.getTile(cell.x, cell.y)

            let isWalkable = tile.isWalkable()
       
            if(tile.x == this.tileX && tile.y == this.tileY) isWalkable = true

            pathFind.add(cell.x, cell.y, isWalkable)
        })

        const atTile = this.player.getAtTile()

        pathFind.find(atTile.x, atTile.y, this.tileX, this.tileY, async (path) =>
        {
            if(path.length == 0) return
            path.splice(0, 1)

            const tasks: Task[] = []

            for (const p of path)
            {
                const isEndTile =  (p.x == this.tileX && p.y == this.tileY)

                if(isEndTile && this.dontEnterTile) continue
       
                //const task = new TaskWalkToSingleTile(this.player, world.getTile(p.x, p.y), !isEndTile)
                const task = new TaskWalkToSingleTile(this.player, world.getTile(p.x, p.y))
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

    constructor(player: Player, tile: Tile)
    {
        super()

        this.player = player
        this.tile = tile
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