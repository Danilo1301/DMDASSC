import { MoveScene, MPixelConfig } from "./MoveScene"

interface ZoomOption
{
    zoom: number
    configX: MPixelConfig
    configY: MPixelConfig
}

export class ZoomManager
{
    private _scene: Phaser.Scene

    private _moveScene: MoveScene

    private _zoomOptions: ZoomOption[] = [
        {zoom: 2, configX: {interval: 1, offset: 0}, configY: {interval: 1, offset: 0}},
        {zoom: 1, configX: {interval: 1, offset: 0}, configY: {interval: 1, offset: 0}},
        //{zoom: 0.75, configX: {interval: 2, offset: 0}, configY: {interval: 1, offset: 0}},
        {zoom: 0.50, configX: {interval: 4, offset: 1}, configY: {interval: 2, offset: 0}},
        {zoom: 0.25, configX: {interval: 4, offset: 3}, configY: {interval: 4, offset: 0}},
    ]

    private _currentZoomIndex: number = 0

    constructor(scene: Phaser.Scene, moveScene: MoveScene)
    {
        this._scene = scene

        this._moveScene = moveScene
    }

    public more()
    {
        if(this._currentZoomIndex == 0) return

        this._currentZoomIndex--
        
        this.updateSceneZoom()
    }

    public less()
    {
        if(this._currentZoomIndex == this._zoomOptions.length-1) return

        this._currentZoomIndex++
        
        this.updateSceneZoom()
    }

    public setZoom(index: number): void
    {
        this._currentZoomIndex = index

        this.updateSceneZoom()
    }

    private updateSceneZoom(): void
    {
        const zoomOption = this._zoomOptions[this._currentZoomIndex]

        this._moveScene.setConfigX(zoomOption.configX)
        this._moveScene.setConfigY(zoomOption.configY)
        this._moveScene.updateSceneScroll()

        this._scene.cameras.main.setZoom(zoomOption.zoom)
    }
}