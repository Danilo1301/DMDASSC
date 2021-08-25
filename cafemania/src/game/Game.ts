import Phaser from 'phaser';
import { TileItemFactory } from '@cafemania/tileItem/TileItemFactory';
import { World } from '@cafemania/world/World';
import { DishFactory } from '@cafemania/dish/DishFactory';
import { WorldClient } from '@cafemania/world/WorldClient';
import { WorldServer } from '@cafemania/world/WorldServer';

export class Game
{
    public events = new Phaser.Events.EventEmitter()

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

    //name mistake lol
    public getDishItemFactory(): DishFactory
    {
        return this._dishFactory
    }

    public getWorlds(): World[]
    {
        return this._worlds.values()
    }

    public setupWorld<T extends World>(world: T): T
    {
        this._worlds.set(world.id, world);
        return world
    }
}