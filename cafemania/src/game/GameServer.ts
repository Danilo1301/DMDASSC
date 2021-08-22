import { Game } from '@cafemania/game/Game';

export class GameServer extends Game
{
    constructor(notDefined: any)
    {
        super()
    }

    public async start(): Promise<void>
    {
        console.log('GameServer started')
    }
}