import { Component } from "@game/entity/Component";
import { Entity } from "@game/entity/Entity";
import { Position } from "./Position";

export enum PhysicBodyType {
    RECTANGLE,
    CIRCLE
}

class BodyPart {
    
    public key: string;
    public type: PhysicBodyType;
    public x: number;
    public y: number;

    public width: number = 0;
    public height: number = 0;

    public radius: number = 0;

    public body?: MatterJS.BodyType;

    constructor(key: string, x: number, y: number, type: PhysicBodyType) {
        this.key = key;
        this.x = x;
        this.y = y;
        this.type = type;
    }
}

export class PhysicBody implements Component {

    public entity!: Entity;
    public priority: number = 0;

    private _positionComponent!: Position

    private _bodyParts = new Phaser.Structs.Map<string, BodyPart>([])

    private _body?: MatterJS.BodyType

    private _options: MatterJS.IChamferableBodyDefinition = {}

    public start(): void {
        this._positionComponent = this.entity.getComponent(Position);
    }

    public getMainBody() { return this._body; }

    public addRectangle(key: string, x: number, y: number, width: number, height: number) {
        const bodyPart = new BodyPart(key, x, y, PhysicBodyType.RECTANGLE);

        bodyPart.width = width;
        bodyPart.height = height;

        this._bodyParts.set(key, bodyPart);

        return bodyPart;
    }

    public addCircle(key: string, x: number, y: number, radius: number): BodyPart
    {
        var bodyPart = new BodyPart(key, x, y, PhysicBodyType.CIRCLE);

        bodyPart.radius = radius;
  
        this._bodyParts.set(key, bodyPart);

        return bodyPart;
    }

    public setOptions(options: MatterJS.IChamferableBodyDefinition) {
        this._options = options;
    }

    public update(delta: number): void {
        var scene = this.entity.world.scene;
        var matter = scene.matter;

        if(!this._body)
        {
            var options: MatterJS.IChamferableBodyDefinition = Object.assign({}, this._options)
            
            var parts: MatterJS.BodyType[] = []

            for (const bodyPart of this._bodyParts.values())
            {
                if(bodyPart.type == PhysicBodyType.RECTANGLE) bodyPart.body = matter.bodies.rectangle(bodyPart.x, bodyPart.y, bodyPart.width, bodyPart.height, options)
                if(bodyPart.type == PhysicBodyType.CIRCLE) bodyPart.body = matter.bodies.circle(bodyPart.x, bodyPart.y, bodyPart.radius, options)

                parts.push(bodyPart.body!)
            }

            options.parts = parts
        
            var body = matter.body.create(options)

            matter.world.add(body)

            this._body = body

            this.setPosition(this._positionComponent.x, this._positionComponent.y);
        }

        
    }

    public setPosition(x: number, y: number)
    {
        var body = this.getMainBody()!
        var scene =  this.entity.world.scene;
        var matter = scene.matter

        matter.body.setPosition(body, {x: x, y: y})
    }

    public setVelocity(x: number, y: number)
    {
        var body = this.getMainBody()

        if(!body) return

        var scene = this.entity.world.scene;
        var matter = scene.matter

        matter.body.setVelocity(body, {x: x, y: y})
    }

    public getVelocity()
    {
        var body = this.getMainBody()!

        return body.velocity
    }

    public toData()
    {
        if(!this.getMainBody()) return

        var velocity = this.getVelocity()

        return {
            velocityX: velocity.x,
            velocityY: velocity.y
        }
    }

    public fromData(data)
    {
        if(!this.getMainBody()) return

        var velocity = this.getVelocity()
        var newvelocity = {x: velocity.x, y: velocity.y}

        if(data.velocityX) newvelocity.x = data.velocityX
        if(data.velocityY) newvelocity.y = data.velocityY

        this.setVelocity(newvelocity.x, newvelocity.y)
    }

    public destroy(): void {
        
    }
}