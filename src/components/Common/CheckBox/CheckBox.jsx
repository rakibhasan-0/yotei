import { useEffect } from "react"
import "./CheckBox.css"
import { Check } from "react-bootstrap-icons"

/** 
 * A default checkbox that should be used throughout the project.
 * The checkbox handles the checking and unchecking of the box itself.
 * I.e. usage like this is incorrect
 *      <CheckBox
 * 			checked={checked}
 * 			onClick={() => setChecked(!checked)}
 * 		/>
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
 * @version 4.0 
 */
export default function CheckBox({checked, onClick, label, disabled, id}) {
	// This eslint-ignore is needed. If exhausive deps rule is
	// to be followed, onClick can't change on every re-render
	// which happens almost everywhere where this component is used.
	// Solution is for the user of this component to pass
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => {checked && onClick(false)},[disabled])

	return (
		<label className={`checkbox-label checkbox-component ${disabled ? "checkbox-label-disabled" : ""}`} id={id}>
			{checked && <Check className="checkbox-icon"/>}
			<input
				type="checkbox"
				checked={checked}
				onChange={() => onClick(!checked)}
				disabled={disabled}
			/>
			{label}
		</label>
	)
}