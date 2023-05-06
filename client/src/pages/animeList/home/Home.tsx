import React, { useState } from 'react';

import Button from 'react-bootstrap/esm/Button'
import Col from 'react-bootstrap/esm/Col'
import Container from 'react-bootstrap/esm/Container'
import Form from 'react-bootstrap/esm/Form'
import InputGroup from 'react-bootstrap/esm/InputGroup'
import Row from 'react-bootstrap/esm/Row'

import { Anime } from '../../../../../server/src/animeList/anime'
import AnimeItem from './AnimeItem';
import { requestAccessKey, resetAccessKey } from '../AnimeList';

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

    //
    const handleNew = () =>
    {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: requestAccessKey() })
          };
        
          fetch('/api/animelist/new', requestOptions)
            .then(response => response.json())
            .then((data) => {
        
              
              console.log(data)
              
              setAnimeList([])
              requestedAnimeList = false
          });
    }

    //
    const handleClearKey = () =>
    {
        resetAccessKey()
    }

    return (
        <>
            <Row className="p-2">
                <Col className="">
                    <Button variant="primary" onClick={handleNew}>
                        Add new anime
                    </Button>
                </Col>
                <Col md="auto" className="" onClick={handleClearKey}>
                    <Button variant="danger">
                        test
                    </Button>
                </Col>
            </Row>

            {
            animeList.sort((a, b) => b.lastUpdated - a.lastUpdated ).map(anime => (
                <AnimeItem key={anime.id} anime={anime}></AnimeItem>
            ))
            }
        </>
    )
}

export default Home;