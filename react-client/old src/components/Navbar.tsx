import * as React from "react";
import { hot } from "react-hot-loader";
import './Navbar.css';

export class Navbar extends React.Component {
    public render() {
        return (
            <>
                <nav className="main-nav container-fluid">
                    <div className="p-1 text-center row justify-content-between align-items-center">
                        <div className="col-2"><b>DMDASSC</b></div>
                        <div className="col">
                            <div className="row justify-content-end">
                                <a className="col-auto" href="/chat">Chat</a>
                                <a className="col-auto" href="/mousegame">Mouse Game</a>
                            </div>
                        </div>
                    </div>
                </nav>
            </>
        );
    }
}

export default hot(module)(Navbar);
