import { Logger } from '@cafemania/logger/Logger';
import { BaseScene } from '@cafemania/scenes/BaseScene';


export class Test1Scene extends BaseScene
{
    public preload(): void
    {
        this.load.setPath('/static/cafemania/assets/')

        this.load.image('tests/test1/image', 'tests/test1/image.png')
    }

    public create(): void
    {
        window['scene'] = this

        this.cameras.main.setBackgroundColor(0x000000)

        Logger.print('helo')

        const d = 50


        const spriteglt = this.add.image(0, 0, 'yosh')
        spriteglt.setOrigin(0, 0)
        spriteglt.setPosition(0, 0)

        const spriteglt2 = this.add.image(0, 0, 'yosh2')
        spriteglt2.setOrigin(0, 0)
        spriteglt2.setPosition(d, 0)

        this.cameras.main.setOrigin(0)
        this.cameras.main.setZoom(5)
    }

    private setupInputs(): void
    {
        this.input.keyboard.on('keydown', event => {
            console.log(event)
        });
    }

    public update(time: number, delta: number): void
    {
    }
}