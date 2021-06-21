import { WorldEntity } from "@phaserGame/utils";
import { Component } from "@phaserGame/utils/component";
import { PhysicBodyComponent } from "../physicBody";
import { PositionComponent } from "../position";

class Sprite {
    public TextureName: string
    public Key: string
    public X: number
    public Y: number

    public Sprite?: Phaser.GameObjects.Sprite

    public AttachedToBody?: MatterJS.BodyType
    public AttachedToBodyKey?: string

    constructor(textureName: string, key: string, x: number = 0, y: number = 0) {
        this.TextureName = textureName
        this.Key = key
        this.X = x
        this.Y = y
    }
}

export class SpriteComponent extends Component {
    public Entity!: WorldEntity

    private _sprites = new Phaser.Structs.Map<string, Sprite>([])

    private _container?: Phaser.GameObjects.Container

    public Events = new Phaser.Events.EventEmitter();
    
    public Awake(): void {
        super.Awake()

        var scene = this.Entity.World.Scene

        this._container = scene.add.container(400, 300);

        scene.tweens.add({
            targets: this._container,
            angle: 360,
            duration: 6000,
            yoyo: true,
            repeat: -1
        });
    }

    public Start(): void {
        super.Start()

        this.CreateSprites()
    }

    public Update(delta: number): void {
        super.Update(delta)

        this.CreateSprites()

        this.UpdateContainerPosition()

        if(!this._container) return

        var container = this._container

        for (const sprite of this._sprites.values()) {
            if(!sprite.Sprite) continue

            var allSprites = container.getAll()

            if(sprite.AttachedToBodyKey) {
                var physicBodyComponent = this.Entity.GetComponent(PhysicBodyComponent)
                var part = physicBodyComponent.GetBodyPart(sprite.AttachedToBodyKey)

                if(part.Body) sprite.AttachedToBody = part.Body
            }

            if(sprite.AttachedToBody) {
                var body = sprite.AttachedToBody

                var angle = body.parent == body ? body.angle : (body.parent.angle + body.angle)
                var position = {
                    x: body.position.x,
                    y: body.position.y
                }

                position.x += Math.cos(angle) * sprite.X
                position.y += Math.sin(angle) * sprite.X

                position.y += -Math.cos(angle) * sprite.Y
                position.x += Math.sin(angle) * sprite.Y
                

                sprite.Sprite.setPosition(position.x, position.y)
                sprite.Sprite.setAngle(Phaser.Math.RadToDeg(angle))
            }

            if(allSprites.includes(sprite.Sprite) && sprite.AttachedToBody) {
                container.remove(sprite.Sprite)

                sprite.Sprite.destroy()
                sprite.Sprite = undefined
            }

            
            //console.log(g)
        }
    }

    private UpdateContainerPosition() {
        if(!this._container) return

        var position = this.Entity.GetComponent(PositionComponent)

        this._container.setPosition(position.X, position.Y)
    }

    public Destroy() {
        super.Destroy()
    }

    public Add(textureName: string, key: string, x: number = 0, y: number = 0): Sprite {
        if(this._sprites.has(key)) throw new Error(`Sprite '${key}' already exists`);
        
        var sprite = new Sprite(textureName, key, x, y)

        this._sprites.set(key, sprite)

        return sprite
    }

    public CreateSprites() {
        var scene = this.Entity.World.Scene

        for (const sprite of this._sprites.values()) {
            if(!sprite.Sprite) {
                //console.log(`Creating sprite ${sprite.Key}`)

                sprite.Sprite = scene.add.sprite(sprite.X, sprite.Y, sprite.TextureName)

                //
                var self = this
                var s = sprite.Sprite
                s.setInteractive()
                s.on('pointerdown', function (pointer) {
                    s.setTint(0x000000)

                    self.Events.emit("pointerdown", pointer)
                });
        
                s.on('pointerup', function (pointer) {
                    s.setTint(0xFFFFFF)
                });

                //

                if(this._container && !sprite.AttachedToBody) this._container.add(sprite.Sprite)

            }
            
        }
    }

    public GetSprite(key: string): Sprite {
        return this._sprites.get(key)
    }
}