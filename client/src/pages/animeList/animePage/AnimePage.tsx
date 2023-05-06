import React, { Component, useEffect, useState } from 'react'
import Button from 'react-bootstrap/esm/Button'
import Col from 'react-bootstrap/esm/Col'
import Container from 'react-bootstrap/esm/Container'
import Form from 'react-bootstrap/esm/Form'
import InputGroup from 'react-bootstrap/esm/InputGroup'
import Row from 'react-bootstrap/esm/Row'
import { useParams } from 'react-router-dom'
import { Anime } from '../../../../../server/src/animeList/anime'
 
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

const AnimePage: React.FC = () => {
    const params = useParams()
    const id = params.id

    const [anime, setAnime] = useState<Anime>();

    const [animeName, setAnimeName] = useState("");
    const [watchedEpisodes, setWatchedEpisodes] = useState(0);

    if(!id) return <>INVALID ID</>
    
    getAnimeInfo(id).then(animeInfo =>
    {
        setAnime(animeInfo)
        setAnimeName(animeInfo.name)
    })
        
    if(!anime) return <>Loading anime...</>

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
                        <Form.Control aria-label="" value={watchedEpisodes} onChange={e => setWatchedEpisodes(parseInt(e.target.value))} />
                        </InputGroup>
                    </Col>
                    <Col>
                        <span>Total episodes</span>
                        <InputGroup className="mb-3">
                            <Form.Control aria-label="Text input with checkbox" />
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <span>Watched ovas</span>
                        <InputGroup className="mb-3">
                            <Form.Control aria-label="Text input with checkbox" />
                        </InputGroup>
                    </Col>
                    <Col>
                        <span>Total ovas</span>
                        <InputGroup className="mb-3">
                            <Form.Control aria-label="Text input with checkbox" />
                        </InputGroup>
                    </Col>
                </Row>
                <Row md={4}>
                    <span>Next episode</span>
                    <input type="date" value=""></input>
                </Row>
                <Row className="mt-4">
                    <Col className="d-grid">
                        <Button variant="primary">
                            Save
                        </Button>
                    </Col>
                    <Col md="auto" className="">
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