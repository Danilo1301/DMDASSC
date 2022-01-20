import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Anime } from './anime';
import fs from 'fs'
import path from 'path';

class User {
    public get id() { return this._id; }
    public get animes() { return this._animes; }

    private _id: string;
    private _animes = new Map<string, Anime>();

    constructor(id: string) {
        this._id = id;
    }

    public addAnime(anime: Anime) {
        this._animes.set(anime.id, anime);
    }
}

const MY_ID = "myid";

class AnimeList {
    private _users = new Map<string, User>();

    public saveData() {
        const animeListDir = path.join(__dirname, "..", "..", "..", ".data", "animelist");
        
        if(!fs.existsSync(animeListDir)) {
            fs.mkdirSync(animeListDir);
        }

        const json: any = {};
        
        for (const user of Array.from(this._users.values())) {
            
            const data = {
                id: user.id,
                animes: Array.from(user.animes.values())
            }

            //console.log(data)

            json[user.id] = data;
            
        }
        
        fs.writeFileSync(animeListDir + "/users.json", JSON.stringify(json))
        

        //console.log(animeListDir)
    }
    
    public loadData() {
        const animeListDir = path.join(__dirname, "..", "..", "..", ".data", "animelist");
        const usersDir = animeListDir + "/users.json";
        
        if(!fs.existsSync(animeListDir)) fs.mkdirSync(animeListDir);
        if(!fs.existsSync(usersDir)) return;

        const json = JSON.parse( fs.readFileSync(animeListDir + "/users.json", "utf-8") );
        
        //console.log(json)

        for (const id in json) {
            const user = this.createUser(id);

            //console.log(json[id])

            for (const anime of json[id].animes) {
                user.addAnime(anime)
            }
        }
        
        
    }

    public authenticateKey(key: string) {
        return key == process.env.STEAM_PASSWORD
    }

    constructor(app: express.Application) {

        this.loadData()

        if(!this._users.has(MY_ID)) {
            const user = this.createUser(MY_ID);

            const a = this.createAnime('No Name', 12);
            a.id = "testid";
            a.nextEpisodeDate = (new Date("2022-01-23")).getTime()
            user.addAnime(a);

            this.saveData();

        }

        app.get("/api/animelist", (req, res) => {
            res.end("yes");
        });

        app.get("/api/animelist/animes", (req, res) => {
            const user = Array.from(this._users.values())[0];

            res.json(Array.from(user.animes.values()));
        });

        app.get("/api/animelist/anime/:id", (req, res) => {
            const id = req.params.id;

            const user = Array.from(this._users.values())[0];

            res.json(user.animes.get(id));
        });

        app.post("/api/animelist/anime/:id/update", (req, res) => {
            const key = req.body.key;
            if(!this.authenticateKey(key)) {
                res.sendStatus(500)
                return;
            }

            const user = Array.from(this._users.values())[0];
            const bodyAnime: Anime = req.body.anime;

      
            const anime = user.animes.get(bodyAnime.id)!;

            anime.name = bodyAnime.name;
            anime.nextEpisodeDate = bodyAnime.nextEpisodeDate;
            anime.totalEpisodes = bodyAnime.totalEpisodes;
            anime.totalOvas = bodyAnime.totalOvas;
            anime.watchedEpisodes = bodyAnime.watchedEpisodes;
            anime.watchedOvas = bodyAnime.watchedOvas;
            anime.lastUpdated = Date.now()

            res.end();

            this.saveData();
        });

        app.post("/api/animelist/anime/:id/delete", (req, res) => {
            const key = req.body.key;
            if(!this.authenticateKey(key)) {
                res.sendStatus(500)
                return;
            }

            const user = Array.from(this._users.values())[0];
            const body: Anime = req.body;

            const id = req.params.id;

            //console.log("delete", id)
           
            user.animes.delete(id);

            res.end();

            this.saveData();
        });

        app.post("/api/animelist/new", (req, res) => {

            const key = req.body.key;
            if(!this.authenticateKey(key)) {
                res.sendStatus(500)
                return;
            }

            const user = Array.from(this._users.values())[0];

            //user.animes.push(this.createAnime('random name', 12));

            const anime = this.createAnime('Name', 1);

            user.addAnime(anime)

            //console.log(req.body);
            res.json({id: anime.id});

            
            this.saveData();
        });
    }

    public createAnime(name: string, episodes: number) {
        const anime: Anime = {
            id: uuidv4(),
            name: name,
            watchedEpisodes: 0,
            totalEpisodes: episodes,
            watchedOvas: 0,
            totalOvas: 0,
            lastUpdated: Date.now()
        }
        return anime;
    }

    public createUser(id: string) {
        const user = new User(id);
        this._users.set(user.id, user);
        return user;
    }
}



export default AnimeList;