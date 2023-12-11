import React from "react";
import styles from "./main.module.css";

export function Login(){
    return(
            <main className={styles["mainSection"]}>
                <h1 className={styles["title"]}>Yappersville</h1>
                <div className= {styles["main-bucket"]} >

                    <p>Login to chat with your buddies</p>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input type="text" id="name" className="form-control" placeholder="Your name here"/>
                    </div>


                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" id="password" className="form-control" placeholder="Your Password here"/>
                    </div>


                    <div className="row">
                        <div className="col">
                            <button id = "RegisterButton" type="button" className="btn btn-secondary">Register</button>
                        </div>
                        <div className="col">
                            <button id = "LoginButton" type="submit" className="btn btn-primary">Login</button>
                        </div>
                    </div>

                </div>
            </main>
    );
}