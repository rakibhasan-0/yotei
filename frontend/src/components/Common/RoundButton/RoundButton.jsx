import { useNavigate } from "react-router-dom"
import styles from "./RoundButton.module.css"

/**
 * Defines the button to add activity. 
 * Props: 
 * 	onClick @type {Function}: function to run when roundbutton is clicked, overrides linkTo
 * 	children @type {JSX}: Children to be plased inside the button
 * 	linkTo @type {String}: default URL to navigate to when clicked
 * 	id @type {String}: id for component
 * 
 * Use linkTo for changing page and onClick for custom 
 *
 * @author Team Chimera
 * @since 2023-05-02
 * @update 2023-05-30 Chimera, updated documentation
 * @version 2.1 
 */

function RoundButton({onClick, children, linkTo, id}) {
	const navigate = useNavigate()

	return (
		<div id={id} onClick={linkTo != null ? () => navigate(linkTo) : onClick} className={`${styles.btnAddActivity} ${styles.containerFluid}`}>
			{children}
		</div>
	)
}

export default RoundButton