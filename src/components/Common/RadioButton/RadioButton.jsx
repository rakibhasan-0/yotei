import React from "react"
import { Record, Record2} from "react-bootstrap-icons"
import styles from "./RadioButton.module.css"

/**
 * A radio button that can be toggled on or off, where the
 * toggled state has a filled circle and the untoggled state
 * is an empty outlined circle .
 * 
 * Example usage:
 * 
 * const [state, setState] = useState(false);
 * <RadioButton onClick={() => setState(!state) }toggled = {state}></RadioButton>
 * 
 * props = {
 *    toggled: boolean,
 *    onClick: function
 *    id: string
 * }
 * 
 * @author Chimera
 * @since 2023-05-02
 * @version 2.0 
 */
export default function RadioButton({onClick,toggled,id}){
	return(
		<div id={id} onClick={onClick} className={styles.radioContainer}>
			{toggled
				?   <>
					<Record2 className={styles.radio}/>
				</>
				:   <>
					<Record className={styles.radio} />
				</>
			}
		</div>
	)
}