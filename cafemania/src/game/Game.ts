import World from "@cafemania/world/World"
import "phaser"
import SceneManager from "./SceneManager"
import { TileItemFactory } from "../tileItem/TileItemFactory"

export default class Game
{
    public events = new Phaser.Events.EventEmitter()

    public tileItemFactory: TileItemFactory

    private _worlds = new Phaser.Structs.Map<string, World>([])

    private _gameScene?: Phaser.Scene;

    constructor()
    {
        this.tileItemFactory = new TileItemFactory(this)
        this.tileItemFactory.init()
    }

    public async start(): Promise<void>
    {
        await this.init()
    }

    public async init(): Promise<void>
    {
        await SceneManager.createPhaserInstance()
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

    public getGameScene(): Phaser.Scene
    {
        return this._gameScene!
    }

    public setGameScene(scene: Phaser.Scene): void {
        this._gameScene = scene
    }
}