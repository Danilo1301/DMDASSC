import { InputHandlerComponent } from "@phaserGame/entity/component/InputHandlerComponent";
import PositionComponent from "@phaserGame/entity/component/PositionComponent";
import Entity from "@phaserGame/entity/Entity";

export default class LocalPlayer
{
    private static _entityId?: string

    private static _entity: Entity

    public static getEntity()
    {
        return this._entity
    }

    public static setEntity(entity: Entity)
    {
        if(this._entity) this._entity.getComponent(InputHandlerComponent).setControlledByPlayer(false)

        this._entity = entity

        entity.getComponent(InputHandlerComponent).setControlledByPlayer(true)
        
        var camera = entity.getWorld().getScene().cameras.main

        camera.startFollow(entity.getComponent(PositionComponent), true, 0.1, 0.1)
        camera.setZoom(1.5)
    }

    public static setEntityId(entityId: string) {
        this._entityId = entityId
    }

    public static getEntityId() {
        return this._entityId
    }
}