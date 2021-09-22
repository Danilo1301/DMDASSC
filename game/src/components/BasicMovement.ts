import { Component } from "@game/entity/Component"
import { Entity } from "@game/entity/Entity";
import { InputHandler } from "./InputHandler";
import { PhysicBody } from "./PhysicBody";

export default class BasicMovement implements Component {
    public entity!: Entity;
    public priority: number = 0;

    public speed: number = 0.01

    public isDirectional: boolean = false;

    public start() {
    }
    
    public update(delta: number) {

        const entity = this.entity;
        
        const physicBody = entity.getComponent(PhysicBody);
        
        const matter = entity.world.scene.matter;

        const speed = this.speed;
        const directional = this.isDirectional;

        let horizontal = 0;
        let vertical = 0;

        if(entity.hasComponent(InputHandler)) {
            const inputHandler = entity.getComponent(InputHandler);

            horizontal = inputHandler.horizontal;
            vertical = inputHandler.vertical;
        }

        const body = physicBody.getMainBody();

        const force = {x: 0, y: 0}

        if(!body) return;
    
        if(directional) {
            const direction = body.angle

            force.x = Math.cos(direction) * vertical * speed;
            force.y = Math.sin(direction) * vertical * speed;
        } else {
            force.x = horizontal * speed;
            force.y = vertical * speed;
        }

        matter.applyForce(body, {x: force.x * delta, y: force.y * delta})
    }

    public destroy() {

    }

    public toData() {
    }
    
    public fromData(data: any) {
    }
}