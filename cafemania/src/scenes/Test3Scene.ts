import { BaseScene } from '@cafemania/scenes/BaseScene';

export class Test3Scene extends BaseScene
{
    public preload(): void
    {
        this.load.setPath('/static/cafemania/assets/')
        
    }

    public create(): void
    {
        //this.add.image(0, 0, 'tile1')
    }

    public update(time: number, delta: number): void
    {
    }
}