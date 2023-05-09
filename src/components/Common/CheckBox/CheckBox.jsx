import { useEffect } from "react"
import "./CheckBox.css"
import { Check } from "react-bootstrap-icons"

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

	useEffect(() => disabled && onClick(false), [disabled, onClick])

	return (
		<label className={`checkbox-label checkbox-component ${disabled ? "checkbox-label-disabled" : ""}`} id={id}>
			{checked && <Check className="checkbox-icon"/>}
			<input
				type="checkbox"
				value={checked}
				defaultChecked={checked}
				onChange={() => onClick(!checked)}
				disabled={disabled}
			/>
			{label}
		</label>
	)
}