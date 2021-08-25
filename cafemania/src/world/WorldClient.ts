import { GameClient } from "@cafemania/game/GameClient";
import { IPacketClientFindChairData, IPacketClientReachedDoorData, IPacketSpawnClientData, IPacketWaiterFinishServeData, IPacketWaiterServeClientData, IPacketWorldData } from "@cafemania/network/Packet";
import { PlayerClient } from "@cafemania/player/PlayerClient";
import { PlayerWaiter } from "@cafemania/player/PlayerWaiter";
import { HudScene } from "@cafemania/scenes/HudScene";
import { TileItemChair } from "@cafemania/tileItem/TileItemChair";
import { TileItemCounter } from "@cafemania/tileItem/TileItemCounter";
import { World, WorldEvent, WorldType } from "./World";

export class WorldClient extends World
{
    constructor(game: GameClient)
    {
        super(game)

        this._type = WorldType.CLIENT

        this.setupWorldReceiveEvents()
        this.setupWorldSendEvents() 
    }

    private getNetwork()
    {
        return this.getGame().getNetwork()
    }

    private setupWorldSendEvents()
    {
        const world = this

        world.events.on(WorldEvent.PLAYER_CLIENT_REACHED_DOOR, (client: PlayerClient) =>
        {
            HudScene.Instance.addNotification('[send] PLAYER_CLIENT_REACHED_DOOR')

            const data: IPacketClientReachedDoorData = {
                clientId: client.id
            }

            world.getNetwork().emit(WorldEvent.PLAYER_CLIENT_REACHED_DOOR, data)
        })

        world.events.on(WorldEvent.PLAYER_CLIENT_REACHED_CHAIR, (client: PlayerClient) =>
        {
            HudScene.Instance.addNotification('[send] PLAYER_CLIENT_REACHED_CHAIR')

            const data: IPacketClientReachedDoorData = {
                clientId: client.id
            }

            world.getNetwork().emit(WorldEvent.PLAYER_CLIENT_REACHED_CHAIR, data)
        })
        
        world.events.on(WorldEvent.PLAYER_WAITER_FINISH_SERVE, (waiter: PlayerWaiter) =>
        {
            HudScene.Instance.addNotification('[send] PLAYER_WAITER_FINISH_SERVE')

            const data: IPacketWaiterFinishServeData = {
                waiterId: waiter.id
            }

            world.getNetwork().emit(WorldEvent.PLAYER_WAITER_FINISH_SERVE, data)
        })

        /*

        world.events.on(WorldEvent.PLAYER_CLIENT_ARRIVED_DOOR, (player: PlayerClient) =>
        {

            HudScene.Instance.addNotification('> PLAYER_CLIENT_ARRIVED_DOOR')

            world.getNetwork().emit(WorldEvent.PLAYER_CLIENT_ARRIVED_DOOR, player.id)
        })

        world.events.on(WorldEvent.PLAYER_CLIENT_SAT_ON_CHAIR, (player: PlayerClient) =>
        {

            HudScene.Instance.addNotification('> PLAYER_CLIENT_SAT_ON_CHAIR')

            world.getNetwork().emit(WorldEvent.PLAYER_CLIENT_SAT_ON_CHAIR, player.id)
        })

        world.events.on(WorldEvent.PLAYER_WAITER_FINISHED_SERVE, (waiter: PlayerWaiter) =>
        {
            world.getNetwork().emit(WorldEvent.PLAYER_WAITER_FINISHED_SERVE, waiter.id)
        })

        */
    }

    private setupWorldReceiveEvents()
    {
        const world = this
        const socket = world.getNetwork().getSocket()

        socket.on("worldData", packet => world.onReceivePacketWorldData(packet))

        socket.on(WorldEvent.PLAYER_CLIENT_SPAWNED, (data: IPacketSpawnClientData) =>
        {
            HudScene.Instance.addNotification('[receive] PLAYER_CLIENT_SPAWNED')

            const player = world.createPlayerClient(data.client.x, data.client.y)
            world.changePlayerId(player, data.client.id)
            player.startClientBehavior()
        })



        socket.on(WorldEvent.PLAYER_CLIENT_SIT_CHAIR_DATA, (data: IPacketClientFindChairData) =>
        {
            HudScene.Instance.addNotification('[receive] PLAYER_CLIENT_SIT_CHAIR_DATA')

            const client = world.findPlayer(data.clientId) as PlayerClient | undefined

            if(!client) throw `Client not found`

            if(!data.chairId)
            {
                client.exitCafe()
                return
            }

            const chair = world.findTileItem(data.chairId) as TileItemChair | undefined

            if(!chair) throw `Chair not found`

            client.setGoingToChair(chair)
        })

        socket.on(WorldEvent.PLAYER_WAITER_SERVE_CLIENT, (data: IPacketWaiterServeClientData) =>
        {
            HudScene.Instance.addNotification('[receive] PLAYER_WAITER_SERVE_CLIENT')

            const waiter = world.findPlayer(data.waiterId) as PlayerWaiter | undefined

            if(!waiter) throw `Waiter not found`

            const client = world.findPlayer(data.clientId) as PlayerClient | undefined

            if(!client) throw `Client not found`

            const counter = world.findTileItem(data.counterId) as TileItemCounter | undefined

            if(!counter) throw `Counter not found`

            console.log(waiter)

            waiter.taskServeClient(client, counter)

            console.log("")
        })
        

        /*
        socket.on("playerclient_spawned", (data: IPacketPlayerData) =>
        {
            HudScene.Instance.addNotification('< PLAYER_CLIENT_SPAWNED')

            const player = world.createPlayerClient(data.x, data.y)
            world.changePlayerId(player, data.id)

        })

        socket.on(WorldEvent.PLAYER_CLIENT_GO_TO_CHAIR, (data: IPacketPlayerGoToChairData) =>
        {
            HudScene.Instance.addNotification(`< PLAYER_CLIENT_GO_TO_CHAIR`)

            const players = world.getPlayers().filter(player => player.id == data.playerId)

            if(players.length == 0) return

            const tileItem = world.findTileItem(data.chairId)

            if(!tileItem) return

            const player = players[0] as PlayerClient
            
            player.taskSitAtChair(tileItem as TileItemChair)
        })

        socket.on(WorldEvent.PLAYER_WAITER_BEGIN_SERVE, (data: IPacketWaiterBeginServe) =>
        {
            HudScene.Instance.addNotification(`< PLAYER_WAITER_BEGIN_SERVE`)

            const waiter = world.findPlayer(data.waiterId)
            const client = world.findPlayer(data.clientId)
            const counter = world.findTileItem(data.counterId)

            console.log(waiter, client, counter, data)

            if(!waiter || !client || !counter) return

            (waiter as PlayerWaiter).taskBeginServe(client as PlayerClient, counter as TileItemCounter)

            console.log(`waiter serve client`)
        })
        */
    }

    public getGame()
    {
        return super.getGame() as GameClient
    }

    private onReceivePacketWorldData(data: IPacketWorldData)
    {
        console.log('onReceivePacketWorldData')

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

                const tileItemIds = tile.getTileItems().map(tileItem => tileItem.id)

                for (const tileItemData of tileData.tileItems)
                {
                    if(!tileItemIds.includes(tileItemData.id))
                    {
                        const tileItem = world.addNewTileItem(tileItemData.tileItemInfo, tile, tileItemData.direction, tileItemData.id)

                        if(tileItemData.data) tileItem.setData(tileItemData.data)
                    }
                }
            }
        }

        if(data.waiters)
        {
            for (const waiterData of data.waiters)
            {
                if(world.findPlayer(waiterData.id) == undefined)
                {
                    const waiter = world.createPlayerWaiter(waiterData.x, waiterData.y)
                    world.changePlayerId(waiter, waiterData.id)
                }
            }
        }

        this.generateSideWalks(data.sideWalkSize)
    }

}