import Game from "@cafemania/game/Game";
import Tile from "@cafemania/world/tile/Tile"

export default class World
{
    private _game: Game;

    private _tiles = new Phaser.Structs.Map<string, Tile>([])

    constructor(game: Game)
    {
        this._game = game

        for(let y = 0; y < 4; y++)
        {
            for(let x = 0; x < 4; x++)
            {
                this.addTile(x, y)
            }
        }

        

        this.getTile(1, 0).addTileItem( this.getGame().tileItemFactory.createTileItem('chair0') )
        this.getTile(0, 0).addTileItem( this.getGame().tileItemFactory.createTileItem('chair0') )
        this.getTile(0, 1).addTileItem( this.getGame().tileItemFactory.createTileItem('fogao0') )

        window['tile'] = this.getTile(1, 0)

        

        //this.getTile(1, 0).addTileItem( this.getGame().tileItemFactory.createTileItem('fogao0')  )
        //this.getTile(1, 0).addTileItem( this.getGame().tileItemFactory.createTileItem('fogao0')  )
        //this.getTile(2, 2).addTileItem( this.getGame().tileItemFactory.createTileItem('fogao0')  )
    }


    public getTile(x: number, y: number)
    {
        return this._tiles.get(`${x}:${y}`)
    }

    public getGame()
    {
        return this._game
    }

    public addTile(x: number, y: number): Tile
    {
        const tile = new Tile(this, x, y)

        this._tiles.set(tile.id, tile);

        return tile
    }

    public getTiles(): Tile[]
    {
        return this._tiles.values()
    }
}

