
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