import { Component } from "@game/entity/Component";
import { Entity } from "@game/entity/Entity";
import { Input } from "@game/input/Input";

export class InputHandler implements Component {

    public entity!: Entity;
    public priority: number = 0;

    public _isControlledByPlayer: boolean = false;

    private _horizontal: number = 0;
    private _vertical: number = 0;

    public get horizontal() { return this._horizontal; }
    public get vertical() { return this._vertical; }

    public set horizontal(value: number) { this._horizontal = value; }
    public set vertical(value: number) { this._vertical = value; }

    public start() {}

    public setIsControlledByPlayer(value: boolean) {
        this._isControlledByPlayer = value;
    }

    public update(delta: number) {
        if(this._isControlledByPlayer) {
            this._horizontal = Input.getHorizontal();
            this._vertical = Input.getVertical();
        }
    }

    public destroy() {}

    public toData() {
    }
    
    public fromData(data: any) {
    }
}