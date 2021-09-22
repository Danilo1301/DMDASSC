import { BaseEntity } from "@game/entity/BaseEntity";
import { EntityChar } from "@game/entity/entityChar/EntityChar";
import { Game } from "@game/game/Game";
import { World } from "@game/world/World";
import { v4 as uuidv4 } from 'uuid';
import { Client } from "./Client";



export class Server extends BaseEntity {

    private _id: string;
    private _worlds = new Phaser.Structs.Map<string, World>([]);
    private _clients = new Phaser.Structs.Map<string, Client>([]);

    constructor(game: Game) {
        super();

        this._id = uuidv4();
    }

    public get id() { return this._id; }
    public get worlds() { return this._worlds.values(); }
    public get clients() { return this._clients.values(); }

    public start() {
        console.log(`[Server] Start`);
    }

    public update(delta: number) {
        //console.log(`[Server] Update`);

        this.clients.map(client => client.update(delta));
    }

    public createWorld() {
        const world = new World(this);
        this._worlds.set(world.id, world);
        return world;
    }

    public handleClientConnection(client: Client) {
        if(this._clients.has(client.id)) {
            client.send("JOIN_SERVER_STATUS", {success: false})
            return
        }

        this._clients.set(client.id, client)

        var world = this.worlds[0]
        var entity = world.addEntity(new EntityChar(world));

        //entity.getComponent(WorldTextComponent).fromData({text: `${client.id}`})
        
        client.send("JOIN_SERVER_STATUS", {success: true, entityId: entity.id})

        client.setEntity(entity)
    }

    public handleClientDisconnect(client: Client) {
        this._clients.delete(client.id)
    }
}