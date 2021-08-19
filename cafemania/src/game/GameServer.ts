import { Game } from '@cafemania/game/Game';
import { Logger } from '@cafemania/logger/Logger';

export class GameServer extends Game
{
    constructor(notDefined: any)
    {
        super()
    }

    public async start(): Promise<void>
    {
        Logger.print('GameServer started')
    }
}