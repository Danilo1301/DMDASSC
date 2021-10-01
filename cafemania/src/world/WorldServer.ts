import { Client } from "@cafemania/client/Client";
import { GameServer } from "@cafemania/game/GameServer";
import { IPacketClientFindChairData, IPacketClientReachedDoorData, IPacketData_PlayerId, IPacketSpawnClientData, IPacketStoveBeginCookData, IPacketTileItemIdData, IPacketWaiterFinishServeData, IPacketWaiterReachCounterData, IPacketWaiterServeClientData } from "@cafemania/network/Packet";
import { PlayerClient } from "@cafemania/player/PlayerClient";
import { PlayerWaiter } from "@cafemania/player/PlayerWaiter";
import { TileItem } from "@cafemania/tileItem/TileItem";
import { TileItemChair } from "@cafemania/tileItem/TileItemChair";
import { TileItemCounter } from "@cafemania/tileItem/TileItemCounter";
import { TileItemStove } from "@cafemania/tileItem/TileItemStove";
import { World, WorldEvent, WorldType } from "./World";

export class WorldServer extends World
{
    private _client?: Client

    constructor(game: GameServer)
    {
        super(game)

        this._type = WorldType.SERVER
        
        this.setupWorld()

        this.setupWorldSendEvents()
    }

    public setClient(client: Client)
    {
        this._client = client

        this.setupWorldReceiveEvents()
    }

    private getClient()
    {
        return this._client!
    }
    

    private setupWorldSendEvents()
    {
        console.log(`[WorldServer] Listening for World events`)

        const world = this

        world.events.on(WorldEvent.PLAYER_CLIENT_SPAWNED, (client: PlayerClient) =>
        {
            const data: IPacketSpawnClientData = {
                client: client.serialize(),
                eatTime: client.eatTime
            }

            this.getClient()?.send(WorldEvent.PLAYER_CLIENT_SPAWNED, data)
        })

        world.events.on(WorldEvent.PLAYER_CLIENT_FIND_CHAIR_DATA, (client: PlayerClient, chair?: TileItemChair) =>
        {
            const data: IPacketClientFindChairData = {
                clientId: client.id,
                chairId: chair?.id
            }

            this.getClient()?.send(WorldEvent.PLAYER_CLIENT_FIND_CHAIR_DATA, data)
        })

        world.events.on(WorldEvent.PLAYER_WAITER_SERVE_CLIENT, (waiter: PlayerWaiter, client: PlayerClient, counter: TileItemCounter) =>
        {
            const data: IPacketWaiterServeClientData = {
                waiterId: waiter.id,
                clientId: client.id,
                counterId: counter.id
            }

            this.getClient()?.send(WorldEvent.PLAYER_WAITER_SERVE_CLIENT, data)
        })


        world.events.on(WorldEvent.TILE_ITEM_UPDATED, (tileItem: TileItem) =>
        {
            this.getClient()?.addTileToUpdate(tileItem.tile)

            console.log(`[WorldServer] Tile item updated ${tileItem.constructor.name} : ${tileItem.id}`)
        })

        world.events.on(WorldEvent.PLAYER_CLIENT_DESTROYED, (client: PlayerClient) =>
        {
            const data: IPacketData_PlayerId = {
                playerId: client.id
            }

            this.getClient()?.send(WorldEvent.PLAYER_CLIENT_DESTROYED, data)
        })
        
    }
    
    private checkExpectedTime(player: PlayerClient, callback: (result: boolean, time: number, expected: number) => void)
    {
        const time = Date.now() - player.beginWalkTime
        const minTime = player.aproximattedTimeToWalk * 0.85

        const isExpectedTime = time > minTime

        callback(isExpectedTime, time, minTime)
    }

    private setupWorldReceiveEvents()
    {
        console.log(`[WorldServer] Listening for Socket events`)

        const clientEvents = this.getClient()!.events
        const world = this

        clientEvents.on(WorldEvent.PLAYER_CLIENT_REACHED_DOOR, (data: IPacketClientReachedDoorData) =>
        {
            const client = world.findPlayer(data.clientId) as PlayerClient | undefined

            if(!client) throw `Client not found (PLAYER_CLIENT_REACHED_DOOR)`

            this.checkExpectedTime(client, (result, time, expectedTime) =>
            {
                if(result)
                {
                    client.warpToDoor()
                    return
                }

                client.destroy()
                this.getClient().displayMessage(`Action took ${time}ms (expected ${expectedTime}ms)`)
            })
    
        })

        clientEvents.on(WorldEvent.PLAYER_CLIENT_REACHED_CHAIR, (data: IPacketClientReachedDoorData) =>
        {
            const client = world.findPlayer(data.clientId) as PlayerClient | undefined

            if(!client) throw `\n\nClient not found (PLAYER_CLIENT_REACHED_CHAIR)\n\n`

            this.checkExpectedTime(client, (result, time, expectedTime) =>
            {
                if(result)
                {
                    client.warpToChair()
                    return
                }
                
                client.destroy()
                this.getClient().displayMessage(`Action took ${time}ms (expected ${expectedTime}ms)`)
            })
            
        })

        clientEvents.on(WorldEvent.PLAYER_WAITER_REACHED_COUNTER, (data: IPacketWaiterReachCounterData) =>
        {
            //
            const waiter = world.findPlayer(data.waiterId) as PlayerWaiter | undefined

            if(!waiter) throw `Waiter not found (PLAYER_WAITER_REACHED_COUNTER)`

            waiter.onGetDish()
        })


        clientEvents.on(WorldEvent.PLAYER_WAITER_FINISH_SERVE, (data: IPacketWaiterFinishServeData) =>
        {
            const waiter = world.findPlayer(data.waiterId) as PlayerWaiter | undefined

            if(!waiter) throw `Waiter not found (PLAYER_WAITER_FINISH_SERVE)`

            waiter.finishServing()
        })

        clientEvents.on(WorldEvent.TILE_ITEM_STOVE_BEGIN_COOK, (data: IPacketStoveBeginCookData) =>
        {
            const stove = world.findTileItem(data.stoveId) as TileItemStove | undefined

            if(!stove) throw `Waiter not found (TILE_ITEM_STOVE_BEGIN_COOK)`

            const dish = world.game.dishFactory.getDish(data.dishId)

            stove.startCook(dish)
        })
     

        
    }

    private setupWorld()
    {
        this.createDefaultMap(7, 10)
     
        
        this.setPlayerClientSpawnEnabled(false)

        this.getCounters()[0].setDish(this.game.dishFactory.getDish('dish1'), 4)
    }

    public beginTestClients()
    {
        this.setPlayerClientSpawnEnabled(true)
        this.resetSpawnedClientsCounter()
    }
}
