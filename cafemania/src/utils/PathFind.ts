class Node
{
    public x: number
    public y: number
    public canWalk: boolean

    public fScore: number = 0

    public neighbours: Node[] = []

    public cameFrom?: Node

    constructor(x: number, y: number, canWalk: boolean)
    {
        this.x = x
        this.y = y
        this.canWalk = canWalk
    }
}

export default class PathFind
{
    private _nodes = new Map<string, Node>()

    private _start = {x: 0, y: 0}
    private _end = {x: 0, y: 0}

    private _openNodes: Node[] = []
    private _closedNodes: Node[] = []

    private _callback?: (path: Node[]) => void

    public add(x: number, y: number, canWalk: boolean)
    {
        const node = new Node(x, y, canWalk)

        this._nodes.set(`${x}:${y}`, node)
    }

    public setStart(x: number, y: number)
    {
        this._start.x = x
        this._start.y = y
    }

    public setEnd(x: number, y: number)
    {
        this._end.x = x
        this._end.y = y
    }

    public find(callback?: (path: Node[]) => void)
    {
        this._callback = callback

        this._nodes.forEach(node => {
            
            const neighbours: Node[] = []

            const allNeighbours = this.findNodeNeighbours(node)
            const posx = node.x
            const posy = node.y

            for (const neighbour of allNeighbours)
            {
                const isAtDiagonals = (Math.abs(neighbour.x - posx) == 1 && Math.abs(neighbour.y - posy) == 1)

                let canAddThisNeightbour = neighbour.canWalk

                if(isAtDiagonals)
                {
                    let canWalkInThisDiagonal = neighbour.canWalk

                    //console.log(neighbour.x - posx, neighbour.y - posy, isAtDiagonals)

                    const diagonalNeighbours = this.findNodeNeighbours(neighbour)

                    for (const dn of diagonalNeighbours) {
            
                        let isInsideMainTest = false

                        for (const a of allNeighbours) {
                            if(a.x == dn.x && a.y == dn.y)
                            {
                                isInsideMainTest = true
                                break
                            }
                        }

                        
                        if(isInsideMainTest)
                        {
                            if(!dn.canWalk && neighbour.canWalk)
                            {
                                canWalkInThisDiagonal = false
                            }
                        }

                        //console.log(`diagonal ${neighbour.x} ${neighbour.y}: test ${dn.x}, ${dn.y} ${isInsideMainTest} (${canWalkInThisDiagonal})`)
                    
                    }

                    //console.log(`diagonal ${neighbour.x} ${neighbour.y}: (${canWalkInThisDiagonal})`)
                    

                    canAddThisNeightbour = canWalkInThisDiagonal
                }


                if(canAddThisNeightbour) neighbours.push(neighbour)
                
                //console.log(neighbour.x - posx, neighbour.y - posy, isAtDiagonals)
            }

            node.neighbours = neighbours
            
        })

        this._openNodes.push(this.getNode(this._start.x, this._start.y))

        this.process()
    }
    
    public findNodeNeighbours(node: Node): Node[]
    {
        const neighbours: Node[] = []

        for (let x = -1; x <= 1; x++)
        {
            for (let y = -1; y <= 1; y++)
            {
                let nx = node.x + x
                let ny = node.y + y

                if(nx == node.x && ny == node.y) continue

                if(this.hasNode(nx, ny))
                {
                    neighbours.push(this.getNode(nx, ny))
                }
            }
        }

        return neighbours
    }

    public hasNode(x: number, y: number)
    {
        return this._nodes.has(`${x}:${y}`)
    }

    public getNode(x: number, y: number)
    {
        return this._nodes.get(`${x}:${y}`)!
    }

    private onFinish()
    {
        const endNode = this.getNode(this._end.x, this._end.y)

        const path: Node[] = []

        let node: Node | undefined = endNode

        do {
            if(node != undefined)
            {
                path.unshift(node)
                //console.log(node.x, node.y)

                node = node.cameFrom
            }

            
        }
        while(node)

        this._callback?.(path)

        //console.log(endNode, path)
    }

    private process()
    {
        //console.log(`${this._openNodes.length} open nodes`)
        //console.log(this)

        let node: Node | undefined
        let nodefs: number | undefined

        for (const openNode of this._openNodes)
        {
            const startNode = this.getNode(this._start.x, this._start.y)

            const dx = openNode.x - startNode.x;
            const dy = openNode.y - startNode.y;

            openNode.fScore = Math.sqrt(dx*dx + dy*dy);

            if(openNode.fScore < (nodefs || Infinity))
            {
                nodefs = openNode.fScore
                node = openNode
            }
        }
        



        if(!node)
        {
            this.onFinish()
            //console.log("Not node")
            return
        }

        if(node.x == this._end.x && node.y == this._end.y)
        {
            this.onFinish()
            //console.log("We found goal")
            return 
        }

        for (const neighbour of node.neighbours)
        {
            const isStartNode = neighbour.x == this._start.x && neighbour.y == this._start.y

            if(!neighbour.cameFrom && !isStartNode)
                neighbour.cameFrom = node

      
            if(neighbour.x == this._end.x && neighbour.y == this._end.y)
            {
                this.onFinish()
                //console.log("We found goal in neightbour")

                //console.log(neighbour)

                return
            }

            if(!this._openNodes.includes(neighbour) && !this._closedNodes.includes(neighbour))
            {
                this._openNodes.push(neighbour);

                //console.log(`Added new node to open`)
            }
        }

        this._openNodes.splice(this._openNodes.indexOf(node), 1);
        this._closedNodes.push(node);
   
        ///console.log(`Removed node from open and added to closed`)

        this.process()
    }
}