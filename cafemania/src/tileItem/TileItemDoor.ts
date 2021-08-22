import { GameScene } from "@cafemania/scenes/GameScene";
import { Tile } from "@cafemania/tile/Tile";
import { TileCollisionFactory } from "@cafemania/tile/TileCollisionFactory";
import { TileItem } from "./TileItem";
import { TileItemInfo } from "./TileItemInfo";

export class TileItemDoor extends TileItem
{
    private _isOpen: boolean = false

    private _openPercentage: number = 0

    constructor(tileItemInfo: TileItemInfo)
    {
        super(tileItemInfo)

        this.events.on("pointerup", () =>
        {
            this.setOpen(!this._isOpen)
        })

    }

    public render(delta: number)
    {
        super.render(delta)

        const targetOpen = this._isOpen ? 0.7 : 0

        this._openPercentage = Phaser.Math.Linear(this._openPercentage, targetOpen, 0.01 * delta)

        const totalFrames = 2
        const animFrame = Math.round(this._openPercentage * totalFrames)

        this.setAnimIndex(animFrame)
    }

    public setOpen(value: boolean)
    {
        this._isOpen = value
    }
}