import Component from "./Component"
import MovementComponent from "./MovementComponent"
import PositionComponent from "./PositionComponent"

interface WorldTextComponentData
{
    text?: string
}

export class WorldTextComponent extends Component {

    private _text?: Phaser.GameObjects.Text

    private _textContent?: string

    constructor(data: WorldTextComponentData)
    {
        super()

        this.watchDataValue('text', {})

        if(data) this.fromData(data)
    }

    public start()
    {
        super.start()

        var text = this._textContent || ""

        this._text = this.getEntity().getWorld().getScene().add.text(0, 0, text)
        this._text.setDepth(1)
    }

    public update(delta: number): void {
        super.update(delta)

        if(this._text)
        {
            var text = this._textContent || ""

            if(this._text.text != this._textContent)
            {
                this._text.setText(text)
            }

            var positionComponent = this.getEntity().getComponent(PositionComponent)

            this._text.setPosition(positionComponent.x, positionComponent.y)
        }

        

        
    }

    public toData(): WorldTextComponentData
    {
        var data: WorldTextComponentData = {
            text: this._textContent
        }

        return data
    }

    public fromData(data: WorldTextComponentData)
    {
        if(data.text) this._textContent = data.text

        return data
    }
}