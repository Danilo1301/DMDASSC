import "phaser";
import { Game, GameClient } from "@phaserGame/game"

function main(): void {
    document.body.style.margin = "0px"
    var game = window["game"] = new GameClient()
    game.Start()
}

window.onload = main.bind(this)