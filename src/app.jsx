import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import {BrowserRouter as Router, Routes, Route, Link, BrowserRouter, NavLink} from "react-router-dom";
import {Login} from "./login/login";
import {Groups} from "./groups/Groups";
import {Chat} from "./chat/chat";
import {Private} from "./private/private";


export default function App () {
    const [user, setUser] = React.useState(localStorage.getItem("user") || "");

    return (
        <BrowserRouter>
            <div>
                <header className = "container-fluid">
                    <nav style = {{backgroundColor : "#554156"}} className = "navbar fixed-top navbar-dark">
                        <ul style = {{marginLeft: "5em"}}>
                            <li className = "nav-item">
                                <NavLink className = "nav-link" to="">Home</NavLink>
                            </li>
                            <li className = "nav-item">
                                <NavLink className = "nav-link" to="groups">Groups</NavLink>
                            </li>
                            <li className = "nav-item">
                                <NavLink className = "nav-link" to="chat">Chat</NavLink>
                            </li>
                            <li className = "nav-item">
                                <NavLink className = "nav-link" to="private">Private</NavLink>
                            </li>
                        </ul>
                    </nav>
                </header>
                    <Routes>
                        <Route path = "/" element = {<Login/>}/>
                        <Route path = "/groups" element = {<Groups/>}/>
                        <Route path = "/chat" element = {<Chat/>}/>
                        <Route path = "/private" element = {<Private/>}/>
                    </Routes>
                <footer>
                    <span className="text-reset">Author Name(s)</span>
                    <a href="https://github.com/ben-m2002/Yappersville"> GitHub</a>
                    {/* <button id = "logout" onClick="" >Logout</button>  */}
                </footer>
            </div>
        </BrowserRouter>
    );
}