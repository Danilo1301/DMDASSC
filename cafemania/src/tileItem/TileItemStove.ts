import { Dish } from "@cafemania/dish/Dish";
import { DishPlate, DishPlateState } from "@cafemania/dish/DishPlate";
import { GameScene } from "@cafemania/scenes/GameScene";
import { WorldEvent, WorldType } from "@cafemania/world/World";
import { TileItem } from "./TileItem";
import { TileItemCounter } from "./TileItemCounter";
import { TileItemInfo } from "./TileItemInfo";

export class StoveData
{
    public cookingDish?: string;
    public startedAt: number = -1;

    public serialize() {
        return {
            cookingDish: this.cookingDish,
            startedAt: this.startedAt
        };
    }
}

export class TileItemStove extends TileItem
{
    private _data = new StoveData();

    private _dishPlate?: DishPlate;

    private _prevDishReadyState: boolean = false;

    private _wasCooking: boolean = false;

    constructor(tileItemInfo: TileItemInfo)
    {
        super(tileItemInfo);

        this.events.on("pointerup", () => {
            this.startCookingSomething();
        })
    }

    public get isCooking() { return this._data.cookingDish != undefined }
    public get isDishReady() { return this.getCookingPercentage() >= 1; }

    public startCookingSomething() {
        const serveDish1 = this.world.getStoves()[0] == this;

        if(this.isCooking) return;

        GameScene.Instance?.sound.play('begin_cook');

        const dishFactory = this.tile.world.game.dishFactory;
        const food = dishFactory.getDish(serveDish1 ? "dish1" : "dish2");

        this.startCook(food);

        GameScene.Instance?.drawWorldText(`Started cooking '${food.name}'`, this.getPosition());
    }

    private sendDishToCounter() {
        const counters = this.getAvaliableCounters();

        if(counters.length == 0) return false;

        const counter = counters[0];
        counter.addDish(this.getCookingDish());
        counter.setAsUpdated();

        return true;
    }

    public startCook(dish: Dish) {
        this._data.cookingDish = dish.id;
        this._data.startedAt = new Date().getTime();

        this.world.events.emit(WorldEvent.TILE_ITEM_STOVE_BEGIN_COOK, this, dish);
        this.setAsUpdated();

        this._wasCooking = true;
    }

    public getCookingDish() {
        return this.world.game.dishFactory.getDish(this._data.cookingDish!);
    }

    public clearDish() {
        this._data.cookingDish = undefined;
        this._data.startedAt = -1;
    }

    private onDishReady() {
        GameScene.Instance?.drawWorldText(`Dish is ready`, this.getPosition(), 0x00ff00);
        GameScene.Instance?.sound.play('dish_ready');

        if(this.world.type != WorldType.CLIENT)
            this.sendDishToCounter();

        this.clearDish();
        this.setAsUpdated();
    }

    public update(delta: number) {
        super.update(delta);

        if(this.world.isWorldServer || this.world.type == WorldType.DEFAULT) {
            if(this.isCooking) {
                if(this._prevDishReadyState != this.isDishReady){
                    this._prevDishReadyState = this.isDishReady;
        
                    if(this.isDishReady) this.onDishReady();
                }
            }
        }
        

        if(this.world.isWorldClient) {
            if(!this.isCooking && this._wasCooking) {
                this.onDishReady();
                this._wasCooking = false;
            }
        }
        
    }

    public render(delta: number) {
        super.render(delta);

        this.renderDishPlate();
    }

    private renderDishPlate() {
        if(this.isCooking) {
            if(!this._dishPlate) {
                const h = 20;
                const position = this.getPosition().add(new Phaser.Math.Vector2(0, -h));

                this._dishPlate = new DishPlate(this.getCookingDish());
                this._dishPlate.setPosition(position.x, position.y) ;
                this._dishPlate.setDepth(position.y + h);
                this._dishPlate.setState(DishPlateState.COOKING);
            }
            this._dishPlate.setPercentage(this.getCookingPercentage());
        } else {
            if(this._dishPlate) {
                this._dishPlate.destroy()
                this._dishPlate = undefined
            }
        }
    }

    public getCookingPercentage() {
        const now = Date.now();
        const delta = now - this._data.startedAt;
        return delta / this.getCookingDish().cookTime;
    }

    private getAvaliableCounters() {
        let countersSameDish: TileItemCounter[] = [];
        let counters = this.world.getCounters();

        counters = counters.filter(counter => {
            if(counter.isEmpty()) return true;

            if(counter.getDish().id == this.getCookingDish().id) {
                countersSameDish.push(counter);
                return true;
            }

            return false;
        })

        if(countersSameDish.length > 0) return countersSameDish;
        return counters;
    }

    public setData(data: StoveData) {
        this._data.cookingDish = data.cookingDish
        this._data.startedAt = data.startedAt
    }

    public serialize() {
        let json = super.serialize();
        json = Object.assign(json, {
            data: this._data.serialize()
        })
        return json
    }
}