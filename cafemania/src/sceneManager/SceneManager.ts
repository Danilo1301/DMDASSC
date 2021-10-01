import { Game } from '@cafemania/game/Game';
import { config } from '@cafemania/sceneManager/config';

export class SceneManager {
    
    private static _game?: Game;
    private static _phaser?: Phaser.Game;

    public static get game() { return this._game!; }
    public static get phaser() { return this._phaser!; }

    public static async start(game: Game) {
        this._game = game;

        const phaser = this._phaser = new Phaser.Game(config);

        return new Promise<void>(resolve => {
            phaser.events.on('ready', resolve);
        });
    }

    public static startScene(key: string, scene: typeof Phaser.Scene) {
        return this.phaser.scene.add(key, scene, true, {game: this.game}) as Phaser.Scene;
    }
}