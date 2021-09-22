import { Component } from "@game/entity/Component"
import { Entity } from "@game/entity/Entity"
import { PhysicBody } from "./PhysicBody"

export class Position implements Component {

    public entity!: Entity;
    public priority: number = -1000

    private _x: number = 0
    private _y: number = 0

    constructor() {
        //this.watchDataValue('x', {minDifference: 0.05})
        //this.watchDataValue('y', {minDifference: 0.05})
    }
    
    public get x(): number {
        this.retrievePhysicBodyPosition();
        return this._x;
    }

    public get y(): number {
        this.retrievePhysicBodyPosition();
        return this._y;
    }

    private retrievePhysicBodyPosition() {
        /*
        var entity = this.getEntity()

        if(!entity.hasComponent(PhysicBodyComponent)) return
        
        var physicBody = entity.getComponent(PhysicBodyComponent)

        var body = physicBody.getMainBody()

        if(!body) return

        var pos = body.position

        this._x = pos.x
        this._y = pos.y
        */
    }

    public set(x: number, y: number) {
        this._x = x
        this._y = y 
        this.setPhysicBodyPosition()
    }

    private setPhysicBodyPosition()
    {
        
        var entity = this.entity;

        if(!entity.hasComponent(PhysicBody)) return
        
        var physicBody = entity.getComponent(PhysicBody)

        if(!physicBody.getMainBody()) return

        physicBody.setPosition(this._x, this._y);
        
        
    }


    public start() {
        console.log(`[PositionComponent] Start`)
    }

    public update(delta: number) {
 
        if(!this.entity.hasComponent(PhysicBody)) return;

        const physicBody = this.entity.getComponent(PhysicBody);
        const body = physicBody.getMainBody();

        if(!body) return;


        this._x = body.position.x;
        this._y = body.position.y;
        
    }

    public destroy()
    {

    }
    
    public toData() {
        const data = {
            x: this.x,
            y: this.y
        }

        return data
    }

    public fromData(data) {
        const newpos = {x: this.x, y: this.y}

        if(data.x) newpos.x = data.x
        if(data.y) newpos.y = data.y

        this.set(newpos.x, newpos.y)
    }
}