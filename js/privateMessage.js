function createTextBox (author, message){
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

function onSubmit () {
    let message = userTextBox.value;

    if (message === "" || checkForWhiteSpace(message)) {
        alert("Please enter a real message");
        return;
    }

    let userObject = JSON.parse(user);
    let author = userObject.name;

    createTextBox(author, message);

    // Now we gotta save it

    let currentGroup = returnCurrentGroup();

    let chat = {
        author : author,
        time : 0,
        text : message,
    }


    // now we gotta save it to local storage
    currentGroup.allChats.push(chat);
    localStorage.setItem("groups", JSON.stringify(allGroups));

}

userTextBox.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        onSubmit();
    }
})
