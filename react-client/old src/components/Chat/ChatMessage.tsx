import * as React from "react";
import { hot } from "react-hot-loader";

import openSocket from 'socket.io-client';

class ChatMessage extends React.Component<{name: string, time: number, content: string}> {
    render() {

        var time = this.props.time;
        var timeString = new Date(time).toUTCString().split(" ")[4].slice(0, 5);

        return (
            
            <div className="d-flex flex-row p-1">
                <div className="flex-grow-1">
                    {this.props.name != undefined ? (<b style={{marginRight: '3px'}}>{this.props.name}:</b>) : ''}

                    <span className="" dangerouslySetInnerHTML={{__html: this.props.content}}></span>
                </div>
                <small>{timeString}</small>
            </div>
        )
    }
}

export default hot(module)(ChatMessage);
