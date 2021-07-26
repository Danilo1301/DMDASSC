import GameClient from "../GameClient";

export default class BaseScene extends Phaser.Scene
{
    private _game?: GameClient

    public getGame(): GameClient
    {
        return this._game!;
    }
    
    public init(data): void
    {
        this._game = data.game
    }
}