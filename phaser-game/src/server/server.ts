import { Game } from "@phaserGame/game";
import { World } from "@phaserGame/world";
import { Entity } from "@phaserGame/utils";

export class Server extends Entity {
    public Game: Game
    public Worlds = new Phaser.Structs.Map<string, World>([])

    public Id: string

    constructor(id: string, game: Game) {
        super()

        this.Id = id
        this.Game = game
    }

    public Awake() {
        super.Awake()

        this.Game.Scene.events.on('update', (time, delta) => super.Update(delta) )

        this.CreateWorld('world')
    }

    public CreateWorld(id: string): World {
        var world = new World(this, id)
        this.Worlds.set(id, world)
        return world
    }
}


