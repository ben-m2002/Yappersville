import React from "react";
import styles from "./groups.module.css";
import {GroupButton} from "./GroupButton";
import {useRef} from "react";
import {useNavigate} from "react-router-dom";
import {checkForWhiteSpace, updateUser, updateGroup} from "../hFunctions";

export function Groups() {

    const [joinGroupText, setJoinGroupText] = React.useState("");
    const [createGroupText, setCreateGroupText] = React.useState("");
    const [groupElements, setGroupElements] = React.useState([]);
    const [imageData, setImageData] = React.useState(null);
    const fileInputRef = useRef(null);
    const [canUseButtons, setCanUseButtons] = React.useState(true);

    const navigate = useNavigate();

    React.useEffect(() => {
        async function populateGroups(){
            let userObject = JSON.parse(localStorage.getItem("user"));
            if (userObject == null){
                alert("Go login or register");
                navigate("/login")
                return
            }
            let allGroups = null
            try{
                let response = await fetch("/api/userGroups?name=" + userObject.name, {
                    method : "Get",
                    headers : {
                        'Content-Type' : 'application/json'
                    },
                });
                if (response.status === 200){
                    allGroups = await response.json();
                }
                else{
                    alert("Error finding the users groups");
                }
            }catch (e){
                alert(e);
            }
            let elements = []
            for (let group of allGroups){
                let groupElement = <GroupButton key = {group.id} id = {group.id} name = {group.groupName} image = {group.profilePic} />
                elements.push(groupElement);
            }
            setGroupElements(elements, groupElements);
        }
        populateGroups();
    }, [navigate]);

    function generateUniqueID(){
        return (Date.now().toString(36) + Math.random().toString(36).substring(2, 5)).toUpperCase().substring(0, 8)
    }

    const handleFileButtonClick = () => {
        fileInputRef.current.click();
    }

    function getRawImage (event){
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setImageData(file)
        }
        else {
            alert("Please upload an image file");
            setImageData(null);
        }
    }

    const onCreate = async () => {
        let userJson = localStorage.getItem("user");
        let userObject = JSON.parse(userJson);
        const groupId = generateUniqueID();
        if (createGroupText === "" || checkForWhiteSpace(createGroupText) || imageData === null){
            alert("Please enter a group name or image");
            return;
        }
        if (userObject == null){
            alert("Go login or register");
            navigate("/login")
            return
        }
        let group = {
            id : groupId,
            groupName : createGroupText,
            creator : userObject.name, // in the future we will use a join so that if it updates in one place it updates in all places
            dateCreated : Date.now(),
            profilePic : "", // This will be s3 url
            allChats : [
                {
                    author : "Admin",
                    time : 0,
                    text : "This is just tester text",
                }
            ],
            members : [userObject.name], // in the future we will use a join so that if it updates in one place it updates in all places
            admins : [userObject.name], // in the future we will use a join so that if it updates in one place it updates in all places
        }
        try{
            setCanUseButtons(false);
            const formData = new FormData();
            formData.append("profilePic", imageData);
            formData.append('group', JSON.stringify(group));

            let response = await fetch("/api/createGroup", {
                method : "POST",
                body : formData,
            });

            if (response.status === 200){
                // update image
                let data = await response.json();
                group.profilePic = data.imageURL;
                // update the user object on client
                userObject.groups.push(group.id);
                userObject.currentGroup = group.id;
                localStorage.setItem("user", JSON.stringify(userObject));
                localStorage.setItem("currentGroup", JSON.stringify(group));

                // update the user object on server, async

                let response2 = await updateUser(userObject);

                if (response2.status === 200){
                    navigate("/chat");
                    console.log("user updated and group created")
                }
                else{
                    alert("Error updating user, make sure you're logged in");
                }
            }
            else{
                alert("Error creating group");
            }
        }catch (e){
            alert(e);
        } finally {
            setCanUseButtons(true);
        }
    }

    const onJoin = async () =>{
        const user = localStorage.getItem("user");
        let userObject = JSON.parse(user);
        if (joinGroupText === "" || checkForWhiteSpace(joinGroupText)){
            alert("Please enter a group ID");
            return;
        }
        if (userObject == null){
            alert("Go login or register");
            navigate("/login")
            return
        }
        let joinedGroup = null;
        try{
            setCanUseButtons(false);
            let response = await fetch(`/api/findGroup/${joinGroupText}`, {
                method : "Get",
                headers : {
                    'Content-Type' : 'application/json'
                },
            });
            if (response.status === 200){
                joinedGroup = await response.json();
            }
            else{
                alert("Error finding group");
                return;
            }
        }catch (e){
            alert(e);
            return;
        } finally {
            setCanUseButtons(true)
        }
        // alert user if group doesnt exit
        if (joinedGroup === null) {
            alert("Group not found");
            return;
        }
        // update values
        joinedGroup.members.push(userObject.name);
        userObject.groups.push(joinedGroup.id);
        userObject.currentGroup = joinedGroup.id;

        // update the server
        let response = await updateUser(userObject);
        let response2 = await updateGroup(joinedGroup);

        if (response.status === 200 && response2.status === 200){
           navigate("/chat");
        }
        else{
            alert("Error updating user or group")
        }
        // update the local storage
        localStorage.setItem("user", JSON.stringify(userObject));
    }

    return (
        <main className= {`${styles["mainContainer"]} container-fluid`} >
            <h4 className="text-center mb-4">Pick a group</h4>

            <div className= {styles["group-grid"]} id = "groups-grid">
                {
                    groupElements.map((element, index) => {
                        return <div key = {index}>{element}</div>
                    })
                }
            </div>

            <div className="row">

                <div className="col-md-6">
                    <label htmlFor="join-group">Join A Group!</label>
                    <input onChange={(e) => {setJoinGroupText(e.target.value)}} type="text" id="join-group" className="form-control mb-2" placeholder="Enter a group ID" />
                    <button disabled={!canUseButtons} id = "join-button" type="submit" className="btn btn-primary">Go</button>
                </div>

                <div className="col-md-6">
                    <label htmlFor="create-group">Create a Group!</label>
                    <input onChange={(e) => {setCreateGroupText(e.target.value)}} type="text" id="create-group" className="form-control mb-2" placeholder="Enter a group name" />
                    <button onClick = {onCreate} disabled={!canUseButtons}  id = "create-button" type="submit" className="btn btn-primary">Go</button>
                    <input onChange={(event) => (getRawImage(event))} ref={fileInputRef} type="file" id="image_upload" accept="image/*" style={{ display: "none" }} />
                    <button onClick={handleFileButtonClick}  type="submit" className="btn btn-secondary">Upload Image</button>
                </div>
            </div>
        </main>
    )
}