/* eslint-disable indent */
// In GradingAfterComp.jsx
import React from "react"
import { Link } from "react-router-dom"
import { ChevronDown } from "react-bootstrap-icons"
import styles from "./GradingAfterComp.module.css"

const GradingAfterComp = ({ id, name }) => {
	return (
		<div style={{ background: "#C9EEC3"}}>
            <div className={styles["technique-card"]} id={id}>
                <div className={styles["technique-info-container"]}>
                    <div className={styles["technique-name-container"]}>
                        <h5 className={styles["technique-name"]}>{name}</h5>
                    </div>
                    {/* if the technique object has count attribute then we will not render ChevronDown sign */}
                    <div className={styles["technique-arrow-container"]}>
                        <span>/52</span> {/* Points are now to the left of the icon */}
                            <Link to={"google.com"}>
                                <ChevronDown />
                            </Link>
                    </div>
                
                </div>
            </div>
        </div>
    )
}

export default GradingAfterComp
