import Entity from "../Entity";
import Component from "./Component"

enum BodyType
{
    RECTANGLE,
    CIRCLE
}

class BodyPart
{
    public key: string
    public type: BodyType
    public x: number
    public y: number

    public width: number = 0
    public height: number = 0

    public radius: number = 0

    public body?: MatterJS.BodyType

    constructor(key: string, x: number, y: number, type: BodyType)
    {
        this.key = key
        this.x = x
        this.y = y
        this.type = type
    }
}

export default class PhysicBodyComponent extends Component
{
    private _bodyParts = new Phaser.Structs.Map<string, BodyPart>([])

    private _body?: MatterJS.BodyType

    private _options: MatterJS.IChamferableBodyDefinition = {}

    constructor()
    {
        super()

        this.watchDataValue('velocityX', {minDifference: 0.05})
        this.watchDataValue('velocityY', {minDifference: 0.05})
    }

    public create()
    {
        super.create()
    }

    public start()
    {
        super.start()

        var scene = this.getScene()
        var matter = scene.matter

        if(!this._body)
        {
            var options: MatterJS.IChamferableBodyDefinition = Object.assign({}, this._options)
            
            var parts: MatterJS.BodyType[] = []

            for (const bodyPart of this._bodyParts.values())
            {
                if(bodyPart.type == BodyType.RECTANGLE) bodyPart.body = matter.bodies.rectangle(bodyPart.x, bodyPart.y, bodyPart.width, bodyPart.height, options)
                if(bodyPart.type == BodyType.CIRCLE) bodyPart.body = matter.bodies.circle(bodyPart.x, bodyPart.y, bodyPart.radius, options)

                parts.push(bodyPart.body!)
            }

            options.parts = parts
        
            var body = matter.body.create(options)

            matter.world.add(body)

            this._body = body
        }
    }

    public update(delta: number)
    {
        super.update(delta)
    }

    public destroy()
    {
        super.start()
    }

    private getScene()
    {
        return this.getEntity().getWorld().getScene()
    }

    public setOptions(options: MatterJS.IChamferableBodyDefinition)
    {
        this._options = options
    }

    public getMainBody()
    {
        return this._body
    }

    public addRectangle(key: string, x: number, y: number, width: number, height: number): BodyPart
    {
        var bodyPart = new BodyPart(key, x, y, BodyType.RECTANGLE)

        bodyPart.width = width
        bodyPart.height = height

        this._bodyParts.set(key, bodyPart)

        return bodyPart
    }

    public addCircle(key: string, x: number, y: number, radius: number): BodyPart
    {
        var bodyPart = new BodyPart(key, x, y, BodyType.CIRCLE)

        bodyPart.radius = radius
  
        this._bodyParts.set(key, bodyPart)

        return bodyPart
    }

    public setPosition(x: number, y: number)
    {
        var body = this.getMainBody()!
        var scene = this.getScene()
        var matter = scene.matter

        matter.body.setPosition(body, {x: x, y: y})
    }

    public setVelocity(x: number, y: number)
    {


        var body = this.getMainBody()

        if(!body) return

        var scene = this.getScene()
        var matter = scene.matter

        matter.body.setVelocity(body, {x: x, y: y})
    }

    public getVelocity()
    {
        var body = this.getMainBody()!

        return body.velocity
    }

    public toData()
    {
        if(!this.getMainBody()) return

        var velocity = this.getVelocity()

        return {
            velocityX: velocity.x,
            velocityY: velocity.y
        }
    }

    public fromData(data)
    {
        if(!this.getMainBody()) return

        var velocity = this.getVelocity()
        var newvelocity = {x: velocity.x, y: velocity.y}

        if(data.velocityX) newvelocity.x = data.velocityX
        if(data.velocityY) newvelocity.y = data.velocityY

        this.setVelocity(newvelocity.x, newvelocity.y)
    }
}