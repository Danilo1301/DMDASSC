import express from 'express';
import { DiscordBot } from '../discordBot';
import { Gamelog } from './test';

interface ILog {
    service: string
    address: string
    message: string
    isLocal: boolean
    sendPing: boolean
    time: number
}

const serviceChannels = [
    ["crab-game-mod", "979150398558466058"],
    ["redactle-pt", "979150364169355346"]
]

class GameLog {
    private _logs: ILog[] = [];
    private _discordBot: DiscordBot;

    constructor(app: express.Application, discordBot: DiscordBot) {
        this._discordBot = discordBot;

        app.post("/gamelog/log", (req, res) => {
            const body = req.body;

            console.log(body)

            const service = typeof body.service == "string" ? body.service : undefined;
            const address = typeof body.address == "string" ? body.address : undefined;
            const message = typeof body.message == "string" ? body.message : undefined;
            const sendPing = typeof body.sendPing == "boolean" ? body.sendPing : false;
            const isLocal = typeof body.isLocal == "boolean" ? body.isLocal : false;
            
            if(service && address) {
                const log = this.addLog(service, address, message ? message : "", sendPing, isLocal);

                if(sendPing) 
                    this.sendLog(log);
            }

            res.send(req.body);    // echo the result back
        });

        app.get("/gamelog", (req, res) => {
            let str = ""; 
            for (const log of this._logs) {
                str += `${this.formatLogMessage(log)}\n`
            }

            res.end(str);
        });

        app.get("/gamelog/test", (req, res) => {

            Gamelog.log("127.0.0.1", "message", true, true)

            res.end("sent");
        });
    }

    private sendLog(log: ILog) {
        const discordBot = this._discordBot;
        const msg = this.formatLogMessage(log);

        for (const sc of serviceChannels) {
            if(sc[0] == log.service) {
                discordBot.sendChannelMessage(sc[1], msg);
                return;
            }
        }

        discordBot.sendOwnerMessage(`[gamelog] ${msg}`);
    }

    private formatLogMessage(log: ILog) {
        return `[${this.formatTime(new Date(log.time))} - ${log.service}] (${log.address}) ${log.message}${log.isLocal ? ` (local)` : ""}`;
    }

    public addLog(service: string, address: string, message: string, sendPing: boolean, isLocal: boolean) {
        const log: ILog = {
            service: service,
            address: address,
            message: message,
            sendPing: sendPing,
            isLocal: isLocal,
            time: Date.now()
        }
        this._logs.push(log);
        
        return log;
    }

    public formatTime(date: Date) {
        const offset = date.getTimezoneOffset();
        date = new Date(date.getTime() - (offset*60*1000))
        const s = date.toISOString().split('T');
        const timeStr = `${s[0]} ${s[1].split(".")[0]}`;
        return timeStr;
    }
}

export default GameLog;