import "phaser";
import { GameClient } from "@phaserGame/game"

function main(): void {
    document.body.style.margin = "0px"
    var game = window["game"] = new GameClient()
}

window.onload = main.bind(this)