import { EntityManager } from "@phaserGame/entityManager/entityManager";
import { Game } from "@phaserGame/game";
import { Entity } from "@phaserGame/utils";
import { World } from "@phaserGame/world";


export class Server {
    public Game: Game

    public IsOnlineServer: boolean = false

    private _id: string
    private _worlds = new Phaser.Structs.Map<string, World>([])
    public get Worlds(): World[] { return this._worlds.values() }

    public Events = new Phaser.Events.EventEmitter();

    constructor(game: Game, id: string) {
        this.Game = game
        this._id = id 

        console.log(this.Id, this.Game.IsServer)
    }

    public get Id(): string { return this._id }

    public Start(): void {
        console.log(`[Server] Start`)

        var world = this.CreateWorld('world')
        world.Init()
    }

    public CreateWorld(id: string): World {
        console.log(`[Server] Creating world '${id}'`)

        var world = new World(id, this)
        this._worlds.set(id, world)
        return world
    }
}


