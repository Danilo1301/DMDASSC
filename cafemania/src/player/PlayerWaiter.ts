import GameScene from "@cafemania/game/scene/GameScene";
import Tile from "@cafemania/tile/Tile";
import TileItemCounter from "@cafemania/tileItem/TileItemCounter";
import { TileItemType } from "@cafemania/tileItem/TileItemInfo";
import TileItemTable from "@cafemania/tileItem/TileItemTable";
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

    private processWaiterAI(delta: number)
    {
        this.checkTables()

        const now = new Date().getTime()

        if(now - this._lastCheckedTables >= 1250)
        {
            this._lastCheckedTables = now

            this.checkTables()
        }

        //console.log(delta)
    }

    private getCountersNotEmpty()
    {
        const counters = <TileItemCounter[]> this.getWorld().getAllTileItemsOfType(TileItemType.COUNTER)

        return counters.filter(counter => !counter.isEmpty)
    }

    private checkTables()
    {
        if(this._isBusy) return

        const tables = <TileItemTable[]> this.getWorld().getAllTileItemsOfType(TileItemType.TABLE)

        for (const table of tables)
        {
            if(!table.hasDish() && table)
            {
                let hasPlayer = false

                const chair = table.getConnectedChair()

                if(chair?.getIsOcuppied())
                {
                    hasPlayer = true
                }

                if(hasPlayer)
                {
                    if(!table.getIsWaitingForWaiter())
                    {
                        table.setIsWaitingForWaiter(true)

            
                        const counters = this.getCountersNotEmpty()

                        if(counters.length == 0)
                        {
                            GameScene.getScene()?.drawWorldText("All counters are empty", this.getPosition(), "red")
                            return
                        }

                        this._isBusy = true
                        
                        this.taskWalkToTile(
                            Tile.getClosestTile(counters[0].getTile().getSurroundingTiles(), this.getPosition())
                        )

                        this.taskExecuteAction(() => {
                            this.taskWalkToTile(
                                Tile.getClosestTile(chair!.getTile().getSurroundingTiles(), this.getPosition())
                            )

                            this.taskExecuteAction(() => {
                                this._isBusy = false

                                table.setIsWaitingForWaiter(false)

                                table.setDish(counters[0].getDish())
                            })

                            
                        })

                        
                        
                        return
                    }

                    
                }
            }

            
        }
    }
}