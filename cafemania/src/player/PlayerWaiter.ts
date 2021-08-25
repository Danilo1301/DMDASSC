import Dish from "@cafemania/dish/Dish";
import DishPlate from "@cafemania/dish/DishPlate";
import { Tile } from "@cafemania/tile/Tile";
import { TileItem } from "@cafemania/tileItem/TileItem";
import { TileItemCounter } from "@cafemania/tileItem/TileItemCounter";
import { Utils } from "@cafemania/utils/Utils";
import { World, WorldEvent, WorldType } from "@cafemania/world/World";
import { WorldServer } from "@cafemania/world/WorldServer";
import { Player, PlayerType } from "./Player";
import { PlayerClient } from "./PlayerClient";

export class PlayerWaiter extends Player
{
    private _isBusy: boolean = false

    private _servingPlayer?: PlayerClient
    private _servingDish?: Dish
    private _servingCounter?: TileItemCounter

    private _checkClientsTime: number = 0

    private _isCarryingDishPlate: boolean = false

    private _dishPlate?: DishPlate

    public isWorldClient()
    {
        return this.getWorld().type == WorldType.CLIENT
    }

    public isWorldServer()
    {
        return this.getWorld().type == WorldType.SERVER
    }

    constructor(world: World)
    {
        super(world)

        this._spriteTexture = 'PlayerSpriteTexture_TestWaiter'
        this._type = PlayerType.WAITER
    }

    public update(delta: number)
    {
        super.update(delta)

        this._checkClientsTime += delta

        if(this._checkClientsTime >= 500 && !this._isBusy)
        {
            this._checkClientsTime = 0

            this.checkClients_Serve()
        }
    }

    public render(delta: number)
    {
        super.render(delta)

        this.renderDishPlate()
    }

    private renderDishPlate()
    {
        const dish = this._servingDish

        if(dish && this._isCarryingDishPlate)
        {
            if(!this._dishPlate)
            {
                this._dishPlate = new DishPlate(dish)
            }

            const h = 20
            const position = this.getPosition().add(new Phaser.Math.Vector2(0, -h))
        
            this._dishPlate.setPosition(position.x, position.y) 
            this._dishPlate.setDepth(position.y + h)
        } else {
            if(this._dishPlate)
            {
                this.destroyDishPlate()
            }
        }
    }

    private checkClients_Serve()
    {
        if(this.isWorldClient()) return

        const client = this.getRandomPlayerWaitingForWaiter()
        const counter = this.getAnyAvaliableCounter()

        if(!client || !counter) return

        client.setIsWaitingForWaiter(false)

        this.taskServeClient(client, counter)
    }

    public taskServeClient(client: PlayerClient, counter: TileItemCounter)
    {
        this._isBusy = true

        this.log("serving client")
        const dish = counter.getDish()

        this._servingPlayer = client
        this._servingDish = dish
        this._servingCounter = counter

        
        if(this.isWorldServer())
        {
            counter.removeOneDish()

            this.getWorld().events.emit(WorldEvent.PLAYER_WAITER_SERVE_CLIENT, this, client, counter)

            return
        }

        counter.addWaiterComing()


        this.taskWalkNearToTile(counter.getTile())
        this.taskExecuteAction(() => {
            //this.setCarryingDish(dish)

            this._isCarryingDishPlate = true

            counter.removeOneDish()
        })

        this.taskWalkNearToTile(client.getChairPlayerIsSitting().getTile())
        this.taskExecuteAction(() =>
        {
            //this.getWorld().events.emit(WorldEvent.PLAYER_WAITER_FINISHED_SERVE, this)

            counter.removeWaiterComing()

            this.finishServing()

            this.destroyDishPlate()

            this._isCarryingDishPlate = false

            
        })
    }
    
    public finishServing()
    {
        const client = this._servingPlayer!
        const dish = this._servingDish!
        const counter = this._servingCounter!

        const table = client.getChairPlayerIsSitting().getTableInFront()

        table!.setDish(dish)

        this._isBusy = false

        if(this.isWorldServer())
        {
            //counter.setAsUpdated()
        }

        this._servingPlayer = undefined
        this._servingDish = undefined
        this._servingCounter = counter
        
        if(this.isWorldClient())
        {
            this.getWorld().events.emit(WorldEvent.PLAYER_WAITER_FINISH_SERVE, this)
        }

        

        this.log("finished serving")
    }

    private getRandomPlayerWaitingForWaiter()
    {
        const world = this.getWorld()
        const players = this.getWorld().getPlayerClients()

        for (const player of players)
        {
            if(player.isWaitingForWaiter())
            {
                return player
            }
        }

        return
    }

    public getAnyAvaliableCounter()
    {
        const counters = this.getWorld().getCounters().filter(counter => {
            if(counter.isEmpty()) return false

            const servings = counter.getDishAmount() - counter.getAmountOfWaitersComing()

            if(servings <= 0) return false

            return true
        })

        if(counters.length == 0) return

        return Utils.shuffleArray(counters)[0]
    }

    public destroy()
    {
        super.destroy()

        this.destroyDishPlate()
    }

    private destroyDishPlate()
    {
        this._dishPlate?.destroy()
        this._dishPlate = undefined
    }
}

/*
//make this protected
    private isWorldClient()
    {
        return this.getWorld().type == WorldType.CLIENT
    }

    private isWorldServer()
    {
        return this.getWorld().type == WorldType.SERVER
    }

    public setCarryingDish(dish?: Dish)
    {
        this._carryingDish = dish
    }

    public setDisable(value: boolean)
    {
        this._disabled = value
    }

    public setIsBusy(value: boolean)
    {
        this._busy = value
    }

    public render(delta: number)
    {
        super.render(delta)

        if(this._carryingDish)
        {
            if(!this._carryingDishPlate)
            {
                

                this._carryingDishPlate = new DishPlate(this._carryingDish)
                
            }

            const h = 20
            const position = this.getPosition().add(new Phaser.Math.Vector2(0, -h))
            

            this._carryingDishPlate.setPosition(position.x, position.y) 
            this._carryingDishPlate.setDepth(position.y + h)
        }
        else
        {
            if(this._carryingDishPlate)
            {
                this._carryingDishPlate.destroy()
                this._carryingDishPlate = undefined
            }
        }
    }

    public update(delta: number)
    {
        super.update(delta)

        if(this._disabled) return

        if(this._busy) return
        
        const world = this.getWorld()

        const players = this.getWorld().getPlayerClients()

        for (const player of players)
        {
            if(player.isWaitingForWaiter())
            {
                const counter = this.getAnyAvaliableCounter()

                if(counter)
                {
                    this.taskBeginServe(player, counter)
                    
                    this.getWorld().events.emit(WorldEvent.PLAYER_WAITER_BEGIN_SERVE, this, player, counter)
                }

                return
            }
        }
        
    }
    
    public getAnyAvaliableCounter()
    {
        const counters = this.getWorld().getCounters().filter(counter => {
            if(counter.isEmpty()) return false

            const servings = counter.getDishAmount() - counter.getAmountOfWaitersComing()

            if(servings <= 0) return false

            return true
        })

        if(counters.length == 0) return

        return Utils.shuffleArray(counters)[0]
    }

    public taskBeginServe(client: PlayerClient, counter: TileItemCounter)
    {
        client.setIsWaitingForWaiter(false)

        this.setIsBusy(true)

        const dish = counter.getDish()

        counter.addWaiterComing()

        this.taskWalkNearToTile(counter.getTile())

        this.taskExecuteAction(() => {

            this.setCarryingDish(dish)
            counter.removeOneDish()

        })

        this.taskWalkNearToTile(client.getChairPlayerIsSitting().getTile())

        this.taskExecuteAction(() =>
        {
            this.getWorld().events.emit(WorldEvent.PLAYER_WAITER_FINISHED_SERVE, this)

            this.setCarryingDish(undefined)

            const table = client.getChairPlayerIsSitting().getTableInFront()

            table!.setDish(dish)

            this.setIsBusy(false)

            counter.removeWaiterComing()
        })


        if(this.isWorldServer())
        {
            this.getTaskManager().clearTasks()

            console.log(`Send to client `)

            console.log("heh")
        }
    }
*/