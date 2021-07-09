import Entity from "../Entity";
import Component from "./Component"
import PhysicBodyComponent from "./PhysicBodyComponent";

export default class PositionComponent extends Component
{
    private _x: number = 0

    private _y: number = 0

    constructor()
    {
        super()

        this.watchDataValue('x', {minDifference: 0.05})
        this.watchDataValue('y', {minDifference: 0.05})
    }

    public get x(): number {
        this.retrievePhysicBodyPosition()
        return this._x
    }

    public get y(): number {
        this.retrievePhysicBodyPosition()
        return this._y
    }

    private retrievePhysicBodyPosition()
    {
        var entity = this.getEntity()

        if(!entity.hasComponent(PhysicBodyComponent)) return
        
        var physicBody = entity.getComponent(PhysicBodyComponent)

        var body = physicBody.getMainBody()

        if(!body) return

        var pos = body.position

        this._x = pos.x
        this._y = pos.y
    }

    public set(x: number, y: number) {
        this._x = x
        this._y = y
        
        this.setPhysicBodyPosition()
    }

    private setPhysicBodyPosition()
    {
        var entity = this.getEntity()

        if(!entity.hasComponent(PhysicBodyComponent)) return
        
        var physicBody = entity.getComponent(PhysicBodyComponent)

        if(!physicBody.getMainBody()) return

        physicBody.setPosition(this._x, this._y)
        
    }

    public create()
    {
        super.create()
    }

    public start()
    {
        super.start()
    }

    public update(delta: number)
    {
        super.update(delta)

    }

    public destroy()
    {
        super.start()

        console.log("PositionComponent destroy")
    }
    
    public toData()
    {
        var data = {
            x: this.x,
            y: this.y
        }

        return data
    }

    public fromData(data)
    {
        var newpos = {x: this.x, y: this.y}

        if(data.x) newpos.x = data.x
        if(data.y) newpos.y = data.y

        this.set(newpos.x, newpos.y)
    }
}