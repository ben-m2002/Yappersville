import React from "react";
import styles from "./groups.module.css";

export function Groups() {
    return (
        <main className= {`${styles["mainContainer"]} container-fluid`} >
            <h4 className="text-center mb-4">Pick a group</h4>

            <div className= {styles["group-grid"]} id = "groups-grid">

            </div>
            <div className="row">

                <div className="col-md-6">
                    <label htmlFor="join-group">Join A Group!</label>
                    <input type="text" id="join-group" className="form-control mb-2" placeholder="Enter a group ID" />
                    <button id = "join-button" type="submit" className="btn btn-primary">Go</button>
                </div>

                <div className="col-md-6">
                    <label htmlFor="create-group">Create a Group!</label>
                    <input type="text" id="create-group" className="form-control mb-2" placeholder="Enter a group name" />
                    <button  id = "create-button" type="submit" className="btn btn-primary">Go</button>
                    <input type="file" id="image_upload" accept="image/*" style={{ display: "none" }} />
                    <button  type="submit" className="btn btn-secondary">Upload Image</button>
                </div>
            </div>
        </main>
    )
}