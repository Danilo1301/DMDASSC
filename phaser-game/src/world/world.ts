import { EntityPlayer } from "@phaserGame/entities";
import { EntityFactory } from "@phaserGame/entityFactory";
import { PhysicBody } from "@phaserGame/game/components";
import { TestAI } from "@phaserGame/game/components/testAi";
import { Server } from "@phaserGame/server";
import { WorldScene } from "./worldScene";

export class World {
    public Server: Server
    public EntityFactory: EntityFactory

    private _id: string;
    private _scene!: WorldScene;

    constructor(server: Server, id: string) {
        this.Server = server
        this._id = id
        this.EntityFactory = new EntityFactory(this)
    }

    public get Id(): string { return this._id }
    public get Scene(): WorldScene { return this._scene }

    private get SceneKey(): string { return this.Server.Id + "_" + this.Id }

    public Start(): void {
        console.log(`World.Start()`)

        this.SetupScene()
    }

    public Preload(): void {
        console.log(`World.Preload()`)

        var load = this.Scene.load;

        load.setPath(this.Server.Game.ASSETS_PATH)
        load.image('player1', 'player1.png')
        load.image('player2', 'player2.png')
        load.image('block1', 'block1.png')
        load.image('block2', 'block2.png')
    }

    public Create(): void {
        console.log(`World.Create()`)
    }

    private SetupScene(): void {
        this._scene = this.Server.Game.scene.add(this.SceneKey, WorldScene) as WorldScene
        this._scene.World = this
        this.Server.Game.scene.start(this.SceneKey)

        this.EntityFactory.Scene = this._scene
    }

    public Update(delta: number): void {
        this.EntityFactory.Update(delta)
    }
}