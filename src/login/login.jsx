import React from "react";
import styles from "./main.module.css";
import {useNavigate} from "react-router-dom";

export function Login(){

    let navigate = useNavigate()

    const [name, setName] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [canPressLogin, setCanPressLogin] = React.useState(true);
    const [canPressRegister, setCanPressRegister] = React.useState(true);
    let content = {name: name, password: password};

    React.useEffect( () => {
        async function findMe () {
            try {
                let response = await fetch("api/findUserByToken", {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
                if (response.status === 200) {
                    let user = await response.json();
                    localStorage.setItem("user", JSON.stringify(user));
                    navigate("/groups");
                } else {
                    console.log("Not a user yet")
                }
            } catch (e) {
                console.log("Error connecting to the server");
            }
        }
       findMe();
    }, [navigate]);

    async function onRegister(){
        // make sure there is a valid user and password
        if (name === "" || password === ""){
            alert("Please enter a username and password");
            return;
        }
        try{
            setCanPressRegister(false);
            setCanPressLogin(false);
            let response = await fetch("/api/register", {
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify(content),
            });
            // check the response

            console.log(response.status)

            if (response.status === 200){
                console.log("user succesfully registered");
                // save the user data in local storage if the server responds with success
                const user = await response.json();
                localStorage.setItem("user", JSON.stringify(user));
                navigate("/groups");
            }

            if (response.status === 400) {
                alert("User already exists");

            }
        } catch {
            // error connecting to the server
            alert("Error connecting to the server");
        } finally {
            setCanPressRegister(true);
            setCanPressLogin(true);
        }
    }

    async function onLogin (){
        let userJson = localStorage.getItem("user") || null;
        try {
            setCanPressRegister(false);
            setCanPressLogin(false);
            let response = await fetch("/api/findUser", {
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify(content),
            });
            if (response.status === 200){
                let user = await response.json();
                localStorage.setItem("user", JSON.stringify(user));
                navigate("/groups");
            }
            else{
                alert("Invalid username or password");
            }
        }
        catch (e){
            alert("Error connecting to the server");
        } finally {
            setCanPressRegister(false);
            setCanPressLogin(false);
        }
    }

    return(
            <main className={styles["mainSection"]}>
                <h1 className={styles["title"]}>Yappersville</h1>
                <div className= {styles["main-bucket"]} >

                    <p>Login to chat with your buddies</p>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input type="text" id="name" className="form-control" placeholder="Your name here"
                               onChange={(e ) => setName(e.target.value)}/>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" id="password" className="form-control" placeholder="Your Password here"
                            onChange={(e) => setPassword(e.target.value) }/>
                    </div>


                    <div className="row">
                        <div className="col">
                            <button id = "RegisterButton" onClick={onRegister} disabled={!canPressRegister} type="button" className="btn btn-secondary">Register</button>
                        </div>
                        <div className="col">
                            <button id = "LoginButton" onClick={onLogin} disabled={!canPressLogin} type="submit" className="btn btn-primary">Login</button>
                        </div>
                    </div>

                </div>
            </main>
    );
}