
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

    public start()
    {
        super.start()

        const world = this.player.world
        const pathFind = new PathFind()

        this.player.setFinalTargetTile(world.getTile(this.tileX, this.tileY))

        const grid = world.grid;

        grid.getCells().map(cell =>
        {
            const tile = world.getTile(cell.x, cell.y)

            let isWalkable = tile.isWalkable;
       
            if(tile.x == this.tileX && tile.y == this.tileY) isWalkable = true

            pathFind.add(cell.x, cell.y, isWalkable)
        })

        const atTile = this.player.getAtTile()

        pathFind.find(atTile.x, atTile.y, this.tileX, this.tileY, async (path) =>
        {
            if(path.length == 0) return

            let totalDistance = 0

            for (let i = 0; i < path.length-1; i++)
            {
                const from = path[i]
                const to = path[i + 1]

                const fromTile = world.getTile(from.x, from.y)
                const toTile = world.getTile(to.x, to.y)

                totalDistance += Phaser.Math.Distance.BetweenPoints(fromTile.getPosition(), toTile.getPosition())
            }

            const aproxTimePerDistance = 11147 / 973.5742752749559
            const perSpeed = aproxTimePerDistance / 1.8

            //const aproxTime = totalDistance / perSpeed * this.player.speed
            //const aproxTime = totalDistance * perSpeed * this.player.speed
            const aproxTime = 0

            this.events.emit("time", aproxTime)

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

            tasks.map((task, index) => this.player.taskManager.addTaskAt(task, 0 + index))
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

    public start()
    {
        super.start()

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

    public start()
    {
        super.start()
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