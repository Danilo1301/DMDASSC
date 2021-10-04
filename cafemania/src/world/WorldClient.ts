import { Dish } from "@cafemania/dish/Dish";
import { GameClient } from "@cafemania/game/GameClient";
import { IPacketClientFindChairData, IPacketClientReachedDoorData, IPacketData_PlayerId, IPacketSpawnClientData, IPacketStoveBeginCookData, IPacketTileItemIdData, IPacketWaiterFinishServeData, IPacketWaiterReachCounterData, IPacketWaiterServeClientData, IPacketWorldData } from "@cafemania/network/Packet";
import { PlayerClient } from "@cafemania/player/PlayerClient";
import { PlayerWaiter } from "@cafemania/player/PlayerWaiter";
import { GameScene } from "@cafemania/scenes/GameScene";
import { HudScene } from "@cafemania/scenes/HudScene";
import { TileItemChair } from "@cafemania/tileItem/TileItemChair";
import { TileItemCounter } from "@cafemania/tileItem/TileItemCounter";
import { TileItemStove } from "@cafemania/tileItem/TileItemStove";
import { World, WorldEvent, WorldType } from "./World";

export class WorldClient extends World {

    constructor(game: GameClient) {
        super(game);

        this._type = WorldType.CLIENT;

        this.setupWorldReceiveEvents();
        this.setupWorldSendEvents() ;
    }

    private setupWorldSendEvents() {
        const world = this;
        const network = world.game.network;
        const worldEvents = world.events;

        worldEvents.on(WorldEvent.PLAYER_CLIENT_REACHED_DOOR, (client: PlayerClient) =>
        {
            //HudScene.Instance.addNotification('[send] PLAYER_CLIENT_REACHED_DOOR')

            const data: IPacketClientReachedDoorData = {
                clientId: client.id
            }

            network.send(WorldEvent.PLAYER_CLIENT_REACHED_DOOR, data)
        })

        worldEvents.on(WorldEvent.PLAYER_CLIENT_REACHED_CHAIR, (client: PlayerClient) =>
        {
            //HudScene.Instance.addNotification('[send] PLAYER_CLIENT_REACHED_CHAIR')

            const data: IPacketClientReachedDoorData = {
                clientId: client.id
            }

            network.send(WorldEvent.PLAYER_CLIENT_REACHED_CHAIR, data)
        })
        
        worldEvents.on(WorldEvent.PLAYER_WAITER_REACHED_COUNTER, (waiter: PlayerWaiter) =>
        {
            //HudScene.Instance.addNotification('[send] PLAYER_WAITER_REACHED_COUNTER')

            const data: IPacketWaiterReachCounterData = {
                waiterId: waiter.id
            }

            network.send(WorldEvent.PLAYER_WAITER_REACHED_COUNTER, data)
        })

        worldEvents.on(WorldEvent.PLAYER_WAITER_FINISH_SERVE, (waiter: PlayerWaiter) =>
        {
            //HudScene.Instance.addNotification('[send] PLAYER_WAITER_FINISH_SERVE')

            const data: IPacketWaiterFinishServeData = {
                waiterId: waiter.id
            }

            network.send(WorldEvent.PLAYER_WAITER_FINISH_SERVE, data)
        })

        worldEvents.on(WorldEvent.TILE_ITEM_STOVE_BEGIN_COOK, (stove: TileItemStove, dish: Dish) =>
        {
            HudScene.Instance.addNotification('[send] TILE_ITEM_STOVE_BEGIN_COOK')

            const data: IPacketStoveBeginCookData = {
                stoveId: stove.id,
                dishId: dish.id
            }

            network.send(WorldEvent.TILE_ITEM_STOVE_BEGIN_COOK, data)
        })

        
    }

    private setupWorldReceiveEvents()
    {
        const world = this
        const networkEvent = world.game.network.events

        networkEvent.on("WORLD_DATA", packet => world.onReceivePacketWorldData(packet))

        networkEvent.on(WorldEvent.PLAYER_CLIENT_SPAWNED, (data: IPacketSpawnClientData) =>
        {
            //HudScene.Instance.addNotification('[receive] PLAYER_CLIENT_SPAWNED')

            const client = world.createPlayerClient(data.client.x, data.client.y, data.client.id)
            client.startClientBehavior()
            client.setEatTime(data.eatTime);
        })

        networkEvent.on(WorldEvent.PLAYER_CLIENT_FIND_CHAIR_DATA, (data: IPacketClientFindChairData) =>
        {
            //HudScene.Instance.addNotification('[receive] PLAYER_CLIENT_FIND_CHAIR_DATA')

            const client = world.findPlayer(data.clientId) as PlayerClient | undefined

            if(!client) throw `Client not found (PLAYER_CLIENT_FIND_CHAIR_DATA)`

            if(!data.chairId)
            {
                client.exitCafe()
                return
            }

            const chair = world.findTileItem(data.chairId) as TileItemChair | undefined

            if(!chair) throw `Chair not found (PLAYER_CLIENT_FIND_CHAIR_DATA)`

            client.setGoingToChair(chair)
        })

        networkEvent.on(WorldEvent.PLAYER_WAITER_SERVE_CLIENT, (data: IPacketWaiterServeClientData) =>
        {
            //HudScene.Instance.addNotification('[receive] PLAYER_WAITER_SERVE_CLIENT')

            const waiter = world.findPlayer(data.waiterId) as PlayerWaiter | undefined

            if(!waiter) throw `Waiter not found (PLAYER_WAITER_SERVE_CLIENT)`

            const client = world.findPlayer(data.clientId) as PlayerClient | undefined

            if(!client) throw `Client not found (PLAYER_WAITER_SERVE_CLIENT)`

            const counter = world.findTileItem(data.counterId) as TileItemCounter | undefined

            if(!counter) throw `Counter not found (PLAYER_WAITER_SERVE_CLIENT)`

            waiter.taskServeClient(client, counter)
        })

        networkEvent.on(WorldEvent.PLAYER_CLIENT_DESTROYED, (data: IPacketData_PlayerId) =>
        {
            const client = world.findPlayer(data.playerId) as PlayerClient | undefined

            if(!client) throw `Client not found (PLAYER_CLIENT_DESTROYED)`

            if(client.isExitingCafe) return console.log(`Can't destroy; is exiting cafe`)
            if(client.hasStartedEating) {
                
            
                client.finishEating();

                return;
            }

            client.destroy()
        })
    
    }

    public get game()
    {
        return super.game as GameClient
    }

    private onReceivePacketWorldData(data: IPacketWorldData)
    {
        const world = this

        if(data.tiles)
        {
            for (const tileData of data.tiles)
            {
                if(!world.hasTile(tileData.x, tileData.y)) world.addTile(tileData.x, tileData.y)
            }

            for (const tileData of data.tiles)
            {
                const tile = world.getTile(tileData.x, tileData.y)

                const tileItemIds = tile.tileItems.map(tileItem => tileItem.id)

                for (const tileItemData of tileData.tileItems)
                {
                    if(!tileItemIds.includes(tileItemData.id))
                    {
                        world.addNewTileItem(tileItemData.tileItemInfo, tile, tileItemData.direction, tileItemData.id)
                    }

                    const tileItem = tile.getTileItem(tileItemData.id)!

                    if(tileItemData.data)
                    {
                        tileItem.setData(tileItemData.data)

                        console.log(`[WorldClient] TileItem Data updated ${tileItem.getInfo().name}`)
                    }
                }
            }
        }

        if(data.cheff)
        {
            if(world.findPlayer(data.cheff.id) == undefined)
            {
                world.createPlayerCheff(data.cheff.x, data.cheff.y, data.cheff.id)
            }
        }
        




        if(data.waiters)
        {
            for (const waiterData of data.waiters)
            {
                if(world.findPlayer(waiterData.id) == undefined)
                {
                    const waiter = world.createPlayerWaiter(waiterData.x, waiterData.y, waiterData.id)
                }
            }
        }

        this.generateSideWalks(data.sideWalkSize)
    }

}