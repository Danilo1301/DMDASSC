import { GameScene } from "@cafemania/scenes/GameScene";
import { Tile } from "@cafemania/tile/Tile";
import { TileCollisionFactory } from "@cafemania/tile/TileCollisionFactory";
import { Direction } from "@cafemania/utils/Direction";
import { TileItem } from "./TileItem";
import { TileItemInfo, TileItemType } from "./TileItemInfo";

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

    public onAddedToTile(tile: Tile)
    {
        //console.log("Door added to tile")
    }

    public onRemovedFromTile(tile: Tile)
    {
        //console.log("Door removed from tile")
    }

    public updateSprites()
    {
        super.updateSprites()

        const wall = this.getWallBehind()

        if(wall) wall.events.emit("update_sprites")
    }

    public getWallBehind()
    {
        //console.log(this.direction)

        const findDirection = this.direction == Direction.EAST ? Direction.WEST : Direction.SOUTH

        const offset = Tile.getOffsetFromDirection(findDirection)

        //console.log(offset)

        const tile = this.getTile().getTileInOffset(offset.x, offset.y)

        if(!tile) return

     
        const walls = tile.getTileItemsOfType(TileItemType.WALL)

        //console.log(walls)

        if(walls.length == 0) return

        return walls[0]
    }

}