import Phaser from "phaser";
import { Server } from "@game/server/Server";

export class Game {

    public events = new Phaser.Events.EventEmitter()

    private _servers = new Phaser.Structs.Map<string, Server>([])

    constructor() {}

    public get servers() { return this._servers.values() }

    public start() {}

    public createServer() {
        const server = new Server(this);
        this._servers.set(server.id, server)
        return server;
    }

    public getMainServer() {
        return this.servers[0];
    }

    public getServer(id: string) {
        return this._servers.get(id);
    }

    protected updateServers(delta: number) {
        for (const server of this.servers) server.update(delta);
    }
}