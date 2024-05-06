/* eslint-disable indent */
// In GradingAfterComp.jsx
import React from "react"
import { Link } from "react-router-dom"
import { ChevronDown } from "react-bootstrap-icons"
import styles from "./GradingAfterComp.module.css"

const GradingAfterComp = ({ person }) => {
	return (
		<div>
            <div className={styles["technique-card"]} id={person.id}>
                <div className={styles["technique-info-container"]}>
                    <div className={styles["technique-name-container"]}>
                        <h5 className={styles["technique-name"]}>{person.name}</h5>
                    </div>
                    {/* if the technique object has count attribute then we will not render ChevronDown sign */}
                    <div className={styles["technique-arrow-container"]}>
                        <span>{person.points}/52</span> {/* Points are now to the left of the icon */}
                            <Link to={person.url}>
                                <ChevronDown />
                            </Link>
                    </div>
                
                </div>
            </div>
        </div>
    )
}

export default GradingAfterComp
