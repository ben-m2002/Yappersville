import React from "react";
import styles from "./chatpage.module.css"
import io from "socket.io-client";
import {Member} from "./Member";
import {Message} from "../Message"
import jsSHA from "jssha";
import {useNavigate} from "react-router-dom";
import {checkForWhiteSpace, parseMessage, updateGroup} from "../hFunctions";

export function Chat (){
    const [userObject, setUserObject] = React.useState(JSON.parse(localStorage.getItem("user")));
    let [currentGroup, setCurrentGroup] = React.useState({});
    const [chats, setChats] = React.useState([]);
    const [message, setMessage] = React.useState("");
    const [roomCode, setRoomCode] = React.useState("");
    const [openDMs, setOpenDMs] = React.useState([]);
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
           // createTextBox(chatFrame, msg.author, msg.text); FIX THIS LATER
        });

        socket.current.on("update users", (members) => {
            console.log("receive user update")
            // displayMembers(members, usersDiv); FIX THIS IN A BIT
        });
        initializeGroup();
    }, [navigate])

    React.useEffect(() => {
        if (messageRef.current != null){
            messageRef.current.scrollTop = messageRef.current.scrollHeight;
        }
    }, [chats])

    React.useEffect(() => {
        let membersArray = [];
        let chatsArray = []
        let openDMSArray = [];

        if (Object.keys(currentGroup).length === 0){
            return;
        }
        for (let member of currentGroup.members){
            membersArray.push(<Member type = "chat" name = {member} />)
        }

        for (let chat of currentGroup.allChats){
            chatsArray.push(<Message name ={chat.author} text ={chat.text} />)
        }

        async function getOpenDMS (){
            try{
                let response = await fetch(`/api/getUserDMS/${userObject.name}`, {
                    method : "Get",
                    headers : {
                        'Content-Type' : 'application/json'
                    },
                });
                if (response.status === 200){
                    const openDMS = await response.json();
                    for (let dm of openDMS){
                        for (let m of dm.members){
                            if (m !== userObject.name){
                                openDMSArray.push(<Member type = "dm" name = {m} />)
                            }
                        }
                    }
                    setOpenDMs(openDMSArray);
                }
                else{
                    console.log("User has no open dms")
                }
            }
            catch (e){
                alert(e)
            }
        }

        getOpenDMS();
        setMembers(membersArray)
        setChats(chatsArray)
        messageRef.current.scrollTop = messageRef.current.scrollHeight;

    }, [currentGroup])



    const initializeGroup = async () => {
        let user = localStorage.getItem("user");
        const userObject = JSON.parse(user);
        setUserObject(userObject)
        // check if user exists
        if (userObject == null){
            alert("Go login or register");
            navigate("/login");
            return
        }
        const currentGroupID = userObject.currentGroup; // this is an ID
        try {
            let response = await fetch(`/api/findGroup/${currentGroupID}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.status === 200) {
                // continue
                let currentGroup = await response.json();
                setCurrentGroup(currentGroup);
            }
            else{
                alert("Error finding group");
            }
        }
        catch (e){
            alert(e);
        }
    }


    const sendMessageOnEnter = async (event) => {
        event.preventDefault();
    }

     async function sendMessage() {
        if (message === "" || checkForWhiteSpace(message)) {
            alert("Please enter a real message");
            return;
        }
        let author = userObject.name;
        let newMessage = await parseMessage(message);
        let chat = {
            author : author,
            time : Math.floor(Date.now() / 1000),
            text : newMessage,
        }
         //setChats(chats => [...chats, <Message name={chat.author} text={chat.text} />]); // no need to this because it rerenders
         // Update the current group's chats in a similar manner
         setCurrentGroup(currentGroup => {
             return {
                 ...currentGroup,
                 allChats: [...currentGroup.allChats, chat]
             };
        });
        updateGroup(currentGroup).then(r => (r.status === 200) ? console.log("success") : console.log("error"));
        socket.current.emit('chat message', {room: currentGroup.id, author : chat.author, text : chat.text});
        inputRef.current.value = "";
        messageRef.current.scrollTop = messageRef.current.scrollHeight;
    }

    return(
        <main className={styles["mainContent"]}>
            <div id = "allUsers" className = {styles["users"]}>
                <h4>Users</h4>
                {
                   members.map((element, index) => {
                        return <div key = {index}>{element}</div>
                    })
                }
            </div>
            <div className = {styles["chat"]}>
                <h4 id = "chatTitle">{currentGroup.groupName}</h4>

                <div ref = {messageRef} id = {styles["chatFrame"]}>
                    <div className ={styles["filler"]}></div>
                    {
                        chats.map((element, index) => {
                        return <div key = {index}>{element}</div>
                        })
                    }
                </div>

                <form onSubmit={(event) => (sendMessageOnEnter(event))}>
                    <div id = {styles["inputSection"]}>
                        <input onChange={(event) => (setMessage(event.target.value))} type="text"
                               id="chatbox"
                               placeholder="type here to chat"
                               ref = {inputRef}
                            />
                        <button onClick = {sendMessage} id = "userSubmitButton" >Submit</button>
                        <div className ={styles["roomCode"]}>LOL</div>
                    </div>
                </form>
            </div>

            <div id = "allDMS" className ={styles["DMS"]}>
                <h4>DMS</h4>
                {
                    openDMs.map((element, index) => {
                        return <div key = {index}>{element}</div>
                    })
                }
            </div>

        </main>
    )
}