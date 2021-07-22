import Tile from "@cafemania/world/tile/Tile"

export default class TileCollisionFactory {
    public static getBlockCollisionPoints(offsetX: number, offsetY: number, height: number)
    {
        const x = Tile.SIZE.x
        const y = Tile.SIZE.y
        const h = height

        const points: Phaser.Math.Vector2[] = [
            new Phaser.Math.Vector2( x/2,   -h),
            new Phaser.Math.Vector2( x,     y/2 - h ),
            new Phaser.Math.Vector2( x,     y/2 ),
            new Phaser.Math.Vector2( x/2,   y),
            new Phaser.Math.Vector2( 0,     y/2),
            new Phaser.Math.Vector2( 0,     y/2 - h)
        ]

        if(offsetX != 0)
        {
            points[0].add(this.moveAlongXY(offsetX, 0))
            points[1].add(this.moveAlongXY(-offsetX, 0))
            points[2].add(this.moveAlongXY(-offsetX, 0))
            points[3].add(this.moveAlongXY(-offsetX, 0))
            points[4].add(this.moveAlongXY(offsetX, 0))
            points[5].add(this.moveAlongXY(offsetX, 0))
        }

        if(offsetY != 0)
        {
            points[0].add(this.moveAlongXY(0, offsetY))
            points[1].add(this.moveAlongXY(0, offsetY))
            points[2].add(this.moveAlongXY(0, offsetY))
            points[3].add(this.moveAlongXY(0, -offsetY))
            points[4].add(this.moveAlongXY(0, -offsetY))
            points[5].add(this.moveAlongXY(0, -offsetY))
        }

        return points
    }

    public static moveAlongXY(moveX: number, moveY: number)
    {
        var baseTileSize = Tile.SIZE
        var pos = new Phaser.Math.Vector2(0, 0);

        pos.x += moveX * baseTileSize.x / 2 / 100;
        pos.y += moveX * baseTileSize.y / 2 / 100;

        pos.x += moveY * -baseTileSize.x / 2 / 100;
        pos.y += moveY * baseTileSize.y / 2 / 100;

        return pos;
    }
}