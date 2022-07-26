import express from 'express';
import path from 'path';
import fs from 'fs'

  
class PogChamp {
    
    public static days = 60;

    constructor(app: express.Application)
    {
        console.log("PogChamp starting");

        const dir = path.join(__dirname, "..", "..", "..", ".data");
        
        const jsonDir = `${dir}\\pogchamp.json`;

        if(!fs.existsSync(jsonDir)) {
            fs.writeFileSync(jsonDir, `${(new Date()).getTime()}`)
        }

        const minTime = (1000 * 60 * 60 * 24 * PogChamp.days);
        

        app.get("/pogchamp", (req, res) => {
            const nowDate = new Date();
            const time = parseInt(fs.readFileSync(jsonDir, "utf-8"));
            const targetDate = new Date(new Date(time).getTime() + minTime);
            const diff = targetDate.getTime() - nowDate.getTime();

            console.log(nowDate, targetDate);

            if(diff < 0) {
                res.end("https://drive.google.com/file/d/10hcVwQRzG4VxpxNNyQLznMPQRdaiNp1g/view?usp=sharing");
            } else {
                res.end(`Important message in: ${diff} ms`);
            }
        });
    }
}

export default PogChamp;