import { BaseScene } from '@cafemania/scenes/BaseScene';
import { Tile } from '@cafemania/tile/Tile';
import { TileTextureGenerator } from '@cafemania/tile/TileTextureGenerator';
import { MoveScene } from '@cafemania/utils/MoveScene';
import { SpriteSheetOrganizer } from '@cafemania/utils/SpriteSheetOrganizer';

export class Test2Scene extends BaseScene
{
    public preload(): void
    {
        this.load.setPath('/static/cafemania/assets/')

        /*
        this.load.image('tile1', 'tile1.png')
        this.load.image('block1', 'block1.png')
        this.load.image('1x1white', '1x1white.png')
        */
    }

    public create(): void
    {
        window['scene'] = this
        window['Tile'] = Tile

        const moveScene = new MoveScene(this);

        this.cameras.main.setBackgroundColor(0x00137F)
        this.cameras.main.setOrigin(0)
        this.cameras.main.setZoom(1)

        this.createTileMap(10, 10)

        this.startTest2()
    }

    private startTest2()
    {
        const texture = TileTextureGenerator.create(
            this,
            'block1',
            'newBlockSheet',
            new Phaser.Math.Vector2(452, 152),
            new Phaser.Math.Vector2(3, 2),
            new Phaser.Math.Vector2(2, 2)
        )

        for (let y = 0; y < 2; y++)
        {
            for (let x = 0; x < 3; x++)
            {
                const key = `${x}:${y}`

                if(!texture.has(key)) continue

                const position = Tile.getTilePosition(x, y)

                position.y += Tile.SIZE.y

                const image = this.add.image(position.x, position.y, texture.key)
                image.texture.setFilter(Phaser.Textures.FilterMode.LINEAR)
                image.setOrigin(0, 1)
                image.setFrame(key)
                image.setAlpha(1)
                image.setDepth(10)
            }
        }

        
    }

    private startTest1()
    {
        interface IT {
            width: number
            heigth: number
            x: number
            y: number
        }

        const items: IT[] = []

        const sheet = new SpriteSheetOrganizer()

        for (let i = 0; i < 16; i++)
        {
            const item: IT = {
                width: Math.round(Math.random()*0+300),
                heigth: Math.round(Math.random()*300+300),
                x: 0,
                y: 0
            }

            items.push(item)

            sheet.addItem(`${i}`, item.width, item.heigth)
        }
  
        const graphics = this.add.graphics()
        
        graphics.fillStyle(0xffffff)
        graphics.fillRect(0, 0, sheet.width, sheet.height)

        items.map((item, index) =>
        {
            const position = sheet.getItemPosition(`${index}`)

            graphics.fillStyle(0xff0000 + Math.random()*1000000)
            graphics.fillRect(position.x, position.y, item.width, item.heigth)
        })

        
        graphics.setAlpha(0.5)
    }

    public cutTile(x: number, y: number, sizex: number, sizey: number)
    {
        const bounds = Tile.getTileGridBounds(sizex, sizey)
        const originTilePosition = {x: 452, y: 152}
        const texture = this.textures.get('block1')
        const image = texture.getSourceImage()

        const offsetTop = originTilePosition.y
        const offsetBottom = image.height - bounds.height - offsetTop - 1
        

        console.log(offsetTop, offsetBottom)

        const cropRect = new Phaser.Geom.Rectangle(
            (originTilePosition.x - Math.floor(Tile.SIZE.x / 2) + 1) + Tile.getTilePosition(x, y).x,
            0, //originTilePosition.y
            Tile.SIZE.x,
            image.height - offsetBottom - bounds.height + Tile.getTilePosition(x, y).y + Tile.SIZE.y - 1

        )
    }

    public addPixel(x: number, y: number, color: number)
    {
        this.add.image(x, y, '1x1white').setTint(color).setOrigin(0, 0)
    }

    public createTileMap(x: number, y: number)
    {
        for (let iy = 0; iy < y; iy++)
        {
            for (let ix = 0; ix < x; ix++)
            {
                const sprite = this.add.image(0, 0, 'tile1')
                sprite.texture.setFilter(Phaser.Textures.FilterMode.NEAREST)
                sprite.setOrigin(0, 0)

                const position = Tile.getTilePosition(ix, iy)

                sprite.setPosition(position.x, position.y)
            }
            
        }
    }

    public update(time: number, delta: number): void
    {
    }
}