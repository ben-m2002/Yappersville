


function onRegister (){
    const nameEl = document.querySelector('#name');
    const passwordEl = document.querySelector('#password');

    if (nameEl.value === "" || passwordEl.value === ""){
        alert("Please enter a username and password");
        return;
    }

    let myChats = {  // this will create a chats objects that will be used to store the chats
        author: nameEl.value,
        groupChats: {  // the string will be the group name

        },
        privateChats : { // the string will be the private message bame

        }
    }

    let myGroups = [] // this will have objects for the group data corresponding to the groups


    localStorage.setItem("user", nameEl.value);
    localStorage.setItem("password", passwordEl.value);
    localStorage.setItem("myChats", JSON.stringify(myChats));
    localStorage.setItem("myGroups", JSON.stringify(myGroups));

    window.location.href = "groups.html";
}

function onLogin (){
    const nameEl = document.querySelector('#name');
    const passwordEl = document.querySelector('#password');

    const user = localStorage.getItem("user");
    const password = localStorage.getItem("password");

    console.log(user);
    console.log(password);

    if (user === nameEl.value && password === passwordEl.value){
        console.log("login successful");
        window.location.href = "groups.html";
    }
    else{
         alert("Invalid username or password");
    }

}

