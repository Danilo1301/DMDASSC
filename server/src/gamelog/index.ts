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
                str += `[00:00:00 27/01/2012 - ${log.service}] (${log.address}) ${log.message}\n`
            }

            res.end(str);
        });

        this.addLog("cafemania", "127.0.0.1", "joined")
        this.addLog("cafemania", "127.0.0.1", "sum")
        this.addLog("cafemania", "47.0.0.1", "joined")
        this.addLog("gm", "48.0.0.1", "joined")
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
}

export default GameLog;