import { Game } from "./game"

export class GameScene extends Phaser.Scene {
    constructor(a, b, c) {
        super("GameScene")
    }

    preload() {
        var game = this.game as Game
        game.Scene = this
        game.Preload(this)
    }

    create() {
        var game = this.game as Game
        game.Start()
    }
}