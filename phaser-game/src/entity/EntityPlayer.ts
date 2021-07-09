import { InputHandlerComponent } from "./component/InputHandlerComponent";
import MovementComponent from "./component/MovementComponent";
import PhysicBodyComponent from "./component/PhysicBodyComponent";
import PositionComponent from "./component/PositionComponent";
import { RandomMovementComponent } from "./component/RandomMovementComponent";
import { WorldTextComponent } from "./component/WorldTextComponent";
import Entity from "./Entity";

export default class EntityPlayer extends Entity
{
    public initialize()
    {
        super.initialize()

        this.addComponent(new PositionComponent())
        this.addComponent(new PhysicBodyComponent())
        this.addComponent(new MovementComponent())
        this.addComponent(new InputHandlerComponent())
        this.addComponent(new WorldTextComponent({text: "EntityPlayer"}))

        var physicBodyComponent = this.getComponent(PhysicBodyComponent)
        physicBodyComponent.setOptions({
            frictionAir: 0.2,
            mass: 100
        })
        physicBodyComponent.addCircle('body', 0, 0, 16)
        
        

        /*
        var spriteComponent = this.GetComponent(SpriteComponent)
        var sprite_body = spriteComponent.Add('player1', 'body', 0, 0)
        sprite_body.AttachedToBodyKey = 'body'
        */
    }

    public getPosition()
    {
        return this.getComponent(PositionComponent)
    }

    public update(delta: number)
    {
        super.update(delta)
    }
    
}