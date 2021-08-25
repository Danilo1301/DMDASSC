import { GameScene } from "@cafemania/scenes/GameScene";
import { Tile } from "@cafemania/tile/Tile";
import { TileItemChair } from "@cafemania/tileItem/TileItemChair";
import { TileItemDoor } from "@cafemania/tileItem/TileItemDoor";
import { World, WorldEvent, WorldType } from "@cafemania/world/World";
import { Player, PlayerState, PlayerType } from "./Player";

export class PlayerClient extends Player
{
    private static MAX_FIND_CHAIR_ATTEMPTS = 5
    private _findChairAttempts: number = 0 
    private _attemptTime: number = 0

    private _goingToChair?: TileItemChair
    private _goingToDoor?: TileItemDoor

    private _isWaitingForWaiter: boolean = false

    private _eatingTimeElapsed: number = 0

    private _isWaitingForChair: boolean = false

    private _waitForGameClient: boolean = false

    private _exitingCafe: boolean = false

    private _hasStartedEating: boolean = false

    constructor(world: World)
    {
        super(world)

        this._spriteTexture = 'PlayerSpriteTexture_TestClient'
        this._type = PlayerType.CLIENT

        this._waitForGameClient = world.type == WorldType.SERVER
    }

    public isExitingCafe()
    {
        return this._exitingCafe
    }

    public hasStartedEating()
    {
        return this._hasStartedEating
    }

    public isWorldServer()
    {
        return this.getWorld().type == WorldType.SERVER
    }

    public isWorldClient()
    {
        return this.getWorld().type == WorldType.CLIENT
    }

    public isWaitingForWaiter()
    {
        return this._isWaitingForWaiter
    }

    public render(delta: number)
    {
        super.render(delta)
    }

    public update(delta: number)
    {
        super.update(delta)


        //at door
        if(this._isWaitingForChair)
        {
            
            //no chair
            if(!this._goingToChair) {

                if(this.isWorldServer())
                {
                    this.processAttempts(delta)
                }

                return
            }

            //yes chair

            this._isWaitingForChair = false

            if(!this._waitForGameClient)
            {
                //go to chair
                this.taskWalkToChair()
            }
        }

        if(this._goingToChair && this.isSitting())
        {
            this._goingToChair = undefined

            if(this.isWorldClient())
            {
                this.log("reached chair locally", WorldEvent.PLAYER_CLIENT_REACHED_CHAIR)
                this.getWorld().events.emit(WorldEvent.PLAYER_CLIENT_REACHED_CHAIR, this)
            }
        }

        if(this.isSitting() && !this.isEating())
        {
            const table = this.getChairPlayerIsSitting().getTableInFront()

            if(table)
            {
                if(!table.isEmpty())
                {
                    this._hasStartedEating = true

                    this.setState(PlayerState.EATING)
                }
            }
        }

        if(this.isEating())
        {
            this._eatingTimeElapsed += delta

            if(this._eatingTimeElapsed >= 11000)
            {
                this.onFinishEating()
            }
        }
    }

    private processAttempts(delta: number)
    {
        this._attemptTime += delta

        if(this._attemptTime >= 300)
        {
            this._attemptTime = 0

            this._findChairAttempts++

            if(this._findChairAttempts >= PlayerClient.MAX_FIND_CHAIR_ATTEMPTS)
            {
                this.log("no more attempts")


                //DONT CHANGE THE ORDER AGAIN!!
                
                this.getWorld().events.emit(WorldEvent.PLAYER_CLIENT_SIT_CHAIR_DATA, this, undefined) //tells client to exit cafe
                this.exitCafe()
                return
            }
          
            const result = this.tryFindAvaliableChair()

            if(result)
            {
                this.log("attempt success")

                this.getWorld().events.emit(WorldEvent.PLAYER_CLIENT_SIT_CHAIR_DATA, this, this._goingToChair) //tells client to go to chair
                
                return
            }
            
            this.log("attempt failed")
        }
    }

    private onFinishEating()
    {
        this.log(`finish eating`)

        const table = this.getChairPlayerIsSitting().getTableInFront()!

        table.clearDish()


        //this.getChairPlayerIsSitting().setIsReserved(false)

        this.liftUpFromChair()
        this.exitCafe()
    }

    public warpToDoor()
    {
        this.log(`Warped to door`)

        const door = this._goingToDoor!
        const tile = door.getTile()

        this.setAtTile(tile.x, tile.y)

        this._isWaitingForChair = true
    }

    public taskWalkToChair()
    {
        const chair = this._goingToChair!
        const tile = chair.getTile()

        this.taskWalkToTile(tile.x, tile.y)
        this.taskExecuteAction(() => {
            this.warpToChair()
        })
    }

    public warpToChair()
    {
        this.log(`Warped to chair`)
        
        const chair = this._goingToChair!

        this.sitAtChair(chair)
        this.setIsWaitingForWaiter(true)

        
    }

    public startClientBehavior()
    {
        this.log(`Started client behaviour`)

        this._goingToDoor = this.getClosestDoor()

        if(!this.isWorldClient()) {
            const result = this.tryFindAvaliableChair()

            if(result)
            {
                this.getWorld().events.emit(WorldEvent.PLAYER_CLIENT_SIT_CHAIR_DATA, this, this._goingToChair)
            }
        }

        if(this._waitForGameClient)
        {
            
        } else {
            this.log(`Walking to door`)

            this.taskWalkToDoor()
        }
    }

    //add for player later
    private emitWorldEvent()
    {

    }

    public taskWalkToDoor()
    {
        const door = this._goingToDoor!
        const tile = door.getTile()

        this.taskWalkToTile(tile.x, tile.y)
        this.taskExecuteAction(() => {
            
            if(this.isWorldClient())
            {
                this.getWorld().events.emit(WorldEvent.PLAYER_CLIENT_REACHED_DOOR, this)
            }

            this.warpToDoor()

        })
    }

    public tryFindAvaliableChair()
    {
        this.log(`Try find chair`)

        const chairs = this.getWorld().getChairs(true)

        if(chairs.length == 0) return false

        const chair = chairs[0]
        chair.setIsReserved(true)

        this.setGoingToChair(chair)

        return true
    }

    public setIsWaitingForWaiter(value: boolean)
    {
        this._isWaitingForWaiter = value
    }

    public setGoingToChair(chair: TileItemChair)
    {
        this.log(`Setted going to chair`)

        this._goingToChair = chair
    }
    
    private getClosestDoor()
    {
        const doors = this.getWorld().getDoors()
        const tile = Tile.getClosestTile(this.getPosition(), doors.map(door => door.getTile()))

        return tile.getDoor()
    }

    public exitCafe()
    {
        this._exitingCafe = true

        this.log(`Exit cafe`)

        this.getWorld().events.emit(WorldEvent.PLAYER_CLIENT_EXITED_CAFE, this)

        if(this.isWorldServer())
        {
            this.destroy()
            return
        }

        const world = this.getWorld()
                
        const tile = Tile.getClosestTile(this.getPosition(), [world.getLeftSideWalkSpawn(), world.getRightSideWalkSpawn()])

        this.taskWalkToTile(tile.x, tile.y)
        this.taskExecuteAction(() => this.destroy())
    }

    public destroy()
    {
        super.destroy()

        this.log(`Destroy`)

        this.getWorld().events.emit(WorldEvent.PLAYER_CLIENT_DESTROYED, this)
    }
}