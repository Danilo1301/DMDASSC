import 'phaser';
import { GameClient } from '@cafemania/game/GameClient'

function main(): void
{
    document.body.style.margin = '0px'
    
    const game = window['game'] = new GameClient()
    
    const text = document.createElement('b');
    text.style.position = "fixed";
    text.style.left = "30px";
    text.style.top = "30px";
    text.innerText = `Clique para iniciar o jogo`;
    document.body.appendChild(text);

    let started = false;
    window.addEventListener('mousedown', () => {
        if(started) return;
        started = true;
        game.start()

        text.remove();
    })
}

window.onload = main.bind(this)

/*
TODO:

3D model for doors
Player customization scene
PlayerCheff IA
Check if TileItems works on walls
Fix aprox. time for PlayerTask

*/