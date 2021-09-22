import { Component } from "@game/entity/Component";
import { Entity } from "@game/entity/Entity";
import { Position } from "./Position";

export class EntityDebug implements Component {
    public toData() {
        
    }
    public fromData(data: any) {
       
    }

    public entity!: Entity;
    public priority: number = 100;

    private _positionComponent!: Position

    private _text?: Phaser.GameObjects.Text;

    private _lines: {[key: string]: string} = {};

    public start(): void {
        this._positionComponent = this.entity.getComponent(Position);

        this._text = this.entity.world.scene.add.text(100, 100, 'TEXT');

        console.log(`[EntityDebug] Start`)
    }

    public setLineText(lineId: string, text?: string) {
        if(text == undefined) {
            delete this._lines[lineId];
            return;
        }
        
        this._lines[lineId] = text;
    }

    public update(delta: number): void {
        const position = this._positionComponent;
        const text = this._text;

        if(!position) return;
        if(!text) return;

        

        let strLines = '';
        for (const key in this._lines) {
            strLines += this._lines[key] + "\n";
        }

        const str = `${this.entity.constructor.name}\n${this.entity.id}\n${position.x}, ${position.y}\n${strLines}`;

        text.setPosition(this._positionComponent.x, this._positionComponent.y);
        text.setText(str);
    }

    public destroy(): void {
        this._text?.destroy();
    }
}