import Phaser from 'phaser';
import { Logger } from '@cafemania/logger/Logger';
import { TileItemFactory } from '@cafemania/tileItem/TileItemFactory';
import World from '@cafemania/world/World';

export class Game
{
    private _worlds = new Phaser.Structs.Map<string, World>([])

    private _tileItemFactory: TileItemFactory

    constructor()
    {
        this._tileItemFactory = new TileItemFactory(this)
    }

    public start(): void
    {
        Logger.print('Game started', 125)
    }

    public getTileItemFactory(): TileItemFactory
    {
        return this._tileItemFactory
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