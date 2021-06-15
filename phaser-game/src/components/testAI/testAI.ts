import { Component } from "@phaserGame/utils";
import { InputHandler } from "..";

export class TestAI extends Component {
    private _interval?: NodeJS.Timeout

    constructor() {
        super()
    }

    public Awake(): void {
        this._interval = setInterval(() => {
            if(!this.Entity) return
            if(!this.Entity.HasComponent(InputHandler)) return

            var inputHandler = this.Entity.GetComponent(InputHandler)

            const getrdn = function() {
                return Math.random() > 0.5
            }

            inputHandler.SetKeyDown(65, getrdn())
            inputHandler.SetKeyDown(68, getrdn())
            inputHandler.SetKeyDown(87, getrdn())
            inputHandler.SetKeyDown(83, getrdn())  
        }, 300)
    }
    
    public Update(delta: number): void {
    }

    public Destroy(): void {
        if(this._interval) clearInterval(this._interval)
    }
}