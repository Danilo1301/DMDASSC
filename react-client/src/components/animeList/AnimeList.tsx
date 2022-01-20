import * as React from "react";
import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import AnimePage from "./AnimePage";
import New from "./New";

export interface Anime {
  id: string
  name: string
  watchedEpisodes: number 
  totalEpisodes: number 
  watchedOvas: number 
  totalOvas: number 
  nextEpisodeDate?: number
  lastUpdated: number
}


const requestAnimes = function(callback: (animes: Anime[]) => void) {

  const requestOptions = {
    method: 'GET',
    //headers: { 'Content-Type': 'application/json' },
    //body: JSON.stringify({ title: 'React Hooks POST Request Example' })
  };

  fetch('/api/animelist/animes', requestOptions)
    .then(response => response.json())
    .then((animes: Anime[]) => {

      callback(animes);
  });

  /*
  fetch('/api/animelist/animes', requestOptions)
      .then(response => response.json())
      .then(data => {

        console.log(data)

      });
      */

}

const onClickAnime = function(id: string) {
  console.log("onClickAnime", id)

  location.href = "/animelist/anime/" + id
}


const Anime = function(props) {
  const anime: Anime = props.data;

  const totalOvas = anime.totalOvas;
  const watchedOvas = anime.watchedOvas;
  const totalEpisodes = anime.totalEpisodes;
  const watchedEpisodes = anime.watchedEpisodes;

  const onGoing: boolean = totalEpisodes == 0;

  const imageSrc = "";

  let badgeStyle = "warning";
  let badgeText = "Assistindo";
  
  if(onGoing) {
    
    let nextEpText = ": ?";
    if(anime.nextEpisodeDate) {
      const days = Math.ceil(daysBetween(new Date(), new Date(anime.nextEpisodeDate)));
      nextEpText = " em " + days + " dias"
    }
    
    
    badgeStyle = "info";
    badgeText = "Novo episódio" + nextEpText;
  } else {
    if(watchedEpisodes == totalEpisodes) {

      badgeText = "Assistido";
      badgeStyle = "success";

      if(totalOvas > 0 && totalOvas > watchedOvas) {
        badgeStyle = "warning";
        badgeText = "Incompleto";
      }
    }

    if(watchedEpisodes == 0) {
      badgeStyle = "secondary";
      badgeText = "Não assistido";
    }
  }

  const description = (
    <>
      <div>
        <span className={"badge bg-" + badgeStyle}> { badgeText } </span>
      </div>

      <div> { watchedEpisodes } { onGoing ? "" : " / " + totalEpisodes} episódios assistidos </div>
      
      { totalOvas > 0 ? (
          <div>{watchedOvas} / {totalOvas} OVAs</div>
        ) : ("")
      }

    </>
  );

  return (
    <>
      <div className="border p-2" onClick={() => onClickAnime(anime.id)}>
        <div className="row">
          <div className="col-auto">
            <div className="bg-light" style={ {width: 64, height: 64} }>
              { imageSrc != "" ? (
                  <img src={imageSrc} width="100%" height="100%"></img>
                ) : ("")
              }
            </div>
          </div>
          <div className="col">
            <b> { anime.name } </b>
            { description }
          </div>
          
        </div>
      </div>
    </>
  );
}

let requestedData: boolean = false;

const List = function()
{
  const [animeList, setAnimeList] = useState<Anime[]>([]);

  if(!requestedData) {
    requestedData = true;

    requestAnimes(animes => {
      setAnimeList(animes)
  
      console.log("setAnimeList")
    })
  }
  
  const handleEraseKey = () => {
    eraseCookie('animelist-key')
  }
  
  const handleNew = () => {
    
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: requestAccessKey() })
    };
  
    fetch('/api/animelist/new', requestOptions)
      .then(response => response.json())
      .then((data) => {
  
        
        console.log(data)
        onClickAnime(data.id)
        
    });

  }


  return (
    <>
      <div className="jumbotron text-center">
        
      </div>

     

      <div className="container">
        
        <button className="col-auto btn-sm btn-primary mt-3 mb-3" onClick={handleNew}>Adicionar anime</button>
       
      {
        animeList.sort((a, b) => {


          return b.lastUpdated - a.lastUpdated;
        }).map(anime => <Anime data={anime}/> )
      }
        
        <button className="col-auto btn-sm btn-primary mt-3 mb-3 ml-3" onClick={handleEraseKey}>Erase key</button>
      </div>
    </>
    
  );
}

const AnimeList = function()
{

  return (
    <>
      <Routes>
        <Route path="/" element={<List />} />
        <Route path="/new" element={<New />} />
        <Route path="/anime/:id" element={<AnimePage />} />
      </Routes>
    </>
  );
}

export default AnimeList;

function treatAsUTC(date: Date) {
  var result = new Date(date);
  result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
  return result;
}

function daysBetween(startDate, endDate) {
  var millisecondsPerDay = 24 * 60 * 60 * 1000;
  return (treatAsUTC(endDate).getTime() - treatAsUTC(startDate).getTime()) / millisecondsPerDay;
}


function formatTime(date: Date) {
  const offset = date.getTimezoneOffset();
  date = new Date(date.getTime() - (offset*60*1000))
  const s = date.toISOString().split('T');
  const timeStr = `${s[0]} ${s[1].split(".")[0]}`;
  return timeStr;
}

function setCookie(name,value,days) {
  var expires = "";
  if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days*24*60*60*1000));
      expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}
function eraseCookie(name) {   
  document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

export function requestAccessKey() {
  
  const key = getCookie("animelist-key");

  if(key != null) return key;

  const newKey = prompt("Insert key")

  setCookie('animelist-key', newKey, 999);

  return newKey;
}