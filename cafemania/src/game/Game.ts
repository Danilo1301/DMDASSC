import World, { WorldType } from "@cafemania/world/World"
import Phaser from 'phaser'
import SceneManager from "./SceneManager"
import { TileItemFactory } from "../tileItem/TileItemFactory"
import DishFactory from "@cafemania/dish/DishFactory"
import Network from "@cafemania/network/Network"

export default class Game
{
    public events = new Phaser.Events.EventEmitter()

    public tileItemFactory: TileItemFactory
    public dishFactory: DishFactory

    private _worlds = new Phaser.Structs.Map<string, World>([])

    constructor()
    {
        this.tileItemFactory = new TileItemFactory(this)
        this.dishFactory = new DishFactory(this)
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
    }

    public startScene(key: string, scene: typeof Phaser.Scene): Phaser.Scene
    {
        return SceneManager.getGame().scene.add(key, scene, true, {game: this}) as Phaser.Scene
    }

    public getWorlds(): World[]
    {
        return this._worlds.values()
    }

    public createClientWorld(): World
    {
        return this.createWorld(WorldType.CLIENT)
    }

    public createServerWorld(): World
    {
        return this.createWorld(WorldType.SERVER)
    }

    public createWorld(type: WorldType): World
    {
        const id = "World" + Math.random()
        const world = new World(this, type)

        this._worlds.set(id, world);

        return world
    }

    public getPhaser()
    {
        return SceneManager.getGame()
    }
}