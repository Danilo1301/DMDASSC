import Phaser from 'phaser';
import { TileItemFactory } from '@cafemania/tileItem/TileItemFactory';
import { World } from '@cafemania/world/World';
import DishFactory from '@cafemania/dish/DishFactory';

export class Game
{
    private _worlds = new Phaser.Structs.Map<string, World>([])

    private _tileItemFactory: TileItemFactory
    private _dishFactory: DishFactory

    constructor()
    {
        this._tileItemFactory = new TileItemFactory(this)
        this._dishFactory = new DishFactory(this)
    }

    public start(): void
    {
        console.log('Game started')
    }

    public getTileItemFactory(): TileItemFactory
    {
        return this._tileItemFactory
    }

    public getDishItemFactory(): DishFactory
    {
        return this._dishFactory
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
}