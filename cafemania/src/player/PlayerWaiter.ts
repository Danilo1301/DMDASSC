import Dish from "@cafemania/dish/Dish";
import GameScene from "@cafemania/game/scene/GameScene";
import Tile from "@cafemania/tile/Tile";
import TileItemCounter from "@cafemania/tileItem/TileItemCounter";
import { TileItemType } from "@cafemania/tileItem/TileItemInfo";
import TileItemTable from "@cafemania/tileItem/TileItemTable";
import Utils from "@cafemania/utils/Utils";
import World from "@cafemania/world/World";
import Player from "./Player";

export default class PlayerWaiter extends Player
{
    private _lastCheckedTables: number = 0

    private _isBusy: boolean = false

    constructor(world: World)
    {
        super(world)

        this._isWaiter = true
    }

    public update(delta: number)
    {
        super.update(delta)

        this.processWaiterAI(delta)
    }

    public setIsBusy(value: boolean)
    {
        this._isBusy = value

        GameScene.getScene()?.drawWorldText(this._isBusy ? "Ocupado" : "Livre", this.getPosition(), this._isBusy ? "red" : "green")
    }

    private processWaiterAI(delta: number)
    {
        const now = new Date().getTime()

        if(now - this._lastCheckedTables >= 1250)
        {
            this._lastCheckedTables = now

            this.checkTables()
        }

        //console.log(delta)
    }

    private getAvaliableCounter(): TileItemCounter | undefined
    {
        const counters = <TileItemCounter[]> this.getWorld().getAllTileItemsOfType(TileItemType.COUNTER)

        const avaliableCounters = counters.filter(counter => !counter.isEmpty)

        if(avaliableCounters.length == 0) return

        return Utils.getRandomItemInArray(avaliableCounters)
    }

    private checkDeliverDish(table: TileItemTable)
    {
        if(table.hasDish) return

        if(!table.isWaitingForWaiter)
        {
            const counter = this.getAvaliableCounter()

            if(!counter)
            {
                GameScene.getScene()?.drawWorldText("All counters are empty", this.getPosition(), "red")
                return
            }

            table.setIsWaitingForWaiter(true)

            this.setIsBusy(true)

            GameScene.getScene()?.drawWorldText('get cloesest tile', this.getPosition())

            this.taskWalkToTile(
                Tile.getClosestTile(counter.getTile().getSurroundingTiles(), this.getPosition())
            )

            let dish: Dish | undefined

            this.taskExecuteAction(() => {
                dish = counter.getOneDish()

                GameScene.getScene()?.drawWorldText('getting dish', this.getPosition())

                if(!dish)
                {
                    GameScene.getScene()?.drawWorldText("we have a problem..", this.getPosition(), "red")
                    
                    this.setIsBusy(false)

                    return
                }

                const chair = table.getConnectedChair()!
    
                this.taskWalkToTile(
                    Tile.getClosestTile(chair.getTile().getSurroundingTiles(), this.getPosition())
                )

                this.taskExecuteAction(() => {
                    this.setIsBusy(false)

                    table.setIsWaitingForWaiter(false)

                    table.setDish(counter.getDish())
                })
            })
        }
    }

    

    private checkTables()
    {
        if(this._isBusy) return

        const tables = <TileItemTable[]> this.getWorld().getAllTileItemsOfType(TileItemType.TABLE)

        for (const table of tables)
        {
            if(this._isBusy) return
            
            const hasPlayer = table.getConnectedChair()?.getPlayerSitting() != undefined

            //check clear table

            if(!hasPlayer) continue

            this.checkDeliverDish(table)
        }
    }
}