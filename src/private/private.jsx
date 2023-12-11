import React from "react";
import styles from "./private.module.css"

export function Private () {
    return (
        <main className={styles["mainContent"]}>
            <div id = "allUsers" className ={styles["users"]}>
                <h4>Users</h4>
            </div>

            <div className = {styles["chat"]}>
                <h4 id = "chatTitle-private">Chat Box</h4>

                <div id = {styles["chatFrame-private"]}>
                    <div className = {styles["filler"]} ></div>
                </div>

                <div id = {styles["inputSection"]}>
                    <input type="text" id="chatbox-private" placeholder="type here to chat"/>
                    <button id = "userSubmitButton-private" onClick="">Submit</button>
                </div>

            </div>

        </main>
    )
}