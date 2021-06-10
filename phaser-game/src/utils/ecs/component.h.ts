import { IAwake, IUpdate, Entity } from '@phaserGame/utils'
import { IDestroy } from '../lifecycle';

export interface IComponent extends IAwake, IUpdate, IDestroy {
    Entity: Entity | undefined
}