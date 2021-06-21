import { WorldEntity } from "@phaserGame/utils";
import { Component } from "@phaserGame/utils/component";

class BodyPart {
    public Key: string
    public Type: BodyType
    public X: number
    public Y: number

    public Width: number = 0
    public Height: number = 0

    public Radius: number = 0

    public Body?: MatterJS.BodyType

    constructor(key: string, x: number, y: number, type: BodyType) {
        this.Key = key
        this.X = x
        this.Y = y
        this.Type = type
    }
}

enum BodyType {
    RECTANGLE,
    CIRCLE
}

export class PhysicBodyComponent extends Component {
    public Entity!: WorldEntity

    private _bodyParts = new Phaser.Structs.Map<string, BodyPart>([])
    private _body?: MatterJS.BodyType

    public Options: MatterJS.IChamferableBodyDefinition = {}

    public Awake(): void {
        super.Awake()
    }

    public Start(): void {
        super.Start()

        var scene = this.Entity.World.Scene
        var matter = scene.matter
        

        if(!this._body) {
      
            var options: MatterJS.IChamferableBodyDefinition = Object.assign({}, this.Options)
            

            var parts: MatterJS.BodyType[] = []

            for (const bodyPart of this._bodyParts.values()) {

                if(bodyPart.Type == BodyType.RECTANGLE) bodyPart.Body = matter.bodies.rectangle(bodyPart.X, bodyPart.Y, bodyPart.Width, bodyPart.Height, options)
                if(bodyPart.Type == BodyType.CIRCLE) bodyPart.Body = matter.bodies.circle(bodyPart.X, bodyPart.Y, bodyPart.Radius, options)

                parts.push(bodyPart.Body!)
            }

            options.parts = parts
            

            var body = matter.body.create(options)


            matter.world.add(body)

            this._body = body
        }
        
    }

    public GetBodyPart(key: string) {
        return this._bodyParts.get(key)
    }

    public get DefaultBody() {
        return this._body
    }

    public Update(delta: number): void {
        super.Update(delta)
    }
   
    public Destroy() {
        super.Destroy()
    }

    public AddRectangle(key: string, x: number, y: number, width: number, height: number): BodyPart {
        var bodyPart = new BodyPart(key, x, y, BodyType.RECTANGLE)

        bodyPart.Width = width
        bodyPart.Height = height

        this._bodyParts.set(key, bodyPart)

        return bodyPart
    }

    public AddCircle(key: string, x: number, y: number, radius: number): BodyPart {
        var bodyPart = new BodyPart(key, x, y, BodyType.CIRCLE)

        bodyPart.Radius = radius
  
        this._bodyParts.set(key, bodyPart)

        return bodyPart
    }

    public SetPosition(x: number, y: number) {
        var body = this.DefaultBody!
        var scene = this.Entity.World.Scene
        var matter = scene.matter

        matter.body.setPosition(body, {x: x, y: y})
    }
}