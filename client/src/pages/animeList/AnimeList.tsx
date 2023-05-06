import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AnimePage from './animePage/AnimePage';
import Home from './home/Home';

// import { Container } from './styles';

const AnimeList: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/anime/:id" element={<AnimePage />} />
        </Routes>
    )
}

export default AnimeList;

function setCookie(name: any, value: any, days: any) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
  }
function getCookie(name: any) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name: any) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

export function requestAccessKey() {
  
    const key = getCookie("animelist-key");

    if(key != null) return key;

    const newKey = prompt("Insert access key")

    setCookie('animelist-key', newKey, 999);

    return newKey;
}


export function resetAccessKey() {  
    eraseCookie('animelist-key');
}


//<Route path="/new" element={<New />} />
//<Route path="/anime/:id" element={<AnimePage />} />