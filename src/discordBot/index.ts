import { Client, ClientOptions } from 'discord.js';

export class DiscordBot {
    public static DEFAULT_CHANNEL = "663429290846847007";

    public get client() { return this._client; }

    private _client: Client;

    constructor() {
        const options: any = {intents: 0};
        const client = this._client = new Client(options);

        //intents: BitFieldResolvable<GatewayIntentsString, number>;

        client.on('message', msg => {
            console.log(`[discordBot] Message: ${msg.content}`);
            
            //msg.reply(msg.content);
        });

        client.on('ready', () => {
            const user = client.user!;

            console.log(`[discordBot] Logged in as ${user.tag}!`);

            //user.setStatus('invisible');
            this.sendOwnerMessage("Bot is up")
        });
    }

    public sendOwnerMessage(message: string) {
        this.client.channels.fetch(DiscordBot.DEFAULT_CHANNEL).then(channel => {
            channel!['send'](message);
        })
    }

    public sendChannelMessage(channelId: string, message: string) {
        this.client.channels.fetch(channelId).then(channel => {
            channel!['send'](message);
        })
    }

    public login() {
        const token = process.env["DISCORD_TOKEN"];
        this.client.login(token).then(() => {
            console.log("[discordBot] login")
        }).catch(console.error);
    }
}

