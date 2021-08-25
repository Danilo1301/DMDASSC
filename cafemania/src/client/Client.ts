import { GameServer } from "@cafemania/game/GameServer";
import { IPacketWorldData } from "@cafemania/network/Packet";
import { Tile } from "@cafemania/tile/Tile";
import { WorldServer } from "@cafemania/world/WorldServer";
import { Socket } from "socket.io";
import { v4 as uuidv4 } from 'uuid';

export class Client
{
    private _game: GameServer

    private _socket?: Socket

    private _id: string

    private _world: WorldServer

    private _updateTiles: Tile[] = []

    private _lastSentData: number = 0

    constructor(game: GameServer)
    {
        this._game = game
        this._id = uuidv4()

        this._world = game.createServerWorld()

        this.startUpdateTimer()
    }

    public addTileToUpdate(tile: Tile)
    {
        if(this._updateTiles.includes(tile)) return

        this._updateTiles.push(tile)
    }

    public get id()
    {
        return this._id
    }

    private startUpdateTimer()
    {
        let last = Date.now()
        let time = 1000/60

        setInterval(() => {
            const now = Date.now()

            if(now - last >= time)
            {
                const delta = now - last
                last = now

                this._world.update(delta)
            }

            if(now - this._lastSentData >= 500)
            {
                this.sendData()
            }
        }, 0)
    }

    public isConnected()
    {
        return this._socket != undefined
    }

    public getGame()
    {
        return this._game
    }

    public getSocket()
    {
        return this._socket!
    }

    public emit(key: string, packet)
    {
        if(!this.isConnected()) return

        this.getSocket().emit(key, packet)
    }
    
    public sendFirstJoinWorldData()
    {
        this.sendData(true)
    }

    private sendData(sendAll?: boolean)
    {
        const world = this.getWorld()

        const tiles = sendAll ? world.getTiles() : this._updateTiles

        const data: IPacketWorldData =
        {
            tiles: tiles.map(tile => tile.serialize())
        }

        if(sendAll)
        {
            data.cheff = world.getPlayerCheff().serialize()
            data.waiters = world.getPlayerWaiters().map(waiter => waiter.serialize())
            data.sideWalkSize = world.getSideWalkSize()
        }
        
        this._updateTiles = []

        this.emit("worldData", data)

        this._lastSentData = Date.now()

        console.log(JSON.stringify(data))
    }

    public getWorld()
    {
        return this._world as WorldServer
    }

    public setSocket(socket: Socket)
    {
        this._socket = socket

        socket.on("disconnect", () => this.onDisconnect())
        socket.on("loaded", () => this.onReady())

        this.getWorld().setClient(this)

        this.onConnect()
    }


    private onReady()
    {
        this.sendFirstJoinWorldData()

        this.getWorld().beginTestClients()

        
    }

    private onConnect()
    {
        console.log(`Client ${this.id} connected`)

        this.getWorld().createDefaultWaiters()
    }

    private onDisconnect()
    {
        this._socket = undefined

        this.getWorld().removeAllPlayers()
        this.getWorld().resetChairsAndTables()
    }
}