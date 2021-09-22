import { EntityDebug } from "@game/components/EntityDebug";
import { Position } from "@game/components/Position";
import { World } from "@game/world/World";
import { BaseEntity } from "./BaseEntity";
import { v4 as uuidv4 } from 'uuid';

export class Entity extends BaseEntity {
    public world: World;
    
    public position: Position;

    private _id: string;

    constructor(world: World) {
        super();

        this._id = uuidv4();

        this.world = world;

        this.addComponent(new Position());
        this.addComponent(new EntityDebug());

        this.position = this.getComponent(Position);
    }

    public get id() { return this._id; }

    public setId(id: string) {
        this._id = id;
    }
}