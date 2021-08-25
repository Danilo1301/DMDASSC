import { Client } from "@cafemania/client/Client";
import { GameServer } from "@cafemania/game/GameServer";
import { IPacketClientFindChairData, IPacketClientReachedDoorData, IPacketSpawnClientData, IPacketStoveBeginCookData, IPacketTileItemIdData, IPacketWaiterFinishServeData, IPacketWaiterServeClientData } from "@cafemania/network/Packet";
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

        /*

        this.events.on("playerwaiter_spawned", (player: PlayerWaiter) =>
        {
            player.setDisable(false)
        })

        this.events.on("playerclient_spawned", (player: PlayerClient) =>
        {
            console.log("playerclient_spawned")

            player.getTaskManager().clearTasks()

            //setTimeout(() => this.events.emit("playerclient_arrived_door", player) , 1000);
            
        })

        this.events.on(WorldEvent.PLAYER_CLIENT_ARRIVED_DOOR, (player: PlayerClient) =>
        {
            console.log(`[WorldServer] PLAYER_CLIENT_ARRIVED_DOOR`)
            player.onArrivedDoor()
        })

        this.events.on("playerclient_find_avaliable_chair_fail", () =>
        {
            console.log('playerclient_find_avaliable_chair_fail')
        })

        this.events.on(WorldEvent.PLAYER_CLIENT_GO_TO_CHAIR, (player: PlayerClient, chair: TileItemChair) =>
        {
            console.log('PLAYER_CLIENT_GO_TO_CHAIR')
            player.getTaskManager().clearTasks()
        })



        this.events.on("playerwaiter_served_player", (player: PlayerWaiter) =>
        {
            console.log('playerwaiter_served_player', player)
        })

        this.createTileMap(7, 10)
        this.createPlayerWaiter(2, 6)
        this.createPlayerWaiter(2, 8)
        this.setPlayerClientSpawnEnabled(false)

        this.getCounters()[0].setDish(this.getGame().getDishItemFactory().getDish('dish1'), 100)

        */
       
    }

    public setClient(client: Client)
    {
        this._client = client

        this.setupWorldReceiveEvents()
    }
    
    private getSocket()
    {
        const client = this._client

        if(!client) return

        return client.getSocket()
    }

    private setupWorldSendEvents()
    {
        const world = this

        world.events.on(WorldEvent.PLAYER_CLIENT_SPAWNED, (client: PlayerClient) =>
        {
            const data: IPacketSpawnClientData = {
                client: client.serialize()
            }

            this.getSocket()?.emit(WorldEvent.PLAYER_CLIENT_SPAWNED, data)
        })

        world.events.on(WorldEvent.PLAYER_CLIENT_SIT_CHAIR_DATA, (client: PlayerClient, chair?: TileItemChair) =>
        {
            const data: IPacketClientFindChairData = {
                clientId: client.id,
                chairId: chair?.id
            }

            this.getSocket()?.emit(WorldEvent.PLAYER_CLIENT_SIT_CHAIR_DATA, data)
        })

        world.events.on(WorldEvent.PLAYER_WAITER_SERVE_CLIENT, (waiter: PlayerWaiter, client: PlayerClient, counter: TileItemCounter) =>
        {
            const data: IPacketWaiterServeClientData = {
                waiterId: waiter.id,
                clientId: client.id,
                counterId: counter.id
            }

            this.getSocket()?.emit(WorldEvent.PLAYER_WAITER_SERVE_CLIENT, data)
        })


        world.events.on(WorldEvent.TILE_ITEM_UPDATED, (tileItem: TileItem) =>
        {
            const client = this._client
            
            client?.addTileToUpdate(tileItem.getTile())

            console.log(`[WorldServer] Tile item updated ${tileItem.constructor.name} : ${tileItem.id}`)
        })
        
    }

    private setupWorldReceiveEvents()
    {
        const socket = this.getSocket()!
        const world = this

        socket.on(WorldEvent.PLAYER_CLIENT_REACHED_DOOR, (data: IPacketClientReachedDoorData) =>
        {
            const player = world.findPlayer(data.clientId) as PlayerClient | undefined

            if(!player) throw `Player not found`

            player.warpToDoor()
        })

        socket.on(WorldEvent.PLAYER_CLIENT_REACHED_CHAIR, (data: IPacketClientReachedDoorData) =>
        {
            const player = world.findPlayer(data.clientId) as PlayerClient | undefined

            if(!player) throw `Player not found`

            player.warpToChair()
        })

        socket.on(WorldEvent.PLAYER_WAITER_FINISH_SERVE, (data: IPacketWaiterFinishServeData) =>
        {
            const waiter = world.findPlayer(data.waiterId) as PlayerWaiter | undefined

            if(!waiter) throw `Waiter not found`

            waiter.finishServing()
        })

        socket.on(WorldEvent.TILE_ITEM_STOVE_BEGIN_COOK, (data: IPacketStoveBeginCookData) =>
        {
            const stove = world.findTileItem(data.stoveId) as TileItemStove | undefined

            if(!stove) throw `Waiter not found`

            const dish = world.getGame().getDishItemFactory().getDish(data.dishId)

            stove.startCook(dish)
        })
    }

    private setupWorld()
    {
        this.createDefaultMap(7, 10)
     
        
        this.setPlayerClientSpawnEnabled(false)

        this.getCounters()[0].setDish(this.getGame().getDishItemFactory().getDish('dish1'), 4)
    }

    public beginTestClients()
    {
        this.setPlayerClientSpawnEnabled(true)
        this.resetSpawnedClientsCounter()
    }
}
