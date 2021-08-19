import { Game } from '@cafemania/game/Game';
import { config } from '@cafemania/sceneManager/config';

export class SceneManager
{
    private static _game?: Game
    private static _phaser?: Phaser.Game

    public static getGame(): Game
    {
        return this._game!
    }

    public static getPhaser(): Phaser.Game
    {
        return this._phaser!
    }

    public static async start(game: Game): Promise<void>
    {
        this._game = game

        const phaser = this._phaser = new Phaser.Game(config)

        return new Promise<void>(function(resolve)
        {
            phaser.events.on('ready', resolve)
        })
    }

    public static startScene(key: string, scene: typeof Phaser.Scene): Phaser.Scene
    {
        return this.getPhaser().scene.add(key, scene, true, {game: this.getGame()}) as Phaser.Scene
    }
}