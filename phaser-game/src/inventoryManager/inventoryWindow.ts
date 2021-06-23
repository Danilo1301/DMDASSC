import { InventoryComponent } from "@phaserGame/components"
import { GameObjects } from "phaser"
import { InventoryManager } from "./inventoryManager"
import { Slot } from "./slot"

class InventoryWindowTitle
{
    private _scene: Phaser.Scene

    private _title: GameObjects.Rectangle
    private _close: GameObjects.Rectangle

    private _moving: boolean = false
    
    private _startPos = {x: 0, y: 0}
    private _startMousePos = {x: 0, y: 0}

    private _inventoryWindow: InventoryWindow

    constructor(scene: Phaser.Scene, inventoryWindow: InventoryWindow)
    {
        this._scene = scene
        this._inventoryWindow = inventoryWindow

        this._scene.input.on("pointerup", () => {
            this._moving = false
        })

        this._title = this._scene.add.rectangle(150, 15, 300, 30, 0x000000)
        this._close = this._scene.add.rectangle(300 - 15, 15, 30, 30, 0xff0000)

        this._title.setInteractive()
        this._close.setInteractive()


        this._close.on("pointerdown", () => {
            InventoryManager.CloseInventoryWindow(this._inventoryWindow._inventoryComponent)
        })

        this._title.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            if(!this._moving)
            {
                this._moving = true

                this._startMousePos.x = pointer.x
                this._startMousePos.y = pointer.y

                this._startPos.x = this._scene.cameras.main.x
                this._startPos.y = this._scene.cameras.main.y
            }
        })

    
        this._scene.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      
            if(this._moving)
            {
                var currentMousePos = {x: pointer.x, y: pointer.y}

                var deltaMouse = {x: currentMousePos.x - this._startMousePos.x, y: currentMousePos.y - this._startMousePos.y}

                this._scene.cameras.main.setPosition(this._startPos.x + deltaMouse.x, this._startPos.y + deltaMouse.y)
            }
        })
    }

    public Destroy()
    {
        this._title.destroy()
        this._close.destroy()
    }
}

export class InventoryWindow
{
    private _slots: Slot[] = []

    private _scene: Phaser.Scene

    public _inventoryComponent: InventoryComponent

    private _id: string

    private _title?: InventoryWindowTitle

    public get Id() { return this._id }

    constructor(id: string, scene: Phaser.Scene, inventoryComponent: InventoryComponent)
    {
        this._id = id
        this._scene = scene
        this._inventoryComponent = inventoryComponent

        this._scene.cameras.main.setSize(300, 300)

        this.SetPosition(Math.random()*600, Math.random()*50 + 50)

        

        
        
        //
        this.CreateSlot(150 + -110, 60)
        this.CreateSlot(150 + 0, 60)
        this.CreateSlot(150 + 110, 60)
        //

        
        

        this.UpdateVisuals()

        inventoryComponent.Events.on("slots_updated", this.UpdateVisuals, this)

        setInterval(this.Update.bind(this), 1)
    }

    public CreateMovableTitle()
    {
        this._title = new InventoryWindowTitle(this._scene, this)
    }

    public SetPosition(x: number, y: number)
    {
        this._scene.cameras.main.setPosition(x, y)
    }

    public UpdateVisuals()
    {
        console.log(`Inventory ${this.Id} UpdateVisuals`)

        for (const slotData of this._inventoryComponent._slots) {

            var slot = this.GetSlot(slotData.Index)

            slot.SetItem(undefined)

            if(slotData.Item)
            {
                slot.SetItem(slotData.Item)
            }
        }
    }

    public Close()
    {
        console.log("close")

        this.DestroyVisuals()

        this._title?.Destroy()

        this._inventoryComponent.Events.removeListener("slots_updated", undefined, this)
        
    }

    public DestroyVisuals()
    {
        for (const slot of this._slots) {
            slot.Destroy()
        }
    }

    public Update()
    {
        for (const slot of this._slots) slot.Update()
    }

    public CreateSlot(x: number, y: number): Slot
    {
        var slot = new Slot(this._scene, this, x, y)

        slot.Awake()
        slot.Start()

        this._slots.push(slot)

        slot._index = this._slots.indexOf(slot)

        console.log(`[InventoryWindow] Create slot`)

        return slot
    }

    public GetSlot(index: number)
    {
        return this._slots[index]
    }
}