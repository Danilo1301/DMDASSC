import { GameServer } from "@cafemania/game/GameServer";
import { IPacketWorldData, Packet } from "@cafemania/network/Packet";
import { Tile } from "@cafemania/tile/Tile";
import { WorldServer } from "@cafemania/world/WorldServer";
import { Socket } from "socket.io";
import { v4 as uuidv4 } from 'uuid';

export class Client {

    public events = new Phaser.Events.EventEmitter();

    private _game: GameServer;

    private _id: string;

    private _socket?: Socket;

    private _world: WorldServer;

    private _updateTiles: Tile[] = [];

    private _lastSentPackets: number = 0;
    private _packets: Packet[] = [];

    private _hasLoaded: boolean = false;

    constructor(game: GameServer) {
        this._game = game;
        this._id = uuidv4();

        console.log(`[Client] Client created`);

        console.log(`[Client] Creating world`);
        this._world = game.createServerWorld();

        console.log(`[Client] Starting update timer`);
        this.startUpdateTimer();
    }

    public get id() { return this._id; }
    public get game() { return this._game; }
    public get world() { return this._world; }
    public get socket() { return this._socket!; }

    public get isConnected() { return this._socket != undefined; }

    public addTileToUpdate(tile: Tile) {
        if(this._updateTiles.includes(tile)) return
        this._updateTiles.push(tile)

        this.sendData()
    }

    private startUpdateTimer() {
        let last = Date.now()
        let time = 1000/60

        setInterval(() => {
            const now = Date.now()

            if(now - last >= time) {
                const delta = now - last
                last = now

                this.world.update(delta)
            }

            this.processSendPackets()
        }, 0)
    }

    private processSendPackets() {
        if(!this.isConnected) return

        const now = Date.now()

        if(now - this._lastSentPackets >= 250 && this._packets.length > 0) {
            this.socket.emit('packets', this._packets)
            
            console.log(`[Client] Sent ${this._packets.length} packets ${this._packets.map(packet => packet.id).join(",") }`)

            this._packets = []
            this._lastSentPackets = now
        }
    }

    public send(id: string, data?: any){
        const packet: Packet = {
            id: id,
            data: data
        }
        this._packets.push(packet)
    }

    public sendFirstJoinWorldData() {
        this.sendData(true)
    }

    private sendData(sendAll?: boolean) {
        const world = this.world
        const tiles = sendAll ? world.getTiles() : this._updateTiles

        const data: IPacketWorldData = {
            tiles: tiles.map(tile => tile.serialize())
        }

        if(sendAll) {
            data.cheff = world.getPlayerCheff().serialize()
            data.waiters = world.getPlayerWaiters().map(waiter => waiter.serialize())
            data.sideWalkSize = world.getSideWalkSize()
        }
        
        this._updateTiles = []
        this.send("WORLD_DATA", data)
    }

    public setSocket(socket: Socket) {
        if(this.isConnected) {
            console.warn("[Client] Already connected");
            return
        }
        this._socket = socket;

        socket.on("disconnect", () => this.onDisconnect());
        socket.on("packets", (packets: Packet[]) => packets.map(packet => this.onReceivePacket(packet)) );

        this.events.on('loaded', () => this.onLoaded());

        this.world.setClient(this);

        this.onConnect();
    }

    private onReceivePacket(packet: Packet) {
        console.log(`[Client] Received packet '${packet.id}'`);

        try {
            this.events.emit(packet.id, packet.data);
        } catch (error) {
            console.log(`Error during process of packet '${packet.id}'\n\n`, error);
            this.displayMessage(`[server error] ${error}`);
        }
    }

    public displayMessage(text: string) {
        this.send("DISPLAY_MESSAGE", text);
    }

    private onLoaded() {
        if(this._hasLoaded) return;
        this._hasLoaded = true;

        this.sendFirstJoinWorldData();

        this.world.beginTestClients();
    }

    private onConnect() {
        console.log(`[Client] Client ${this.id} connected`);

        this.world.createDefaultWaiters();
    }

    private onDisconnect() {
        this._socket = undefined;

        this.world.removeAllPlayers();
        this.world.resetChairsAndTables();
    }
}