class Visualizer
{
    constructor(pathFind: PathFind, scene: Phaser.Scene)
    {

    }
}

export class Node
{
    public x: number
    public y: number
    public isWalkable: boolean

    public gScore: number = 0
    public hScore: number = 0
    public fScore: number = 0

    public cameFromNode?: Node

    constructor(x: number, y: number, isWalkable: boolean)
    {
        this.x = x
        this.y = y
        this.isWalkable = isWalkable
    }
}

export default class PathFind
{
    private _nodes = new Map<string, Node>()

    private _startNode?: Node
    private _endNode?: Node

    private _openList: Node[] = []
    private _closedList: Node[] = []

    private _callback?: (path: Node[]) => void

    public createVisualizer(scene: Phaser.Scene)
    {
        const visualizer = new Visualizer(this, scene)
    }

    public addNode(x: number, y: number, isWalkable: boolean)
    {
        const node = new Node(x, y, isWalkable)

        this._nodes.set(`${x}:${y}`, node)

        return node
    }

    public findPath(startX: number, startY: number, endX: number, endY: number, callback?: (path: Node[]) => void)
    {
        this._callback = callback
        
        this._startNode = this.getNode(startX, startY)
        this._endNode = this.getNode(endX, endY)

        this._openList.push(this._startNode)

        this.process()
    }
    
    public hasNode(x: number, y: number)
    {
        return this._nodes.has(`${x}:${y}`)
    }

    public getNode(x: number, y: number)
    {
        return this._nodes.get(`${x}:${y}`)!
    }

    private process()
    {
        console.log(this._openList)
    }
}