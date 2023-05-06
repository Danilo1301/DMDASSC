import React, { Component, useEffect, useState } from 'react'
import Button from 'react-bootstrap/esm/Button'
import Col from 'react-bootstrap/esm/Col'
import Container from 'react-bootstrap/esm/Container'
import Form from 'react-bootstrap/esm/Form'
import InputGroup from 'react-bootstrap/esm/InputGroup'
import Row from 'react-bootstrap/esm/Row'
import { useParams } from 'react-router-dom'
import { Anime } from '../../../../../server/src/animeList/anime'
import { requestAccessKey } from '../AnimeList'
 
// import { Container } from './styles'

const getServerUrl = () => {
    if(window.location.href.includes("localhost")) return `http://localhost:3000`
    return ""
}

const getAnimeInfo = async (id: string) => {
    return new Promise<Anime>((resolve, reject) =>
    {
        fetch(getServerUrl() + "/api/animelist/anime/" + id, {method: 'GET'})
        .then(response => response.json())
        .then((anime: Anime) => {
            resolve(anime)
        })
        .catch((err) => {
            reject(err)
        })
    })
}

let requestedAnime = false;

const AnimePage: React.FC = () => {
    const params = useParams()
    const id = params.id

    const [anime, setAnime] = useState<Anime>();

    //fields

    const [animeName, setAnimeName] = useState("");

    const [watchedEpisodes, setWatchedEpisodes] = useState(0);
    const [totalEpisodes, setTotalEpisodes] = useState(0);

    const [watchedOvas, setWwatchedOvas] = useState(0);
    const [totalOvas, setTotalOvas] = useState(0);

    const [nextEpisode, setNextEpisode] = useState("");

    //

    if(!id) return <>INVALID ID</>
      
    if(!requestedAnime)
    {
        requestedAnime = true;
        
        console.log("getAnimeInfo")
        
        getAnimeInfo(id).then(animeInfo =>
        {
            setAnime(animeInfo)
            setAnimeName(animeInfo.name)
            setWatchedEpisodes(animeInfo.watchedEpisodes)
            setTotalEpisodes(animeInfo.totalEpisodes)
            setWwatchedOvas(animeInfo.watchedOvas)
            setTotalOvas(animeInfo.totalOvas)

            if(animeInfo.nextEpisodeDate) {
                const date = new Date(animeInfo.nextEpisodeDate);
                setNextEpisode(date.toISOString().substr(0, 10));
              }
        })
    }
        
    if(!anime) return <>Loading anime...</>
    
    //handleSave
    
    const handleSave = () =>
    {
        console.log("save")
    
        const anime: Anime = {
          id: id,
          name: animeName,
          watchedEpisodes: watchedEpisodes,
          totalEpisodes: totalEpisodes,
          watchedOvas: watchedOvas,
          totalOvas: totalOvas,
          nextEpisodeDate: nextEpisode == "" ? undefined : new Date(nextEpisode).getTime(),
          lastUpdated: Date.now()
        }
    
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({anime: anime, key: requestAccessKey()})
        };
    
        console.log('/update', requestOptions)

        fetch('/api/animelist/anime/' + id + "/update", requestOptions)
          .then(response => {
            console.log(response);
    
            window.location.href = "/animelist/"
        });
    
        console.log(anime)
    }

    //handleDelete

    const handleDelete = () =>
    {
        console.log("delete")
    
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({anime: anime, key: requestAccessKey()})
        };
    
        fetch('/api/animelist/anime/' + id + "/delete", requestOptions)
          .then(response => {
            console.log(response);
    
            window.location.href = "/animelist/"
        });
      }

    return (
        <>
            <Container className='mt-3'>
                <h3>Edit anime</h3>
                <Row>
                    <span>Name</span>
                    <InputGroup className="mb-3">
                        <Form.Control aria-label="" value={animeName} onChange={e => setAnimeName(e.target.value)} />
                    </InputGroup>
                </Row>
                <Row>
                    <Col>
                        <span>Watched episodes</span>
                        <InputGroup className="mb-3">
                            <Form.Control aria-label="" type='number' value={watchedEpisodes} onChange={e => setWatchedEpisodes(parseInt(e.target.value))} />
                        </InputGroup>
                    </Col>
                    <Col>
                        <span>Total episodes</span>
                        <InputGroup className="mb-3">
                            <Form.Control aria-label="" type='number' value={totalEpisodes} onChange={e => setTotalEpisodes(parseInt(e.target.value))} />
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <span>Watched ovas</span>
                        <InputGroup className="mb-3">
                            <Form.Control aria-label="" type='number' value={watchedOvas} onChange={e => setWwatchedOvas(parseInt(e.target.value))} />
                        </InputGroup>
                    </Col>
                    <Col>
                        <span>Total ovas</span>
                        <InputGroup className="mb-3">
                            <Form.Control aria-label="" type='number' value={totalOvas} onChange={e => setTotalOvas(parseInt(e.target.value))} />
                        </InputGroup>
                    </Col>
                </Row>
                <Row md={4}>
                    <span>Next episode</span>
                    <input type="date" value={nextEpisode} onChange={e => {

                          const str = e.target.value;
                          const date = new Date(str);

                          console.log(str, date.getTime());

                          setNextEpisode(str);
                      
                        
                    }}></input>
                    {nextEpisode}
                </Row>
                <Row className="mt-4">
                    <Col className="d-grid">
                        <Button variant="primary" onClick={handleSave}>
                            Save
                        </Button>
                    </Col>
                    <Col md="auto" className="" onClick={handleDelete}>
                        <Button variant="danger">
                            Delete
                        </Button>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default AnimePage