import { GameServer } from "@cafemania/game/GameServer";
import { IPacketWorldData, Packet } from "@cafemania/network/Packet";
import { Tile } from "@cafemania/tile/Tile";
import { WorldServer } from "@cafemania/world/WorldServer";
import { Socket } from "socket.io";
import { v4 as uuidv4 } from 'uuid';

export class Client
{
    public events = new Phaser.Events.EventEmitter()

    private _game: GameServer

    private _socket?: Socket

    private _id: string

    private _world: WorldServer

    private _updateTiles: Tile[] = []

    private _lastSentData: number = 0

    private _lastSentPackets: number = 0
    private _packets: Packet[] = []

    constructor(game: GameServer)
    {
        this._game = game
        this._id = uuidv4()

        console.log(`[Client] Client created`)

        console.log(`[Client] Creating world`)
        this._world = game.createServerWorld()

        console.log(`[Client] Starting update timer`)
        this.startUpdateTimer()
    }

    public addTileToUpdate(tile: Tile)
    {
        //this._packets.push()

        //if(this._updateTiles.includes(tile)) return

        //this._updateTiles.push(tile)
    }

    public get id()
    {
        return this._id
    }

    private _hasLoaded: boolean = false

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

            this.processSendPackets()
            
        }, 0)
    }

    private processSendPackets()
    {
        if(!this.isConnected()) return

        const now = Date.now()

        if(now - this._lastSentPackets >= 500 && this._packets.length > 0)
        {
            this._lastSentPackets = now

            this.getSocket().emit('packets', this._packets)

            console.log(`[Client] Sent ${this._packets.length} packets ${this._packets.map(packet => packet.id).join(",") }`)

            this._packets = []
        }
    }

    public sendAllUpdatesQueued()
    {
        if(this._updateTiles.length == 0) return

        this.sendData()
    }

    public isConnected()
    {
        return this._socket != undefined
    }

    public getGame()
    {
        return this._game
    }

    private getSocket()
    {
        return this._socket!
    }

    /*
    public emit(key: string, packet)
    {
        if(!this.isConnected()) return

        this.getSocket().emit(key, packet)
    }
    */
    
    public send(id: string, data?: any)
    {
        const packet: Packet = {
            id: id,
            data: data
        }

        this._packets.push(packet)

        console.log("queted ", id)
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

        this.send("worldData", data)

        this._lastSentData = Date.now()

        console.log(`[Client] Sending data (${JSON.stringify(data).length} len)`)
    }

    public getWorld()
    {
        return this._world as WorldServer
    }

    public setSocket(socket: Socket)
    {
        if(this._socket)
        {

            console.warn("[Client] Already connected")
            return
        }

        this._socket = socket

        
        socket.on("disconnect", () => this.onDisconnect())
        socket.on("packets", (packets: Packet[]) =>
        {
            packets.map(packet => this.onReceivePacket(packet))
        })

        this.events.on('loaded', () => this.onLoaded())

        this.getWorld().setClient(this)

        this.onConnect()
    }

    private onReceivePacket(packet: Packet)
    {
        console.log(`[Client] Received packet '${packet.id}'`)

        try {
            this.events.emit(packet.id, packet.data)
        } catch (error) {
            
            console.log(`Error during process of packet '${packet.id}'\n\n`, error)

            this.send("DISPLAY_MESSAGE", `[server error] ${error}`)
        }
        
    }

    private onLoaded()
    {
        if(this._hasLoaded) return
        this._hasLoaded = true

        this.sendFirstJoinWorldData()

        this.getWorld().beginTestClients()

        
    }

    private onConnect()
    {
        console.log(`[Client] Client ${this.id} connected`)

        this.getWorld().createDefaultWaiters()
    }

    private onDisconnect()
    {
        this._socket = undefined

        this.getWorld().removeAllPlayers()
        this.getWorld().resetChairsAndTables()
    }
}