import Component from "./Component"
import PhysicBodyComponent from "./PhysicBodyComponent"

export default class MovementComponent extends Component
{
    public speed: number = 0.01
    public horizontal: number = 0
    public vertical: number = 0

    public update(delta: number)
    {
        super.update(delta)

        var entity = this.getEntity()
        
        var physicBodyComponent = entity.getComponent(PhysicBodyComponent)
        var matter = entity.getWorld().getScene().matter

        var speed = this.speed
        var directional = false

        var horizontal = this.horizontal
        var vertical = this.vertical
        
        var body = physicBodyComponent.getMainBody()

        var force = {x: 0, y: 0}

        if(body)
        {
            if(directional)
            {
                var direction = body.angle

                force.x = Math.cos(direction) * speed
                force.y = Math.sin(direction) * speed
            }
            else
            {
                force.x = horizontal * speed
                force.y = vertical * speed
            }

            matter.applyForce(body, {x: force.x * delta, y: force.y * delta})
        }
    }

}