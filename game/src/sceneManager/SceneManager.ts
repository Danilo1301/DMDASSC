import { Game } from '@game/game/Game';
import { config } from '@game/sceneManager/config';

export class SceneManager {

    public static gameScene: Phaser.Scene

    private static _phaserInstances: Phaser.Game[] = []
    private static _game?: Game;

    public static get phaser() { return this._phaserInstances[0]; }
    public static get game() { return this._game!; }

    public static createPhaserInstance(game?: Game): Promise<Phaser.Game> {
        const headless = game === undefined;

        if(!headless) this._game = game;

        return new Promise((resolve) => {
            config.type = headless ? Phaser.HEADLESS : Phaser.WEBGL;

            const phaser = new Phaser.Game(config);
            this._phaserInstances.push(phaser);

            if(headless && this._phaserInstances.length >= 1) {
                resolve(phaser);
                return;
            }

            phaser.events.on("ready", () => resolve(phaser));
        })
    }

    public static startScene(key: string, scene: typeof Phaser.Scene) {
        return this.phaser.scene.add(key, scene, true) as Phaser.Scene;
    }
}