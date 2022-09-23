const SteamUser = require('steam-user');
const SteamTotp = require('steam-totp');

export class SteamBot {
    public get client() { return this._client; }

    private _client;

    constructor() {
        const client = this._client = new SteamUser();

        client.on('loggedOn', () => {
            console.log("[steamBot] Logged in");
            
            client.setPersona(SteamUser.EPersonaState.Online);
            client.gamesPlayed(730);

            this.sendOwnerChatMessage("Bot is up");
        });

        client.on('error', function (err) {
            console.log(`[steamBot] Error: ${err}`);
        });

        client.on("friendMessage", function(steamID, message) {
            console.log("[steamBot] Friend message from " + steamID + ": " + message);
            
            client.chatMessage(steamID, message)
        });
    }

    public login() {
        const code = SteamTotp.generateAuthCode(process.env.STEAM_SHARED_SECRET);

        console.log(process.env.STEAM_SHARED_SECRET)
        console.log(code)

        /*
        const logOnOptions = {
            accountName: process.env.STEAM_USERNAME,
            password: process.env.STEAM_PASSWORD,
            twoFactorCode: code
        };

        this.client.logOn(logOnOptions);
        */
    }

    public sendOwnerChatMessage(message: string) {
        const ownerId = process.env['STEAM_OWNER_ID'];
        this.sendChatMessage(ownerId!, message);
    }

    public sendChatMessage(steamId: string, message: string) {
        this.client.chatMessage(steamId, message)
    }
}

