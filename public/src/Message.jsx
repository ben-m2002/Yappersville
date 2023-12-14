import React from 'react';
import styles from "./message.module.css"

export function Message(props) {
    return (
        <div className={styles["text-field"]}>
            <p className={styles["textfield-name"]}>
                {props.name}
            </p>
            <p className ={styles["textfield-text"]}>
                {props.text}
            </p>
        </div>
    )
}