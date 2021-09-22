import { IDestroy, IStart, IUpdate } from "@game/utils/Interfaces"
import { BaseEntity } from "./BaseEntity";

export abstract class Component implements IStart, IUpdate, IDestroy {

    public entity: BaseEntity | undefined;
    public priority: number = 0;

    public update(delta: number) {}
    public start() {}
    public destroy() {}

    public toData(): any {}
    public fromData(data: any) {}
}