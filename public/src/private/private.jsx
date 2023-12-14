import React from "react";
import styles from "./private.module.css"
import io from "socket.io-client";
import {Member} from "../Member";
import {Message} from "../Message"
import jsSHA from "jssha";
import {useNavigate} from "react-router-dom";
import {checkForWhiteSpace, parseMessage, updateDM, updateGroup} from "../hFunctions";

export function Private () {
    const [userObject, setUserObject] = React.useState(JSON.parse(localStorage.getItem("user")));
    let [dm, setDM] = React.useState({}); // this is a DM object
    const [chats, setChats] = React.useState([]);
    const [message, setMessage] = React.useState("");
    const [members, setMembers] = React.useState([]);
    const socket = React.useRef(null);
    const messageRef = React.useRef(null);
    const inputRef = React.useRef(null);

    let navigate = useNavigate();

    React.useEffect(() => {
        if (socket.current === null) {
            socket.current = io();
        }
        socket.current.on("chat message", (msg) => {
            console.log(msg)
            setChats(chats => [...chats, <Message name={msg.author} text={msg.text} />]);
        });
        initializeDM();
    }, [navigate])

    React.useEffect(() => {
        if (messageRef.current != null){
            messageRef.current.scrollTop = messageRef.current.scrollHeight;
        }
    }, [chats])

    const onSubmit = async () =>{
        if (message === "" || checkForWhiteSpace(message)) {
            alert("Please enter a real message");
            return;
        }
        let author = userObject.name;
        let nMessage = await parseMessage(message);
        //createTextBox(chatFrame, author, message);
        let chat = {
            author : author,
            time : Math.floor(Date.now() / 1000),
            text : nMessage,
        }
        // save the chats
        setDM(dm => {
            return {
                ...dm,
                messages: [...dm.messages, chat]
            };
        });
        updateDM(dm).then(r => (r.status === 200) ? console.log("success") : console.log("error"));
        socket.current.emit('chat message', {room: dm.id, author : chat.author, text : chat.text});
        inputRef.current.value = "";
        messageRef.current.scrollTop = messageRef.current.scrollHeight;
    }

    React.useEffect(() => {
        let membersArray = [];
        let messagesArray = [];
        socket.current.emit('join', dm.id);
        if (Object.keys(dm).length === 0){ // stops this from happening until we get our dm obj
            return;
        }
        for (let member of dm.members){
            if (member !== userObject.name) {
                membersArray.push(<Member type="chat" name={member}/>)
            }
        }
        for (let chat of dm.messages){
            messagesArray.push(<Message name={chat.author} text={chat.text}/>)
        }
        setMembers(membersArray)
        setChats(messagesArray)
        messageRef.current.scrollTop = messageRef.current.scrollHeight;
    }, [dm])

    const initializeDM = async () =>{
        let user = localStorage.getItem("user");
        setUserObject((JSON.parse(user)));
        // check if there is a user
        if (userObject == null){
            alert("Go login or register");
            navigate("/login");
            return
        }
        const dmID = userObject.currentDM; // this is an ID
        try {
            let response = await fetch(`/api/findDM/${dmID}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.status === 200) {
                dm = await response.json();
                setDM(dm)
            }
            else{
                alert("Error finding DM");
            }
        }
        catch (e){
            alert(e);
        }
    }

    return (
        <main className={styles["mainContent"]}>
            <div id = "allUsers" className ={styles["users"]}>
                <h4>Users</h4>
                {
                    members.map((element, index) => {
                        return <div key = {index}>{element}</div>
                    })
                }
            </div>

            <div className = {styles["chat"]}>
                <h4 id = "chatTitle-private">Chat Box</h4>
                <div ref = {messageRef} id = {styles["chatFrame-private"]}>
                    <div className = {styles["filler"]}></div>
                    {
                        chats.map((element, index) => {
                            return <div key = {index}>{element}</div>
                        })
                    }
                </div>

                <form onSubmit={(event) => (event.preventDefault())}>
                    <div id = {styles["inputSection"]}>
                        <input ref = {inputRef} onChange={(event) => (setMessage(event.target.value))}
                               type="text" id="chatbox-private" placeholder="type here to chat"/>
                        <button onClick = {onSubmit} id = "userSubmitButton-private">Submit</button>
                    </div>
                </form>

            </div>

        </main>
    )
}