import GameScene from "@cafemania/game/scene/GameScene";
import World from "@cafemania/world/World";
import Player from "./Player";

export default class PlayerClient extends Player
{
    constructor(world: World)
    {
        super(world)

        this._isClient = true
    }
    
    public startClientBehaviour()
    {
        const world = this.getWorld()

        const emptyChairs = world.findEmptyChairs()

        if(emptyChairs.length == 0)
        {
            GameScene.getScene()?.drawWorldText("No empty chairs!", this.getPosition(), "red")

            world.removePlayer(this)
            return
        }

        const chair = emptyChairs[Math.round(Math.random()*(emptyChairs.length-1))]
        chair.setReserved(true)

        const tile = chair.getTile()
        
        console.log("[Player] Walking to chair")

        this.taskWalkToTile(tile)

        this.taskExecuteAction(() => {
            console.log("[Player] Sitting at chair")

            this.sitAtChair(chair)

            const table = chair.getTableInFront()

            //table!.events.once("finished_eating", () => {
                //this.taskWalkToTile(world.getTile(0, 0))
            //})
        })

        console.log("[Player] Going to chair", chair.id)

        /*
        player.taskExecuteAction(() => {
            console.log("[Player] Sitting at chair")

            player.sitAtChair(chair)
            player.setAtTile(tile)
        })
        */
    }
}