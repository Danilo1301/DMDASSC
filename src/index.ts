

import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import path from 'path';
import fs from 'fs';
import { PATH_DATA, PATH_PUBLIC, PATH_REACT } from './paths';

const bodyParser = require('body-parser');
const cors = require('cors');

require("./env")(`${PATH_DATA}/env.json`)

if(!fs.existsSync(PATH_DATA)) fs.mkdirSync(PATH_DATA);

const isDevelopment = (process.env.NODE_ENV || "development").trim() === 'development';
const port = 3000;

console.log("index.ts | (ignoring)isDevelopment=", isDevelopment);

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const io: socketio.Server = new socketio.Server();

//app
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(cors({
    origin: '*'
}));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//socket
io.attach(server, {
    path: '/socket',
    cors: { origin: '*' }
});

io.on('connection', function (socket) {
    console.log("[index] new socket connection")
});

//
import { DiscordBot } from './discordBot'
const discordBot = new DiscordBot();
discordBot.login();

//
import { SteamBot } from './steamBot';
const steamBot = new SteamBot();
steamBot.login();

//
import TestApp from './testApp';
const testApp = new TestApp(app, steamBot);

//
import Log from './log';
const log = new Log(app, discordBot);

//
import AnimeList from './animeList';
const animeList = new AnimeList(app);

import Aternos from './aternos';
const aternos = new Aternos(app);

import PogChamp from './pogchamp';
const pogChamp = new PogChamp(app);

import Notes from './notes';
const notes = new Notes(app, log);

//app
app.use(express.static(PATH_PUBLIC));
app.use(express.static(PATH_REACT));
//app.use('/static', express.static(path.join(__dirname, "..", "static")));
app.get("/api", (req, res) => res.json({ message: "Hello from server! " + new Date().getTime() }) );

app.get("*", (req, res, next) => {

    if(req.url.startsWith("/favicon.ico") || req.url.startsWith("/assets/")) {

    } else {
        console.log(req.url)
    }

    next();
})

app.get("/cafemania", (req, res) => res.sendFile(path.join(__dirname, "..", "static", "cafemania", "index.html")) );
app.get("/game", (req, res) => res.sendFile(path.join(__dirname, "..", "static", "game", "index.html")) );
app.get("/voicechat", (req, res) => res.sendFile(path.join(__dirname, "..", "static", "voicechat", "index.html")) );
app.get("/aternos", (req, res) => res.sendFile(path.join(__dirname, "..", "static", "aternos", "index.html")) );

app.get("/notapi", (req, res) => res.json({ message: "Hello from server! " + new Date().getTime() }) );

app.get("*", (req, res) => res.sendFile(path.join(PATH_REACT, "index.html")));

server.listen(port, () => console.log(`[index] express web server started: http://localhost:${port}`));





/*
import mouseGame from './mouseGame'
import Chat from "./chat";

const mouse_game = mouseGame(io.of('/api/mousegame'));
const chat = new Chat(io.of('/api/chat'));
*/


