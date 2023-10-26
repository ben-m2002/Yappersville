const nameEl = document.querySelector('#name');
const passwordEl = document.querySelector('#password');


function onRegister (){
    if (nameEl.value === "" || passwordEl.value === ""){
        alert("Please enter a username and password");
        return;
    }
    let user = {
        name : nameEl.value,
        password : passwordEl.value,
        chats : {
            author: nameEl.value,
            groupChats: [],
            privateChats : [],
        },
        groups : [],
        currentGroup : null, // current group the user has picked
    }
    localStorage.setItem("user", JSON.stringify(user));
    window.location.href = "groups.html";
}

function onLogin (){
    let userJson = localStorage.getItem("user");
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

