const join_text = document.querySelector('#join-group');
const create_text = document.querySelector('#create-group');
const join_button = document.querySelector('#join-button');
const create_button = document.querySelector('#create-button');
const image_label = document.querySelector('#image_upload');
let imageData = null;

// This will be all the groups created by the local user
let groups = []
localStorage.setItem("groups", JSON.stringify(groups));

function generateUniqueID(){
    return (Date.now().toString(36) + Math.random().toString(36).substring(2, 5)).toUpperCase().substring(0, 8)
}

function getRawImage (event){
    const file = event.target.files[0];
    const reader = new FileReader();
    if (file && file.type.startsWith('image/')) {
        reader.onload = function () {
            imageData = reader.result
        };
        reader.onerror = function () {
            alert("Error reading file");
        }
        reader.readAsDataURL(file); // this is called first, then the onload function is called
    }
    else{
        alert("Please upload an image file");
    }
}


function onCreate (){
    const user = localStorage.getItem("user");
    const groupId = generateUniqueID();
    const groupName = join_text.value;

    if (groupName === "" || !checkForWhiteSpace(groupName)){
        alert("Please a real group name!");
        return;
    }

    if (imageData === null){
        alert("Please upload an image for the group");
    }

    let group = {
        "id" : groupId,
        "group_name" : groupName,
        "creator" : user,
        "dataCreated" : Date.now(),
        "profilePicture" : imageData,
        allChats : [
            {
                "author" : "Admin",
                "time" : 0,
                "text" : "This is just texter text",
            }
        ],
        "members" : [this.creator],
        "admins" : [this.creator],
    }

    let allGroups = JSON.parse(localStorage.getItem("groups"));
    allGroups.push(group);
    localStorage.setItem("groups", JSON.stringify(allGroups));

    console.log("Group created");
}

function onJoin (){
    const user = localStorage.getItem("user");
    const groupId = join_text.value;
}

image_label.addEventListener('change', getRawImage);