import { Entity } from "../entity"

interface IWatchComponentDataOptions {
    minDifference?: number
}

export class Component {
    public Entity!: Entity

    public HasAwaken: boolean = false
    public HasStarted: boolean = false

    public Awake(): void {
        this.HasAwaken = true
    }

    public Start(): void {
        this.HasStarted = true
    }

    public Destroy(): void {
        this.HasAwaken = false
        this.HasStarted = false
    }

    public PreStep(delta: number): void {}
    public Step(delta: number): void {}
    public PostStep(delta: number): void {}

    public PreUpdate(delta: number): void {}
    public Update(delta: number): void {}
    public PostUpdate(delta: number): void {}

    public ToData(): object | undefined { return undefined }
    public FromData(data: object | undefined): void {}


    public WatchingValues: {[key: string]: IWatchComponentDataOptions } = {}

    public WatchDataValue(key: string, options: IWatchComponentDataOptions): void {
        this.WatchingValues[key] = options
    }
}