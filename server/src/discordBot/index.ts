const Discord = require('discord.js');

export class DiscordBot {
    public get client() { return this._client; }

    private _client;

    constructor() {
        const client = this._client = new Discord.Client();

        client.on('message', msg => {
            console.log(`[discordBot] Message: ${msg.content}`);
            //msg.reply(msg.content);
        });

        client.on('ready', () => {
            console.log(`[discordBot] Logged in as ${client.user.tag}!`);

            client.user.setStatus('invisible');
            this.sendOwnerMessage("Bot is up")
        });
    }

    public sendOwnerMessage(message: string) {
        this.client.channels.cache.get('663429290846847007').send(message);
    }

    public login() {
        const token = process.env["DISCORD_TOKEN"];
        this.client.login(token).then(() => {
            console.log("[discordBot] login")
        }).catch(console.error);
    }
}

