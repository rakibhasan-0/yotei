import styles from "./GradingDeviations.module.css"
import React from "react"
import { useState} from "react"
import { ChevronDown } from "react-bootstrap-icons"


/**
 * The grading deviation container page.
 * 
 * @author Team Pomegranate
 * @version 1.0
 * @since 2024-05-07
 */

function GradingDeviationContainer ({ id, name, comment, passed}) {
	const [toggled, setToggled] = useState(false)

	function checkID (id) {
		if (id === null || id === undefined) {
			console.error("ID is invalid")
			return false
		}

		return true
	}

	return (

		checkID(id) ?
			(
				<div id = {id} className={styles["sc23-session-container"]}>
					<div id={`${id}-header`} className={passed ? styles["sc23-session-container-header-passed"] : styles["sc23-session-container-header-failed"]}>
						<div className = {styles["sc23-outline"]}>

							<div id ={`${id}-clickable`} className = {styles["sc23-session-header-clickable"]} role="button" onClick={() => setToggled(!toggled)}>
                            <h2 id = "nameDisplay" className= {styles["techniqueName"]}>
								{name}
							</h2>
								{
									<ChevronDown id={styles["sc23-dropdown"]} style={{color:"black"}} className={styles[["sc23-session-container-chevron-rotation-animation sc23-session-container-header-overlap", toggled ? "sc23-chevron-rotate" : ""].join(" ")]} size={20}/>
								}
							</div>
							<div id = {`${id}-content`} className={styles["sc23-session-container-content"]}>
								
								<div className={styles["sc23-session-container-child"]} style={{ display: toggled ? "inherit" : "none" }} id={`${id}-children`}>
                                    <h2 className= {styles["commentStyle2"]}>Kommentar:</h2>
									{	
										<h2 id = "commentDisplay" className= {styles["commentStyle"]}>
											Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sit amet porta ex.
											Donec laoreet urna in hendrerit venenatis. Sed sem ligula, aliquet at odio id, varius rutrum dolor.
											Sed elementum at magna nec tincidunt.{comment}
										</h2>
									}
								</div> 
							</div>
						</div>
					</div>
				</div>
			)
			:
			(
				<div id = "session-container-error">Kunde inte ladda in tillfället</div>
			)
	)
}


export default GradingDeviationContainer