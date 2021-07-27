import "phaser";
import GameClient from "@cafemania/game/GameClient"

function main(): void
{
    document.body.style.margin = "0px"
    var game = window["game"] = new GameClient()
    game.start()
}

window.onload = main.bind(this)
