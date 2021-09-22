import { Component } from "@game/entity/Component"
import { Entity } from "@game/entity/Entity";
import { InputHandler } from "./InputHandler";

export class RandomMovement implements Component {
    public entity!: Entity;
    public priority: number = 0;

    private _lastMoved = 5000

    private _targetPos = { x: 0, y: 0 }

    public start() {
        console.log("da bot moves")
    }

    public destroy() {}

    public update(delta: number): void {
        this._lastMoved += delta

        if(this._lastMoved >= 4000) {
            this._lastMoved = 0

            this._targetPos.x = Math.random()*900
            this._targetPos.y = Math.random()*600
        }

        var entity = this.entity
        
        var inputHandler = entity.getComponent(InputHandler)
        inputHandler.horizontal = 0
        inputHandler.vertical = 0


        var currentPosition = {x: entity.position.x, y: entity.position.y}

        if(currentPosition.x > this._targetPos.x) inputHandler.horizontal = -1
        if(currentPosition.x < this._targetPos.x) inputHandler.horizontal = 1

        if(currentPosition.y > this._targetPos.y) inputHandler.vertical = -1
        if(currentPosition.y < this._targetPos.y) inputHandler.vertical = 1

        if(Phaser.Math.Distance.BetweenPoints(currentPosition, this._targetPos) < 20) {
            inputHandler.horizontal = 0
            inputHandler.vertical = 0
        }
    }

    public toData() {
    }
    
    public fromData(data: any) {
    }
}