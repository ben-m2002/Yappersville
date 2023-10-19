const nameEl = document.querySelector('#name');
const passwordEl = document.querySelector('#password');


function onRegister (){
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
    const user = localStorage.getItem("user");
    const password = localStorage.getItem("password");

    if (user === nameEl.value && password === passwordEl.value){
        window.location.href = "groups.html";
    }
    else{
         alert("Invalid username or password");
    }

}

