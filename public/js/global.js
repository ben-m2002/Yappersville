logoutButton = document.getElementById("logout");


function checkForWhiteSpace (s){
    let re = /^\s+$/;
    return re.test(s);
}

function createTextBox (chatFrame, author, message){
     let div = document.createElement("div");
    div.className = "textfield";

    let p1 = document.createElement("p");
    p1.className = "textfield-name";

    let p2 = document.createElement("p");
    p2.className = "textfield-text";

    p1.textContent = author;
    p2.textContent = message;

    div.appendChild(p1);
    div.appendChild(p2);

    chatFrame.appendChild(div);

    chatFrame.scrollTop = chatFrame.scrollHeight;
}

function debounce (func, wait){
    let timeout;

    return function executedFunction (){
        const later = () => {
            clearTimeout(timeout);
            func();
        }

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    }
}

function hashString(str) {
    let shaObj = new jsSHA("SHA-256", "TEXT");
    shaObj.update(str);
    return shaObj.getHash("HEX");
}

async function updateUser (userObject){
    return await fetch("/api/updateUser", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userObject),
    })
}

async function updateGroup (group){
    return await fetch("/api/updateGroup", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(group),
    })
}

async function updateDM (dm){
    return await fetch("/api/updateDM", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dm),
    })
}


async function parseMessage (message){
    // make sure it's actually a joke
    if (message !== "/joke"){
        return message
    }
    try {
        let response = await fetch ("https://icanhazdadjoke.com/", {
            method: "GET",
            headers: {
                "Accept": "application/json",
            }
        })
        if (response.status === 200){
            let data = await response.json();
            return data.joke;
        }
        else{
            return "Error getting joke"
        }
    }catch (e){
        console.log(e)
        return "Error getting joke"
    }
}

function displayMembers (members, usersDiv){
    while (usersDiv.firstChild){
        usersDiv.removeChild(usersDiv.firstChild)
    }
    for (let member of members){

        let userDiv = document.createElement("div");
        userDiv.className = "userBox";

        let button = document.createElement("button");
        button.className = "userBoxButton";
        button.textContent = member;

        button.onclick = async function () {
            let userObject = JSON.parse(user);
            let namesArray = [userObject.name, member];
            let sortedNamesString = namesArray.sort().join('');
            let dmID = hashString(sortedNamesString);

            // check if dm exists, if not create it

            let DM = null

            try {
                let response = await fetch(`/api/findDM/${dmID}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.status === 200){
                    DM = await response.json();
                }
            }catch (e){
                alert(e);
                return
            }

            if (DM == null){
                DM = {
                    members: [userObject.name, member],
                    messages: [],
                    id: dmID,
                }
                // put dm on server
                try {
                    let response = await fetch("/api/create_dm", {
                        method : "POST",
                        headers : {
                            "Content-Type": "application/json",
                        },
                        body : JSON.stringify(DM),
                    });
                    if (response.status === 200){
                        console.log("DM created");
                    }
                    else{
                        alert("Error creating DM");
                        return;
                    }
                }catch (e){
                    alert(e);
                    return;
                }
            }
            // make this persist on the server
            userObject.currentDM = dmID;
            localStorage.setItem("user", JSON.stringify(userObject));
            await updateUser(userObject); // server update
            window.location.href = "private.html";
        }

        userDiv.appendChild(button);
        usersDiv.appendChild(userDiv);
    }
}


async function logout (){
    try {
        const response = await fetch("/api/logout", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.status === 200){
            localStorage.clear()
            window.location.href = "index.html";
        }
    }
    catch (e){
        alert(e);
    }
}

logoutButton.addEventListener("click", logout);
logoutButton.style.color = "red";