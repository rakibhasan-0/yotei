import Button from "../Button/Button"

import { EmojiFrown } from "react-bootstrap-icons"

import "./ErrorState.css"
/**
 * A placeholder for content when an error has occured.
 * 
 * Props:
 *     message @type {string}  - An error message to be displayed to the user.
 *     onBack @type {function}  - The action to perform when user presses "Tillbaka".
 * 	   onRecover (optional) @type {function} - The action to perform when user presses "Försök igen".
 *     id (optional) @type {string} - An id used for testing.
 *
 * Example usage:
 *     <ErrorState 
 * 			message="Ett nätverksfel inträffade. Kontrollera din anslutning"
 * 			onBack={() => {navigate("/techniques")}}
 * 			id="test-id"
 * 		/>
 *
 * @author Team Medusa
 * @version 1.0
 * @since 2023-05-05
 */
function ErrorState({ message, onBack, onRecover, id }) {
	return (
		<div id={id ? id : "noid"} className={"error-state-container"}>
			<div className="error-state-icon-container">
				<EmojiFrown size="80" color="var(--red-primary)" />
			</div>
			<h1>Hoppsan!</h1>
			<h2>Det verkar som att något gick fel</h2>
			<h2 style={{color: "var(--red-primary)", marginTop: "2rem"}}>{message}</h2>
			<div className="error-state-button-container">
				<Button onClick={onBack} outlined={true}>
					<p>Tillbaka</p>
				</Button>
				<Button onClick={onRecover ? onRecover : () => window.location.reload()}>
					<p>Försök igen</p>
				</Button>
			</div>
		</div>
	)
}
export default ErrorState