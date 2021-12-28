import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import path from 'path';

const isDevelopment = (process.env.NODE_ENV || "development").trim() === 'development';
const port = 3000;

console.log("index.ts | (ignoring)isDevelopment=", isDevelopment);

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const io: socketio.Server = new socketio.Server();

try { require("../env").load(); } catch (error) {}

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


//app
app.use(express.static(path.join(__dirname, "..", "public")));

app.use('/static', express.static(path.join(__dirname, "..", "static")));

app.get("/api", (req, res) => res.json({ message: "Hello from server! " + new Date().getTime() }) );

app.get("/cafemania", (req, res) => res.sendFile(path.join(__dirname, "..", "static", "cafemania", "index.html")) );
app.get("/game", (req, res) => res.sendFile(path.join(__dirname, "..", "static", "game", "index.html")) );
app.get("/voicechat", (req, res) => res.sendFile(path.join(__dirname, "..", "static", "voicechat", "index.html")) );

app.get("/notapi", (req, res) => res.json({ message: "Hello from server! " + new Date().getTime() }) );

app.get("*", (req, res) => res.sendFile(path.join(__dirname, "..", "static", "client", "index.html")));

server.listen(port, () => console.log(`[index] express web server started: http://localhost:${port}`));





/*
import mouseGame from './mouseGame'
import Chat from "./chat";

const mouse_game = mouseGame(io.of('/api/mousegame'));
const chat = new Chat(io.of('/api/chat'));
*/


