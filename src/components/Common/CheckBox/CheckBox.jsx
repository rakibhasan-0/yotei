import "./CheckBox.css"
import { Check, Dash } from "react-bootstrap-icons"

/** 
 * A default checkbox that should be used throughout the project.
 * 
 * Example usage:
 * 		<CheckBox
 * 			checked={checked}
 * 			onClick={setChecked}
 * 			label="Hello"
 * 			disabled
 * 			id="test-id"
 * 		/>
 * 
 * @author Medusa
 * @since 2023-05-02
 * @version 3.0 
 */
export default function CheckBox({checked, onClick, label, disabled, id}) {
	// The class checkbox component is only there to limit the reach of styles 
	// put on the input-element.
	return (
		<label className="checkbox-label checkbox-component" id={id}>
			{disabled && <Dash className="checkbox-icon"/>}
			{checked && <Check className="checkbox-icon"/>}
			<input
				type="checkbox"
				value={checked}
				onChange={() => onClick(!checked)}
				disabled={disabled}
			/>
			{label}
		</label>
	)
}