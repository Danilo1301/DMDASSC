import React, { useState } from 'react';

import { Anime } from '../../../../../server/src/animeList/anime'

interface AnimeItemProps {
    anime: Anime;
}

const AnimeItem: React.FC<AnimeItemProps> = (props) =>
{
    const anime = props.anime;

    const onGoing: boolean = anime.totalEpisodes == 0;
    
    //onClickAnime
    const onClickAnime = () => {
        console.log("onClickAnime", anime);
        window.location.href = "/animelist/anime/" + anime.id;
    }


    //badge (spaghetti)
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
        if(anime.watchedEpisodes == anime.totalEpisodes) {

        badgeText = "Assistido";
        badgeStyle = "success";

        if(anime.totalOvas > 0 && anime.totalOvas > anime.watchedOvas) {
            badgeStyle = "warning";
            badgeText = "Incompleto";
        }
        }

        if(anime.watchedEpisodes == 0) {
            badgeStyle = "secondary";
            badgeText = "Não assistido";
        }
    }
    
    //description
    const description = (
        <>
          <div>
            <span className={"badge bg-" + badgeStyle}> { badgeText } </span>
          </div>
    
          <div> { anime.watchedEpisodes } { onGoing ? "" : " / " + anime.totalEpisodes} episódios assistidos </div>
          
          { anime.totalOvas > 0 ? (
              <div>{anime.watchedOvas} / {anime.totalOvas} OVAs</div>
            ) : ("")
          }
    
        </>
    );

    //imageSrc
    let imageSrc = anime.imageUrl || "";
      
    return (
        <>
            <div className="border p-2" onClick={() => onClickAnime()}>
                <div className="row">
                    <div className="col-auto">
                        <div className="bg-light" style={ { minWidth: 100, height: 128} }>
                            <img src={imageSrc} width="100%" height="100%"></img>
                        </div>
                    </div>
                    <div className="col">
                        <b> { anime.name } </b>
                        { description }
                    </div>
                </div>
            </div>
        </>
    )
}

export default AnimeItem;


function treatAsUTC(date: Date) {
    var result = new Date(date);
    result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
    return result;
}

function daysBetween(startDate: Date, endDate: Date) {
    var millisecondsPerDay = 24 * 60 * 60 * 1000;
    return (treatAsUTC(endDate).getTime() - treatAsUTC(startDate).getTime()) / millisecondsPerDay;
}
  