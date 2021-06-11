import { Game } from "@phaserGame/game";
import { World } from "@phaserGame/world";
import { Host } from "@phaserGame/host";

export class Server {
    public Game: Game
    public Worlds = new Phaser.Structs.Map<string, World>([])
    public Host: Host | undefined

    private _id: string = ""

    constructor(id: string, game: Game) {
        this._id = id
        this.Game = game
    }

    public get Id(): string { return this._id }

    public Start(): void {
        console.log(`Server.${this.Id}.Start()`)

        this.CreateWorld("world")
    }

    public CreateWorld(id: string): World {
        var world = new World(this, id)
        this.Worlds.set(id, world)
        world.Start()
        return world
    }

    public SetupDemo() {
        var world = this.Worlds.values()[0]

        for (let i = 0; i < 3; i++) {
            //world.EntityFactory.CreateBot(400, 300)
        }

        for (let i = 0; i < 6; i++) {
            //world.EntityFactory.CreateEntity("EntityCrate", null)
        }

 
    }
}


