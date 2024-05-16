import React from "react"
import { Record, Record2} from "react-bootstrap-icons"
import styles from "./RadioButton.module.css"

/**
 * A radio button that can be toggled on or off, where the
 * toggled state has a filled circle and the untoggled state
 * is an empty outlined circle .
 * 
 * Props = {
 *    toggled @type {Boolean}: If true shows the button filled otherwise shows an unfilled button
 *    onClick @type {Function}: Function to run when the button is clicked
 *    id @type {String}: Id for the component
 * }
 * 
 * Example usage:
 * 
 * const [state, setState] = useState(false);
 * <RadioButton onClick={() => setState(!state) }toggled = {state}></RadioButton>
 * 
 * @author Chimera
 * @since 2023-05-02
 * @updated 2023-05-30 Chimera updated documentation
 * @version 2.1
 */
export default function RadioButton({onClick,toggled,id}){
	return(
		<div id={id} onClick={onClick} className={styles.radioContainer}>
			{toggled
				?  
				<Record2 size="1.6em" className={styles.radio}/>
				:  
				<Record size="1.6em" className={styles.radio} />
			}
		</div>
	)
}