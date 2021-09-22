import { InputHandler } from "@game/components/InputHandler"
import { Position } from "@game/components/Position";
import { Entity } from "@game/entity/Entity"

export default class LocalPlayer
{
    public static isMultiplayer: boolean = false;

    private static _entity: Entity
    private static _entityId?: string

    public static get entity() { return this._entity; }
    public static get entityId() { return this._entityId; }

    public static setEntity(entity: Entity) {
        if(this._entity) this._entity.getComponent(InputHandler).setIsControlledByPlayer(false);

        this._entity = entity

        entity.getComponent(InputHandler).setIsControlledByPlayer(true);
        
        var camera = entity.world.scene.cameras.main

        camera.startFollow(entity.getComponent(Position), true, 0.1, 0.1)
        camera.setZoom(1.0)
    }

    public static setEntityId(entityId: string) {
        this._entityId = entityId
    }


}