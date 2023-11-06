const nameEl = document.querySelector('#name');
const passwordEl = document.querySelector('#password');


async function onRegister (){
    if (nameEl.value === "" || passwordEl.value === ""){
        alert("Please enter a username and password");
        return;
    }
    let user = {
        name : nameEl.value,
        password : passwordEl.value,
        chats : {
            author: nameEl.value,
        },
        groups : [],
        currentGroup : null, // current group the user has picked
        currentDM : null,
    }

    // send this data to the server

    try{
        let response = await fetch("/api/register", {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(user),
         });
         // check the response

        console.log(response.status)

        if (response.status === 200){
            console.log("user succesfully registered");
             // save the user data in local storage if the server responds with success
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

    if (userJson != null){
        let userObject = JSON.parse(userJson);
        let user = userObject.name;
        let password = userObject.password;

        if (user === nameEl.value && password === passwordEl.value){
            console.log("login successful");
            window.location.href = "groups.html";
        }
        else{
             alert("Invalid username or password");
        }
    }
    else{ // we will search in the database
        const content = {
            name : nameEl.value,
            password : passwordEl.value,
        }
        try {
           let response = await fetch("/api/users", {
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



}

