import * as React from "react";
import { Routes, Route, Link } from "react-router-dom";

function Section(props) {
  return (
    <>
      <div className="mb-3 border">
        <div className="p-1 bg-primary text-white text-center">
          <h4>{props.title}</h4>
        </div>
        <div className="d-grid">
          {props.children}
        </div>
      </div>
    </>
  );
}

const PageItem = function(props) {
  return (
    <>
      <a className="btn btn-block" href={props.href}>
        { props.text }
      </a>
    </>
  )
}

const Home = function()
{
  return (
    <>
      <div className="container mt-3">

        <Section title="Jogos">
          <PageItem text="Cafe Mania" href="https://cafemania.glitch.me"/>
          <PageItem text="Game" href="game"/>
        </Section>

        <Section title="Projetos">
          <PageItem text="VehicleSirenLights (GTA SA Mod)" href="https://www.youtube.com/watch?v=6N7fDUZuDi4"/>
          <PageItem text="Crab Game Mod" href="https://www.youtube.com/watch?v=UNDTeMtOLVY"/>
          <PageItem text="Chat" href="https://dmdassc-chat1.glitch.me"/>
          <PageItem text="Video Manager" href="https://github.com/Danilo1301/video-manager"/>
          <PageItem text="Voice Chat" href="voicechat"/>
          <PageItem text="Anime List" href="animelist"/>
        </Section>
        
      </div>
    </>    
  );
}

export default Home;
