import React from 'react'
import {useNavigate} from "react-router-dom";
import styles from "./member.module.css"
import {hashString, updateUser} from "./hFunctions";

export function Member(props) {
    const [userObject, setUserObject] = React.useState(JSON.parse(localStorage.getItem("user")));
    let navigate = useNavigate();

    React.useEffect(() => {
        // Update userObject state if localStorage changes
        const handleStorageChange = () => {
            setUserObject(JSON.parse(localStorage.getItem("user")));
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const onButtonClick = async () => {
        let namesArray = [userObject.name, props.name];
        let sortedNamesString = namesArray.sort().join('');
        let dmID = hashString(sortedNamesString);
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
                members: [userObject.name, props.name],
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
        navigate("/private")
    }

    return (
        props.type === "chat" ? (
            <div className={styles["userBox"]}>
                <button onClick={onButtonClick} className={styles["userBoxButton"]}>
                    {props.name}
                </button>
            </div>
        ) : (
            <div className={styles["userBoxDM"]}>
                <button onClick={onButtonClick} className={styles["userBoxButton"]}>
                    {props.name}
                </button>
            </div>
        )
    );

}