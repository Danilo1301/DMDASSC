import * as React from "react";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AppSecret from "./app-secret/AppSecret";

const NavbarItem = function(text, href, active)
{
  const className = `nav-link ${active ? "bg-light" : ""}`

  return (
    <>
      <li className="nav-item">
        <a className={className} href={href}>{text}</a>
      </li>
    </>
  )
}

const Navbar = function(props)
{
  const items = [
    ["Projetos", "projetos"],
    ["Game", "https://dmdassc-game.glitch.me"],
    ["Cafemania", "cafemania"],
    ["VoiceChat", "https://voice-chat-server.glitch.me"]
  ]

  return (
    <>
      <nav className="navbar shadow-sm">
        <div className="container">
          <a className="nav-link link-dark" href="/">DMDASSC</a>
          <ul className="nav">
            
            {
              items.map((item, index) => {
                const active = parseInt(props.activeItem) === index;

                return NavbarItem(item[0], item[1], active);
              })}
        
          </ul>
        </div>
      </nav>
    </>
  );
}

const App = function()
{
  return (
  <>
    <Router>
      <Switch>
        <Route path="/login" exact>
          <h1>LOGIN</h1>
        </Route>
        <Route path="/secret" exact>
          <AppSecret/>
        </Route>
        <Route>
          <Navbar activeItem='0'/>
        </Route>
      </Switch>
    </Router>
  </>
  );
}

export default App;
