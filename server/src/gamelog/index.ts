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

class GameLog {
    private _logs: ILog[] = [];

    constructor(app: express.Application, discordBot: DiscordBot) {
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

                if(sendPing) {
                    discordBot.sendOwnerMessage(`[gamelog] ${this.formatLogMessage(log)}`);
                }
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