import Entity from "../Entity";

interface IWatchComponentDataOptions {
    minDifference?: number
}

export default class Component
{
    private _entity?: Entity

    private _started: boolean = false

    public setEntity(entity: Entity)
    {
        this._entity = entity
    }

    public getEntity()
    {
        return this._entity!
    }

    public hasStarted()
    {
        return this._started
    }

    public create() {}

    public start()
    {
        this._started = true
    }
    
    public destroy()
    {
        this._started = false
    }

    public step(delta: number)
    {
        //console.log("entity.step")
    }

    public update(delta: number)
    {
    }

    public toData(): any {}
    public fromData(data: any): void {}

    public watchingValues: {[key: string]: IWatchComponentDataOptions } = {}

    public watchDataValue(key: string, options: IWatchComponentDataOptions): void {
        this.watchingValues[key] = options
    }
}