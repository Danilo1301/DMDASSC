import "phaser";
import { io } from "socket.io-client";

import { GameClient } from "@phaserGame/game"


function main(): void {
    document.body.style.margin = "0px"

    var address = 'http://' + location.host + '/api/phaserGame'

    console.log("Connecting to " + address)

    var socket = io(address, {path: '/socket'})
    
    var game = new GameClient(socket)

    window["game"] = game
}

window.onload = main.bind(this)