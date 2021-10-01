import { Dish } from "@cafemania/dish/Dish";
import { DishPlate } from "@cafemania/dish/DishPlate";
import { TileItemCounter } from "@cafemania/tileItem/TileItemCounter";
import { Utils } from "@cafemania/utils/Utils";
import { World, WorldEvent, WorldType } from "@cafemania/world/World";
import { Player, PlayerType } from "./Player";
import { PlayerClient } from "./PlayerClient";

export class PlayerWaiter extends Player {

    private _isBusy: boolean = false

    private _servingPlayer?: PlayerClient
    private _servingDish?: Dish
    private _servingCounter?: TileItemCounter

    private _dishPlate?: DishPlate
    private _isCarryingDishPlate: boolean = false
    private _hasGotDish: boolean = false
    
    private _checkClientsTime: number = 0

    constructor(world: World) {
        super(world);

        this._spriteTexture = 'PlayerSpriteTexture_TestWaiter';
        this._type = PlayerType.WAITER;
    }

    public update(delta: number) {
        super.update(delta);

        this._checkClientsTime += delta;

        if(this._checkClientsTime >= 500 && !this._isBusy) {
            this._checkClientsTime = 0;
            this.checkClients_Serve();
        }
    }

    public render(delta: number) {
        super.render(delta);

        this.renderDishPlate();
    }

    private renderDishPlate() {
        const dish = this._servingDish;

        if(dish && this._isCarryingDishPlate) {
            if(!this._dishPlate) {
                this._dishPlate = new DishPlate(dish);
            }

            const h = 20;
            const position = this.getPosition().add(new Phaser.Math.Vector2(0, -h));
        
            this._dishPlate.setPosition(position.x, position.y);
            this._dishPlate.setDepth(position.y + h);
        } else {
            if(this._dishPlate) this.destroyDishPlate();
        }
    }

    private checkClients_Serve() {
        if(this.world.isWorldClient) return

        const client = this.getRandomPlayerWaitingForWaiter();
        const counter = this.getAnyAvaliableCounter();

        if(!client || !counter) return;

        client.setIsWaitingForWaiter(false);

        this.taskServeClient(client, counter);
    }

    public taskServeClient(client: PlayerClient, counter: TileItemCounter) {
        this._isBusy = true;

        this.log("serving client", client.id, client.serialize());
        const dish = counter.getDish();

        this._servingPlayer = client;
        this._servingDish = dish;
        this._servingCounter = counter;

        
        counter.addWaiterComing();

        if(this.world.isWorldServer) {
            //counter.removeOneDish()
            this.world.events.emit(WorldEvent.PLAYER_WAITER_SERVE_CLIENT, this, client, counter);
            return;
        }

        


        this.taskWalkNearToTile(counter.tile);
        this.taskExecuteAction(() => {
            //this.setCarryingDish(dish)

            this._isCarryingDishPlate = true;

            this.onGetDish();
        });

        this.taskWalkNearToTile(client.getChairPlayerIsSitting().getTableInFront()!.tile)
        this.taskExecuteAction(() =>
        {
            //this.world.events.emit(WorldEvent.PLAYER_WAITER_FINISHED_SERVE, this)

            counter.removeWaiterComing()

            this.finishServing()

            this.destroyDishPlate()

            this._isCarryingDishPlate = false

            
        })
    }
    
    public onGetDish()
    {
        const counter = this._servingCounter!

        this._hasGotDish = true

        counter.removeWaiterComing()

        if(!this.world.isWorldClient) counter.removeOneDish()

        counter.setAsUpdated()

        console.log(counter['_data'])

        if(this.world.isWorldClient)
        {
            this.world.events.emit(WorldEvent.PLAYER_WAITER_REACHED_COUNTER, this)
        }
    }

    public finishServing()
    {
        const client = this._servingPlayer!
        const dish = this._servingDish!
        const counter = this._servingCounter!

        const table = client.getChairPlayerIsSitting().getTableInFront()

        table!.setDish(dish)

        this._isBusy = false

        if(this.world.isWorldServer)
        {
            //unlikely to happen
            if(!this._hasGotDish)
            {
                console.log("_hasGotDish was false?")

                counter.removeWaiterComing();
                counter.removeOneDish();
                counter.setAsUpdated();
            }
        }

        this._hasGotDish = false
        this._servingPlayer = undefined
        this._servingDish = undefined
        this._servingCounter = counter
        
        if(this.world.isWorldClient) this.world.events.emit(WorldEvent.PLAYER_WAITER_FINISH_SERVE, this);

        this.log("finished serving")
    }

    private getRandomPlayerWaitingForWaiter() {
        const players = this.world.getPlayerClients();

        for (const player of players) {
            if(player.isWaitingForWaiter) return player;
        }

        return;
    }

    public getAnyAvaliableCounter() {
        const counters = this.world.getCounters().filter(counter => {
            if(counter.isEmpty()) return false

            const servings = counter.getDishAmount() - counter.getAmountOfWaitersComing()

            if(servings <= 0) return false

            return true
        })

        if(counters.length == 0) return

        return Utils.shuffleArray(counters)[0]
    }

    public destroy() {
        super.destroy();

        this.destroyDishPlate();
    }

    private destroyDishPlate() {
        this._dishPlate?.destroy();
        this._dishPlate = undefined;
    }
}
