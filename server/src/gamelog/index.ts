import express from 'express';

interface ILog {
    service: string
    address: string
    message: string
    time: number
}

class GameLog {
    private _logs: ILog[] = [];

    constructor(app: express.Application) {
        app.post("/gamelog/log", (req, res) => {
            const body = req.body;

            const service = typeof body.service == "string" ? body.service : undefined;
            const address = typeof body.address == "string" ? body.address : undefined;
            const message = typeof body.message == "string" ? body.message : undefined;
            

            if(service && address) {
                this.addLog(service, address, message ? message : "");
            }

            res.send(req.body);    // echo the result back
        });

        app.get("/gamelog", (req, res) => {
            let str = ""; 
            for (const log of this._logs) {
                str += `[${this.formatTime(new Date(log.time))} - ${log.service}] (${log.address}) ${log.message}\n`
            }

            res.end(str);
        });
    }

    public addLog(service: string, address: string, message: string) {
        const log: ILog = {
            service: service,
            address: address,
            message: message,
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