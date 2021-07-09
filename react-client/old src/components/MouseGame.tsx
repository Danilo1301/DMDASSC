import * as React from "react";
import { hot } from "react-hot-loader";
import { Helmet } from "react-helmet";

export class MouseGame extends React.Component {
    public state = {
        connected: false
    }

 

    public componentDidMount() {

        window.onload = function() {
            fetch('/assets/mousegame/script.ts').then(x => x.text()).then((result) => {
                const tsCode = result;
                const jsCode = window['ts'].transpile(tsCode);
                eval(`window['dmdasscserverurl'] = 'http://localhost:8080';`);
                eval(jsCode);
            })
        }

        
    }

    public render() {
        return (
            <>
                <span>helmet below</span>
                <Helmet>
                    <script src="https://cdn.socket.io/3.1.3/socket.io.min.js" type="text/javascript" />
                    <script src="https://unpkg.com/typescript@latest/lib/typescriptServices.js" type="text/javascript" />
                </Helmet>
            </>
        );
    }
}

export default hot(module)(MouseGame);
