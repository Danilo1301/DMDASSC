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

            this.exitCafe()
            
            return
        }

        const chair = emptyChairs[Math.round(Math.random()*(emptyChairs.length-1))]
        chair.setReserved(true)

        const tile = chair.getTile()
        
        console.log("[Player] Walking to chair", chair.id)

        this.taskWalkToTile(tile)

        this.taskExecuteAction(() => {
            console.log("[Player] Sitting at chair")

            this.setAtChair(chair)
        })
    
    }

    public exitCafe()
    {
        const world = this.getWorld()

        if(this.isSitting) this.stopSitting()

        const exitTile = this.getWorld().getTile(0, 0)

        if(this.getAtTile() != exitTile) this.taskWalkToTile(exitTile)

        this.taskExecuteAction(() => {
            world.removePlayer(this)
        })
    }
}