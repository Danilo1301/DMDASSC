const Discord = require('discord.js');

export class DiscordBot {
    constructor() {
        const token = process.env["DISCORD_TOKEN"];
        const client = new Discord.Client();

        client.login(token).then(() => {
            console.log("DiscordBot login")
        }).catch(console.error);

        client.on('ready', () => {
            console.log("DiscordBot ready")
        });
    }
}

