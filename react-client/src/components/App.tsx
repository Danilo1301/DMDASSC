import * as React from "react";
import { Route, Routes } from 'react-router-dom';
import AnimeList from "./animeList/AnimeList";
import Home from "./Home";


const Navbar = function(props) {
  return (
    <>
      <nav className="navbar bg-primary">
        <div className="container">
          <a className="nav-link link-light" href="/">DMDASSC</a>
          <ul className="nav">
            <></>
          </ul>
        </div>
      </nav>
    </>
  );
}

const App = function() {
  return (
    <>
      <div className="App">
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="animelist/*" element={<AnimeList />} />
        </Routes>
      </div>
    </>
  );
}

export default App;

/*
 <Routes>
      <Route path="/" element={<App />}>
        <Route path="animelist" element={<AnimeList />}></Route>
      </Route>
    </Routes>
*/