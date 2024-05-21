import styles from "./CheckBox.module.css"
import { useState } from "react"
import { useEffect } from "react"

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
	const [checkedState, setCheckedState] = useState(checked)
	
	useEffect(() => { disabled && setCheckedState(false) }, [disabled])
	
	useEffect(() => {
		setCheckedState(checked)
	}, [checked])
	
	return (
		<label className={`${styles.checkboxLabel} ${styles.checkboxComponent} ${disabled ? styles.checkboxLabelDisabled : ""}`} id={id}>
			<input
				type="checkbox"
				id = {id+"-checkbox"}
				checked={checkedState}
				onChange={() =>  {
					setCheckedState(!checkedState)
					onClick(!checkedState)
				}}
				disabled={disabled}
			/>
			{label}
		</label>
	)
}