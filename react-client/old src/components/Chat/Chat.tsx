import * as React from "react";
import { hot } from "react-hot-loader";
import './Chat.css';

import openSocket from 'socket.io-client';
import ChatMessage from "./ChatMessage";

class Chat extends React.Component {
    public socket;

    public user;
    public users = [];
    public guilds = [];

    public state = {
        chatMessageInput: '',
        renderingGuild: 0,
        update: 0,
        timestamp: ""
    }

    constructor(props) {
        super(props);
        
        this.onInputchange = this.onInputchange.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }

    onInputchange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    getGuildById(guildId)
    {
        for (const guild of this.guilds) if(guild['id'] == guildId) return guild;
        return;
    }

    sendMessage() {
        let chatMessageInput = this.state.chatMessageInput;
        this.socket.emit('send_guild_message', {guildId: this.guilds[this.state.renderingGuild]['id'], message: chatMessageInput});
        this.setState({chatMessageInput: ''});
    }

    forceUpdate() { this.setState({update: (this.state.update || 0) + 1 }); }

    connectToServer() {
        const isDev = (process.env.NODE_ENV || "").trim() === 'development';

        this.socket = openSocket(isDev ? 'http://localhost:3000/api/chat' : '/api/chat', {
            transports: ['websocket'],
            path: '/socket',
        });

        this.socket.on('new_message', data => {
            console.log(data)
            this.forceUpdate();
        });

        this.socket.on("connect", () => {
            console.log("connected")
        })

        this.socket.on("on_guild_message", (data) => {
            console.log("on_guild_message", data)

            var guild = this.getGuildById(data.guildId);

            if(guild) {
                var messages: any = guild['messages'];
                messages.unshift(data.message);;
            }
            
            this.forceUpdate();
        })

        this.socket.on("on_connect_info", (data) => {
            console.log('on_connect_info', data)

            this.user = data.user;
            this.guilds = data.guilds;
            this.forceUpdate();
        })

        this.socket.on("guild_member_info", (data) => {
            console.log('guild_member_info', data)

            var guild: any = this.getGuildById(data.guildId);

            guild.members[data.member.id] = data.member;

            this.forceUpdate();
        })
        

        this.socket.on("on_member_enter_guild", (data) => {
            console.log("on_member_enter_guild", data)

            var guild;

            for (const g of this.guilds) {
                if(g['id'] == data.guildId) {guild = g; break;}
            }

            guild.members[data.member.id] = data.member;
            
            console.log(guild)

  
        })

        
    }

    componentDidMount() {
        document.body.id = "chat";

        this.connectToServer();
    }


    render() {
        let messagesHtml = '';

        var guild: any = this.guilds[this.state.renderingGuild];

        if(guild) {
            var messages: any = this.guilds[this.state.renderingGuild]['messages'];

            messagesHtml = messages.map((message) => {
                var name;
                var content = message.content;
                
                if(message.member)
                {
                    name = guild.members[message.member].nickname;

                    content = `<span style="color: #a4a4a4">${content}</span>`
                } else {
                    content = `<span style="color: #ecff44">${content}</span>`
                }

                var time = new Date(message.time).getTime()-new Date().getTimezoneOffset()*60*1000;

                return <ChatMessage key={message.id} name={name} content={content} time={time}/>
            });
        }

        

        
        const groupsMenu = '';

        /*
        const groupsMenu = this.channels.map((channel) => {


            return <button> {channel.name} </button>
        });
        */


        return (
            <>
                <div className="d-flex flex-column h-100">
                    <div className="content bg-dark">Chat</div>

                    <div className="content flex-grow-1 overflow-auto">
                        <div className="d-flex flex-row w-100 h-100">

                            <div className="mb-auto overflow-auto h-100 d-flex flex-column" style={{width: '0px'}}>
                                {groupsMenu}
                            </div>

                            <div className="d-flex flex-column h-100 w-100">
                                <div className="content" style={{display: 'none'}}> submenu </div>
                                <div className="mb-auto overflow-auto overfl h-100 d-flex flex-column-reverse">
                                    {messagesHtml}
                                </div>
                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="col p-0">
                                            <input
                                                className="w-100"
                                                name="chatMessageInput"
                                                type="text"
                                                value={this.state.chatMessageInput}
                                                autoComplete="off"
                                                onChange={this.onInputchange}
                                            />
                                        </div>
                                        <div className="col-2 p-0">
                                            <button className="w-100" onClick={this.sendMessage}>Send</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                    <div className="content bg-dark" style={{display: 'none'}}>{this.state.timestamp}</div>
                </div>
            </>
        )
    }
}

export default hot(module)(Chat);
