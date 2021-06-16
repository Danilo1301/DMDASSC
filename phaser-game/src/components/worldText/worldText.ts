import { Component, WorldEntity } from "@phaserGame/utils";
import { Position } from "../position";

export interface WorldTextData {
    text?: string
}

export class WorldText extends Component {
    public Entity: WorldEntity | undefined

    public Text?: Phaser.GameObjects.Text

    private _text?: string

    constructor(data?: WorldTextData) {
        super()

        if(data) this.FromData(data)
    }

    public Awake(): void {
        var style = { align: 'center' };

        this.Text = this.Entity?.World.Scene.add.text(0, 0, this._text || "", style)
        this.Text?.setAlign()

    }
    
    public Update(delta: number): void {
        var position = this.Entity?.GetComponent(Position)

        if(!position) return

        this.Text?.setPosition(position.X, position.Y)
    }

    public Destroy(): void {

    }

    public FromData(data: WorldTextData) {
        if(data.text) this._text = data.text
    }

    public ToData(): WorldTextData {
        var data: WorldTextData = {
            text: this._text
        }

        return data
    }
}