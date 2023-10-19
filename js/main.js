const nameEl = document.querySelector('#name');
const passwordEl = document.querySelector('#password');


function onRegister (){
    if (nameEl.value === "" || passwordEl.value === ""){
        alert("Please enter a username and password");
        return;
    }

    let myChats = {  // this will create a chats objects that will be used to store the chats
        author: nameEl.value,
        groupChats: [
            {}, // hold the chat the group it was in, and other data
        ],
        privateChats : [
            {}, // will hold the person conversing with and other data
        ]
    }

    let myGroups = [] // this will have objects for the group data corresponding to the groups


    localStorage.setItem("user", nameEl.value);
    localStorage.setItem("password", passwordEl.value);
    localStorage.setItem("myChats", JSON.stringify(myChats));
    localStorage.setItem("myGroups", JSON.stringify(myGroups));

    window.location.href = "groups.html";
}

function onLogin (){
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

