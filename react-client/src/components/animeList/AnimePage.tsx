import * as React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Anime, requestAccessKey } from "./AnimeList";

const NotFound = function() {
  return (
    <>
      <small>Not found</small>
    </>    
  );
}

let requestedData: boolean = false;

const AnimePage = function(props)
{
  let params = useParams();
  const id = params.id;

  if(!requestedData) {
    requestedData = true;

    console.log(id)

    const requestOptions = {
      method: 'GET',
      //headers: { 'Content-Type': 'application/json' },
      //body: JSON.stringify({ title: 'React Hooks POST Request Example' })
    };

    fetch('/api/animelist/anime/' + id, requestOptions)
      .then(response => response.json())
      .then((anime: Anime) => {
        console.log(anime)

        setName(anime.name)
        setWatchedEpisodes(anime.watchedEpisodes)
        setTotalEpisodes(anime.totalEpisodes)
        setWatchedOvas(anime.watchedOvas)
        setTotalOvas(anime.totalOvas)

        const date = new Date(anime.nextEpisodeDate || Date.now());
        setNextEpisodeDate(date.toISOString().substr(0, 10));
    });
  }

  const [name, setName] = useState("");
  const [watchedEpisodes, setWatchedEpisodes] = useState(0);
  const [totalEpisodes, setTotalEpisodes] = useState(0);
  const [watchedOvas, setWatchedOvas] = useState(0);
  const [totalOvas, setTotalOvas] = useState(0);
  const [nextEpisodeDate, setNextEpisodeDate] = useState("");

  const handleChange_name = (event) => {
    setName(event.target.value);
  }

  const handleChange_watchedEpisodes = (event) => {
    setWatchedEpisodes(parseInt(event.target.value));
  }

  const handleChange_totalEpisodes = (event) => {
    setTotalEpisodes(parseInt(event.target.value));
  }

  const handleChange_nextEpisodeDate = (event) => {
    const str = event.target.value;
    const date = new Date(str);
    setNextEpisodeDate(str);

    console.log(date.getTime())
  }

  const handleChange_watchedOvas = (event) => {
    setWatchedOvas(parseInt(event.target.value));
  }

  const handleChange_totalOvas = (event) => {
    setTotalOvas(parseInt(event.target.value));
  }

  const handleSave = () => {
    console.log("save")

    const anime: Anime = {
      id: id,
      name: name,
      watchedEpisodes: watchedEpisodes,
      totalEpisodes: totalEpisodes,
      watchedOvas: watchedOvas,
      totalOvas: totalOvas,
      nextEpisodeDate: nextEpisodeDate == "" ? undefined : new Date(nextEpisodeDate).getTime(),
      lastUpdated: Date.now()
    }

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({anime: anime, key: requestAccessKey()})
    };

    fetch('/api/animelist/anime/' + id + "/update", requestOptions)
      .then(response => {
        console.log(response);

        location.href = "/animelist/"
    });

    console.log(anime)
  }

  const handleDelete = () => {
    console.log("delete")

    const requestOptions = {
      method: 'POST',
      //headers: { 'Content-Type': 'application/json' },
      //body: JSON.stringify({id: id})
    };

    fetch('/api/animelist/anime/' + id + "/delete", requestOptions)
      .then(response => {
        console.log(response);

        location.href = "/animelist/"
    });
  }

  return (
    <>
      <div className="container mt-3">
        <div className="row">
          <div className="col">Nome: </div>
          <div className="col">
            <input type="text" value={name} onChange={handleChange_name} />
          </div>
        </div>

        <div className="row">
          <div className="col">Episodios assistidos:</div>
          <div className="col">
          <input type="number" value={watchedEpisodes} onChange={handleChange_watchedEpisodes} />
          </div>
        </div>

        <div className="row">
          <div className="col">Total de episódios:</div>
          <div className="col">
            <input type="number" value={totalEpisodes} onChange={handleChange_totalEpisodes} />
          </div>
        </div>

        <div className="row">
          <div className="col">Proximo episódio:</div>
          <div className="col">
            <input type="date" value={nextEpisodeDate} onChange={handleChange_nextEpisodeDate}></input>
          </div>
        </div>
        
        <div className="row">
          <div className="col">Ovas assistidos:</div>
          <div className="col">
          <input type="number" value={watchedOvas} onChange={handleChange_watchedOvas} />
          </div>
        </div>

        <div className="row">
          <div className="col">Total de Ovas:</div>
          <div className="col">
            <input type="number" value={totalOvas} onChange={handleChange_totalOvas} />
          </div>
        </div>


        <div className="row mt-4">
          <div className="col-auto">
            <button className="col-auto btn-sm btn-primary" onClick={handleSave}>Atualizar</button>
            
          </div>
          <div className="col">
            <small className="col-auto">Anime ID {params.id}</small>
          </div>

          <div className="col-auto">
            <button className="col-auto btn-sm btn-danger" onClick={handleDelete}>Deletar</button>
            
          </div>
        </div>

      </div>

      
    </>    
  );
}

export default AnimePage;
