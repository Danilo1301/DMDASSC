import { Server } from "@phaserGame/server";

export class Host {
    public Server: Server

    constructor(server: Server) {
        this.Server = server
    }
}