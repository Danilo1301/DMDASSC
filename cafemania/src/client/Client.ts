import { GameServer } from "@cafemania/game/GameServer";
import { IPacketSpawnClientData, IPacketWorldData } from "@cafemania/network/Packet";
import { PlayerClient } from "@cafemania/player/PlayerClient";
import { WorldEvent } from "@cafemania/world/World";
import { WorldServer } from "@cafemania/world/WorldServer";
import { Socket } from "socket.io";
import { v4 as uuidv4 } from 'uuid';

export class Client
{
    private _game: GameServer

    private _socket?: Socket

    private _id: string

    private _world: WorldServer

    constructor(game: GameServer)
    {
        this._game = game
        this._id = uuidv4()

        this._world = game.createServerWorld()

        this.startUpdateTimer()
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

    public sendWorldData()
    {
        const world = this.getWorld()
        const tiles = world.getTiles().filter(tile => !tile.isSideWalk()).map(tile => tile.serialize())

        const waiters = world.getPlayerWaiters().map(waiter => waiter.serialize())

        const data: IPacketWorldData = {
            tiles: tiles,
            waiters: waiters,
            sideWalkSize: world.getSideWalkSize()
        }

        this.emit("worldData", data)

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
        this.sendWorldData()

        this.getWorld().beginTestClients()

        
    }

    private onConnect()
    {
        console.log(`Client ${this.id} connected`)
    }

    private onDisconnect()
    {
        this._socket = undefined
    }
}