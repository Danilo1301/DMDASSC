import Tile from "@cafemania/tile/Tile"
import PathFind from "@cafemania/utils/PathFind"
import Player from "./Player"
import { Task } from "./TaskManager"

export class TaskWalkToTile extends Task
{
    private player: Player
    private tile: Tile
    private dontEnterTile: boolean

    constructor(player: Player, tile: Tile, dontEnterTile?: boolean)
    {
        super()

        this.player = player
        this.tile = tile
        this.dontEnterTile = dontEnterTile || false
    }

    public onStart()
    {
        const world = this.player.getWorld()
        const pathFind = new PathFind()
        const ocuppiedMap = world.getOccupiedTilesMap()

        for (const tile of world.getTiles())
        {
            let canWalk = !ocuppiedMap[`${tile.x}:${tile.y}`]

            if(tile.x == this.tile.x && tile.y == this.tile.y) canWalk = true

            pathFind.add(tile.x, tile.y, canWalk)
        }

        //console.log(this.player.getAtTile())

        const atX = this.player.getAtTile().x || 0
        const atY = this.player.getAtTile().y || 0

        //console.log(`${atX},${atY} to ${this.tile.x},${this.tile.y}`)

        pathFind.setStart(atX, atY)
        pathFind.setEnd(this.tile.x, this.tile.y)
        pathFind.find(async (path) => {
            if(path.length == 0) return

            path.splice(0, 1)

            const tasks: Task[] = []

            for (const p of path)
            {
                const isEndTile =  (p.x == this.tile.x && p.y == this.tile.y)

                if(isEndTile && this.dontEnterTile) continue
       
                const task = new TaskWalkToSingleTile(this.player, world.getTile(p.x, p.y), !isEndTile)

                tasks.push(task)
            } 

            tasks.reverse().map(task => this.player.getTaskManager().addTaskAt(task, 1))

            this.player.taskExecuteAction(() => {
                //this.player.setAtTile(world.getTile(this.tile.x, this.tile.y))
            })
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

            if(this.keepMoving) this.player.setIsWalking(true)

            this.completeTask()
        })
    }
}
