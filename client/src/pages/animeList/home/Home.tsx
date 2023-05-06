import React, { useState } from 'react';

import { Anime } from '../../../../../server/src/animeList/anime'
import AnimeItem from './AnimeItem';

// import { Container } from './styles';

const requestAnimes = function(callback: (animes: Anime[]) => void) {
    const requestOptions = {
      method: 'GET',
    };
  
    console.log("requestAnimes");

    fetch('/api/animelist/animes', requestOptions)
    .then(response => response.json())
    .then((animes: Anime[]) => {
            callback(animes);
    });
}

let requestedAnimeList = false;

const Home: React.FC = () => {
    const [animeList, setAnimeList] = useState<Anime[]>([]);

    if(!requestedAnimeList)
    {
        requestedAnimeList = true;

        requestAnimes(animes => {
            console.log(animes)
            console.log("setAnimeList")
            setAnimeList(animes)
        })
    }

    return (
        <>
            {
            animeList.map(anime => (
                <AnimeItem key={anime.id} anime={anime}></AnimeItem>
            ))
            }
        </>
    )
}

export default Home;