import React from "react";
import styles from "./chatpage.module.css"

export function Chat (){
    return(
        <main className={styles["mainContent"]}>

            <div id = "allUsers" className = {styles["users"]}>
                <h4>Users</h4>
            </div>

            <div className = {styles["chat"]}>
                <h4 id = "chatTitle">Chat Box</h4>

                <div id = {styles["chatFrame"]}>
                    <div className ={styles["filler"]}></div>
                </div>


                <div id = {styles["inputSection"]}>
                    <input type="text" id="chatbox" placeholder="type here to chat"/>
                    <button id = "userSubmitButton" >Submit</button>
                    <div className ={styles["roomCode"]}>LOL</div>
                </div>

            </div>

            <div id = "allDMS" className ={styles["DMS"]}>
                <h4>DMS</h4>
            </div>

        </main>
    )
}