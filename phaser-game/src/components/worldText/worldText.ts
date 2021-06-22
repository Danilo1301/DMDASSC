import { WorldEntity } from "@phaserGame/utils";
import { Component } from "@phaserGame/utils/component";
import { PositionComponent } from "../position";

interface WorldTextComponentData
{
    text?: string
}

export class WorldTextComponent extends Component
{
    public Entity!: WorldEntity

    private _text?: Phaser.GameObjects.Text
    private _textContent?: string

    constructor(data?: WorldTextComponentData)
    {
        super()

        this.WatchDataValue('text', {})

        if(data) this.FromData(data)
    }

    public Start(): void
    {
        super.Start()

        var scene = this.Entity.World.Scene
        
        var text = this._textContent || ""

        this._text = scene.add.text(0, 0, text)
        this._text.setDepth(1)
    }

    public Update(delta: number): void
    {
        super.Update(delta)

        if(this._text)
        {
            var text = this._textContent || ""

            if(this._text.text != this._textContent)
            {
                this._text.setText(text)
            }

            var position = this.Entity.GetComponent(PositionComponent)

            this._text.setPosition(position.X, position.Y)
        }
    }

    public Destroy(): void
    {
        super.Destroy()

        this._text?.destroy()
    }

    public ToData(): WorldTextComponentData
    {
        var data: WorldTextComponentData = {
            text: this._textContent
        }

        return data
    }

    public FromData(data: WorldTextComponentData)
    {
        if(data.text) this._textContent = data.text

        return data
    }
}