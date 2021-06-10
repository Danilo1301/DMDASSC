import "phaser";
import { io } from "socket.io-client";

import { GameClient } from "@phaserGame/game"


function main(): void {
    document.body.style.margin = "0px"

    var socket = io('http://localhost:3000/api/phaserGame', {path: '/socket'})
    
    var game = new GameClient(socket)

    window["game"] = game
}

window.onload = main.bind(this)