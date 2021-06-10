import { IAwake, IUpdate, Entity } from '@phaserGame/utils'

export interface IComponent extends IAwake, IUpdate {
    Entity: Entity | undefined
}