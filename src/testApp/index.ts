import express from 'express';
import { SteamBot } from 'src/steamBot';

class TestApp {
    constructor(app: express.Application, steamBot: SteamBot) {
        app.get("/testApp", (req, res) => {

            console.log("at /testApp")

            steamBot.sendOwnerChatMessage("at /testApp");

            res.end("testApp");
        });
    }
}

export default TestApp;