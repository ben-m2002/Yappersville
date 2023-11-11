
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
