import "./BeltPicker.css"
import DropdownComponent from "../List/Component"
import CheckBox from "../CheckBox/CheckBox"
import BeltIcon from "../BeltIcon/BeltIcon"

/**
 * A list of all the belts in the belt picker.
 */
export const BELTS = ["white", "yellow", "orange", "green", "blue", "brown", "black"]

/**
 * Represents a belt row with text, two checkboxes and two
 * icons. 
 * 
 * @param {String} belt The belt color
 * @param {String} beltName The belt name
 * @param {Object} state
 * @param {Boolean} onToggle
 * @see BeltPicker.BELTS
 * @returns A new belt row
 */
const BeltRow = ({ belt, beltName, state, onToggle }) => (
	<div className="belt-row">
		<div className="belt-item">
			<CheckBox id={`belt-child-${belt}`} onClick={() => onToggle({ belt, adult: false })} checked={state?.child} />
			<BeltIcon id={`belt-child-${belt}-text`} belt={belt == "white" ? "red" : belt} child={true} />
		</div>
		<p id={`${belt}-text`} className="belt-text">{beltName}</p>
		<div className="belt-item">
			<BeltIcon id={`belt-adult-${belt}`} belt={belt} />
			<CheckBox id={`belt-adult-${belt}-text`} onClick={() => onToggle({ belt, adult: true })} checked={state?.adult} />
		</div>
	</div>
)

/**
 * A belt picker component, allowing one to pick child and adult
 * belts for all the available belts. The parent is responsible
 * for handling the selection logic, as shown in the example below:
 * 
 * states = {
 *  "red": {
 *     "child": true,
 *     "adult": false
 *  }
 * }
 * 
 * The onToggle function should accept a belt, and adult
 * parameter, where belt is the color, and adult 
 * a boolean to indiciate if an adult or child belt 
 * was toggled.
 * 
 * Example Usage:
 * 
 * const [states, setStates] = useState({})
 * const onToggle = ({ belt, adult }) => setStates(prev => {
 *		if (!prev[belt]) {
 *			prev[belt] = { child: false, adult: false }
 *		}
 *		const key = adult ? "adult" : "child"
 *		prev[belt][key] = !prev[belt][key]
 *		return {...prev} // Must return a new object to force react to update
 *	})
 * <BeltPicker onToggle={onToggle} states={states} />
 * 
 * @author Chimera (Group 4)
 * @since 2023-05-02
 * @param id An id for the belt picker
 * @param states A state object, as shown above
 * @param onToggle A toggle function when a belt is selected (both child and adult)
 * @returns A new belt picker component
 */
export default function BeltPicker({ id, states, onToggle, centered }) {
	const colorsInSwedish = ["Vit", "Gul", "Orange", "Grön", "Blå", "Brun", "Svart"]
	return (
		<DropdownComponent text={"Bälten"} id={id} centered={centered} >
			{BELTS.map((color, index) => (
				<BeltRow onToggle={onToggle} state={states?.[color]} key={index} belt={color} beltName={colorsInSwedish[index]} />
			))}
		</DropdownComponent>
	)
}
