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

    private _isEating: boolean = false


    constructor(world: World)
    {
        super(world)

        this._spriteTexture = 'PlayerSpriteTexture_TestClient'
        this._type = PlayerType.CLIENT

        this._waitForGameClient = world.type == WorldType.SERVER

        this.log(`created`)
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

            ///console.log(`attempt ${this._findChairAttempts}`)

            //attempt

            const result = this.tryFindAvaliableChair()

            if(result) {
                //console.log("yes, we found!")

                this.getWorld().events.emit(WorldEvent.PLAYER_CLIENT_SIT_CHAIR_DATA, this, this._goingToChair)
            } else {
                //console.log("no")
            }
            

            //no chair
            if(this._findChairAttempts >= PlayerClient.MAX_FIND_CHAIR_ATTEMPTS)
            {
                this._isWaitingForChair = false

                //console.log(`no chairs`)

                this.exitCafe()

                if(!result)
                {
                    this.getWorld().events.emit(WorldEvent.PLAYER_CLIENT_SIT_CHAIR_DATA, this, this._goingToChair)
                }
            }
        }
    }

    private onFinishEating()
    {
        const table = this.getChairPlayerIsSitting().getTableInFront()!

        table.clearDish()
        this._isEating = false

        //this.getChairPlayerIsSitting().setIsReserved(false)

        this.liftUpFromChair()
        this.exitCafe()
    }

    public warpToDoor()
    {
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
        const chair = this._goingToChair!

        this.sitAtChair(chair)
        this.setIsWaitingForWaiter(true)
    }

    public startClientBehavior()
    {
        //this.log(`startClientBehavior`)

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
        //this.log(`tryFindAvaliableChair`)

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
        //this.log(`exit cafe`)

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
}

/*
public isWaitingForWaiter()
    {
        return this._isWaitingForWaiter
    }

    public setIsWaitingForWaiter(value: boolean)
    {
        this._isWaitingForWaiter = value
    }

    private isWorldClient()
    {
        return this.getWorld().type == WorldType.CLIENT
    }

    private isWorldServer()
    {
        return this.getWorld().type == WorldType.SERVER
    }

    public startClientBehavior()
    {
        const door = this.getClosestDoor()
        const tile = door.getTile()

        if(!this.isWorldServer())
        {
            this.taskWalkToTile(tile.x, tile.y)

            this.taskExecuteAction(() =>
            {
                if(this.isWorldClient())
                {
                    this.getWorld().events.emit(WorldEvent.PLAYER_CLIENT_ARRIVED_DOOR, this)

                    //simulate cl callback
                    this.onArrivedDoor()
                } else {
                    this.onArrivedDoor()
                }
            })
        }

        if(this.isWorldServer())
        {
            this.setAtTile(tile.x, tile.y)

            //simulate sv callback
            this.onArrivedDoor()
        }
        
        

        //HudScene.Instance.addNotification("startClientBehavior")
    }

    public onArrivedDoor()
    {
        this.sitAtAnyChair()
    }

    private exitCafe()
    {
        const world = this.getWorld()
                
        const tile = Tile.getClosestTile(this.getPosition(), [world.getLeftSideWalkSpawn(), world.getRightSideWalkSpawn()])

        this.taskWalkToTile(tile.x, tile.y)
        this.taskExecuteAction(() => this.destroy())
    }

    public taskSitAtChair(chair: TileItemChair)
    {
        chair.setIsReserved(true)

        const tile = chair.getTile()

        this.taskWalkToTile(tile.x, tile.y)
        this.taskExecuteAction(() => {
            this.onArrivedChair()
        })

        this.getWorld().events.emit(WorldEvent.PLAYER_CLIENT_GO_TO_CHAIR, this, chair)
    }

    private sitAtAnyChair()
    {
        const chairs = this.getAvaliableChairs()

        if(chairs.length == 0)
        {
            this._findChairAttempts++

            if(this._findChairAttempts >= PlayerClient.MAX_FIND_CHAIR_ATTEMPTS)
            {
                //this.getWorld().events.emit('playerclient_exit_cafe', this)

                console.log("exiting cafe..")

                this.exitCafe()
                return
            }

            setTimeout(() => this.sitAtAnyChair(), 400)

            console.log("no chairs attemp")

            this.getWorld().events.emit('playerclient_find_avaliable_chair_fail', this)

            return
        }

        const chair = chairs[0]
        
        this._goingToChair = chair

        if(!this.isWorldServer())
        {
            this.taskSitAtChair(chair)
        }

        if(this.isWorldServer())
        {
            //simlate

            this.onArrivedChair()
        }
        
        

        /
        if(this.isWorldServer()) 
        {
            this.getTaskManager().clearTasks()

            //simulate
            this.onArrivedChair()
        }
        /
    }

    public onArrivedChair()
    {
        const chair = this._goingToChair!

        this.sitAtChair(chair)

        this.setIsWaitingForWaiter(true)

        //this.getWorld().events.emit(WorldEvent.PLAYER_CLIENT_SAT_ON_CHAIR, this)
    }

    private getClosestDoor()
    {
        const doors = this.getWorld().getDoors()

        const tile = Tile.getClosestTile(this.getPosition(), doors.map(door => door.getTile()))

        return tile.getDoor()
    }

    private getAvaliableChairs()
    {
        let chairs = this.getWorld().getChairs(true)

        return chairs
    }

    public update(delta: number)
    {
        super.update(delta)

        if(this.state == PlayerState.EATING)
        {
            this._eatingTimeElapsed += delta

            if(this._eatingTimeElapsed >= 3000)
            {
                this.getChairPlayerIsSitting().getTableInFront()!.clearDish()

                this.liftUpFromChair()
                this.exitCafe()
            }
        }

        if(this.state == PlayerState.SITTING)
        {
            const table = this.getChairPlayerIsSitting().getTableInFront()

            if(!table) return

            if(!table.isEmpty()) this.startEating()
        }
    }

    private startEating()
    {
        this.setState(PlayerState.EATING)

        console.log("started eating")
    }
*/