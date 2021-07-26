import "phaser";
import GameClient from "@cafemania/game/GameClient"
import Three from "./three/Three";

function main(): void
{
    document.body.style.margin = "0px"
    var game = window["game"] = new GameClient()
    game.start()

    //Three.init()
}

window.onload = main.bind(this)
