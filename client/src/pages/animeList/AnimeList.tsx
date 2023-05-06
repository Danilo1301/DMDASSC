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

//<Route path="/new" element={<New />} />
//<Route path="/anime/:id" element={<AnimePage />} />