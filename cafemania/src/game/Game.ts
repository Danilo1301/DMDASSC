import World from "@cafemania/world/World"
import Phaser from 'phaser'
import SceneManager from "./SceneManager"
import { TileItemFactory } from "../tileItem/TileItemFactory"
import PlayerAnimations from "@cafemania/player/PlayerAnimations"

export default class Game
{
    public events = new Phaser.Events.EventEmitter()

    public tileItemFactory: TileItemFactory

    private _worlds = new Phaser.Structs.Map<string, World>([])

    constructor()
    {
        this.tileItemFactory = new TileItemFactory(this)
        this.tileItemFactory.init()
    }

    public async start(): Promise<void>
    {
        await this.init()
    }

    private async init(): Promise<void>
    {
        await SceneManager.createPhaserInstance()

        console.log("resolved")

        this.events.emit("ready")

        this.createWorld()
    }

    public startScene(key: string, scene: typeof Phaser.Scene): Phaser.Scene
    {
        return SceneManager.getGame().scene.add(key, scene, true, {game: this}) as Phaser.Scene
    }

    public getWorlds(): World[]
    {
        return this._worlds.values()
    }

    public createWorld(): World
    {
        const id = "World" + Math.random()
        const world = new World(this)

        this._worlds.set(id, world);

        return world
    }

    public getPhaser()
    {
        return SceneManager.getGame()
    }
}