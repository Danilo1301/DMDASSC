import BasicMovement from "@game/components/BasicMovement";
import { EntityDebug } from "@game/components/EntityDebug";
import { InputHandler } from "@game/components/InputHandler";
import { PhysicBody, PhysicBodyType } from "@game/components/PhysicBody";
import { World } from "@game/world/World";
import { Entity } from "../Entity";



export class EntityChar extends Entity {
    constructor(world: World) {
        super(world);
        
        this.addComponent(new PhysicBody);
        this.addComponent(new BasicMovement());
        this.addComponent(new InputHandler());

        const physicBody = this.getComponent(PhysicBody);
        physicBody.addRectangle('default', 0, 0, 40, 40);
        physicBody.setOptions({
            frictionAir: 0.2,
            mass: 100
        })
    }
}

