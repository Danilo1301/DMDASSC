import 'phaser';
import { GameClient } from '@game/game/GameClient'

function main() {
    document.body.style.margin = '0px';
    
    const game = new GameClient();
    game.start();

    window['game'] = game;
}

window.onload = main.bind(this);
