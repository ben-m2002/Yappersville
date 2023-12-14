import React from "react";
import {useNavigate} from 'react-router-dom';
import styles from "./groupsbutton.module.css"

export function GroupButton(props)  { // props id
    const navigate = useNavigate();

    const handleClick = () => {
        let userJson = localStorage.getItem("user");
        let userObject = JSON.parse(userJson);
        userObject.currentGroup = props.id;
        localStorage.setItem("user", JSON.stringify(userObject));
        navigate("/chat");
    }

    return (
        <div id = "groups-card">
            <button onClick={handleClick} className={styles["group-grid-button"]}>
                {props.name}
                <img src = {props.image} alt = "image" width = "50px"
                     height = "50px"
                    className={styles["group-grid-img"]}>
                </img>
            </button>
        </div>
    )
}