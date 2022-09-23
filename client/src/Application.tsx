import React from 'react';
//import logo from './logo.svg';
import './Application.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from './pages/home/Home';
import AnimeList from './pages/animeList/AnimeList';
import MainNavbar from './components/MainNavbar';

//https://react-bootstrap.netlify.app/components/figures/

const App: React.FC = () =>
{
  return (
    <>
      <MainNavbar></MainNavbar>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/animelist*" element={<AnimeList/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App