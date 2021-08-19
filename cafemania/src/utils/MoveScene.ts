/*
Need to fix this mess in the constructor someday..
*/

export interface MPixelConfig
{
    interval: number
    offset?: number
}

export class MoveScene
{
    private _mPixelsX: MPixelConfig = {interval: 1}
    private _mPixelsY: MPixelConfig = {interval: 1}

    private _currentScroll = new Phaser.Math.Vector2()
    private _scene: Phaser.Scene

    constructor(scene: Phaser.Scene)
    {
        this._scene = scene

        const self = this

        //window['setMPixels'] = this.setMPixels.bind(this)

        let pointerDown = false;
        let startPos = new Phaser.Math.Vector2(0, 0)
        let startScenePos = new Phaser.Math.Vector2(0, 0)

        scene.input.on('pointerdown', pointer => {
            pointerDown = true

            startPos.x = pointer.x
            startPos.y = pointer.y

            startScenePos.x = scene.cameras.main.scrollX
            startScenePos.y = scene.cameras.main.scrollY
        });

        scene.input.on('pointerup', () => {
            pointerDown = false
        });

        scene.input.on('pointermove', pointer => {
            if(!pointerDown) return

            const delta = new Phaser.Math.Vector2(startPos.x - pointer.x, startPos.y - pointer.y);

            const zoom = scene.cameras.main.zoom

            this._currentScroll.x = Math.round(startScenePos.x + (delta.x / zoom))
            this._currentScroll.y = Math.round(startScenePos.y + (delta.y / zoom))
            
            this.updateSceneScroll()
        });
    }

    public updateSceneScroll()
    {
        const currentScroll = this._currentScroll

        while((currentScroll.x - (this._mPixelsX.offset || 0)) % this._mPixelsX.interval != 0) currentScroll.x += 1
        while((currentScroll.y - (this._mPixelsY.offset || 0)) % this._mPixelsY.interval != 0) currentScroll.y += 1

        this._scene.cameras.main.setScroll(currentScroll.x, currentScroll.y)
    }

    public setConfigX(config: MPixelConfig)
    {
        this._mPixelsX = config

        //console.log('x', this._mPixelsX, config)
    }

    public setConfigY(config: MPixelConfig)
    {
        this._mPixelsY = config
    }
}