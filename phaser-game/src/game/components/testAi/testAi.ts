import { Entity, IComponent } from "@phaserGame/utils"
import { InputHandler } from "../inputHandler"

export class TestAI implements IComponent {
    public Entity!: Entity
    public HasAwaken: boolean = false

    public Awake(): void {
        setInterval(() => {
            var inputHandler = this.Entity?.GetComponent(InputHandler)

            const getrdn = function() {
                return Math.random() > 0.5
            }

            if(inputHandler) {
                inputHandler.SetKeyDown("LEFT", getrdn())
                inputHandler.SetKeyDown("RIGHT", getrdn())
                inputHandler.SetKeyDown("UP", getrdn())
                inputHandler.SetKeyDown("DOWN", getrdn())
            }
        }, 300)
    }

    public Update(deltaTime: number): void {
        
    }

    public Destroy(): void {
        
    }
}