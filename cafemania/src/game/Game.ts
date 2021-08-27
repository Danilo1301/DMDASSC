import Phaser from 'phaser';
import { TileItemFactory } from '@cafemania/tileItem/TileItemFactory';
import { World } from '@cafemania/world/World';
import { DishFactory } from '@cafemania/dish/DishFactory';

export class Game {

    public events = new Phaser.Events.EventEmitter()

    private _worlds = new Phaser.Structs.Map<string, World>([])

    private _tileItemFactory: TileItemFactory

    private _dishFactory: DishFactory

    constructor() {
        this._tileItemFactory = new TileItemFactory(this)
        this._dishFactory = new DishFactory(this)
    }

    public getTileItemFactory() { return this._tileItemFactory }
    public getDishFactory() { return this._dishFactory }
    public getWorlds() { return this._worlds.values() }

    public start() {
        console.log('Game started')
    }

    public createWorld() {
        const world = new World(this)
        return this.setupWorld(world)
    }

    public setupWorld<T extends World>(world: T) {
        this._worlds.set(world.id, world);
        return world
    }
}