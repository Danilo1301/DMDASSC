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
          <PageItem text="Cafe Mania" href="cafemania"/>
          <PageItem text="Game" href="game"/>
        </Section>

        <Section title="Projetos">
          <PageItem text="Voice Chat" href="voicechat"/>
          <PageItem text="Anime List" href="animelist"/>
          <PageItem text="Video Manager" href="https://github.com/Danilo1301/video-manager"/>
          <PageItem text="VehicleSirenLights (GTA SA Mod)" href="https://github.com/Danilo1301/vehicle-siren-light-gtasa"/>
          <PageItem text="Chat" href="https://dmdassc-chat1.glitch.me"/>
        </Section>
        
      </div>
    </>    
  );
}

export default Home;
