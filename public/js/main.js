const nameEl = document.querySelector('#name');
const passwordEl = document.querySelector('#password');


async function getMe (){
    // find the most recent user on the cookie, log them in if they exist
    // and redirect to the groups page
    try{
        let response = await fetch("/api/findUserByToken", {
            method : 'GET',
            headers : {
                'Content-Type' : 'application/json'
            },
        });
        if (response.status === 200){
            let user = await response.json();
            localStorage.setItem("user", JSON.stringify(user));
            window.location.href = "groups.html";
        }
        else{
            console.log("Not a user yet")
        }
    }catch (e){
        console.log("Error connecting to the server");
    }
}

async function onRegister (){
    if (nameEl.value === "" || passwordEl.value === ""){
        alert("Please enter a username and password");
        return;
    }
    // send this data to the server
    let content = {
        name : nameEl.value,
        password : passwordEl.value,
    }
    try{
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
            window.location.href = "groups.html";
        }

        if (response.status === 400) {
            alert("User already exists");

        }
    } catch {
        // error connecting to the server
        alert("Error connecting to the server");

    }
}

async function onLogin (){
    let userJson = localStorage.getItem("user") || null;
    const content = {
        name : nameEl.value,
        password : passwordEl.value,
    }
    try {
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
            window.location.href = "groups.html";
        }
        else{
            alert("Invalid username or password");
        }
    }
    catch (e){
        alert("Error connecting to the server");
    }
}

async function onLogout (){
    localStorage.clear();
    window.location.href = "index.html";
}

getMe()
