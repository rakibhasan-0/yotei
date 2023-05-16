import BeltPicker from "../BeltPicker/BeltPicker"
import FilterContainer from "./FilterContainer/FilterContainer"
import CheckBox from "../CheckBox/CheckBox"
import "./TechniqueFilter.css"
import BeltIcon from "../BeltIcon/BeltIcon"

/**
 * This is the filter component for filtering techniques. The component is used on the technique page
 * but additional filter components can be created with the more generic filter components.
 * 
 * Props:
 *		id 				@type {string}   - The id of the component, used mostly for testing.
 * 		callbackBelts 	@type {function} - Belt callback function, returns ONLY the selected belts.
 *		callbackKihon	@type {function} - Kihon callback function, returns true or false.
 *
 * Example usage: 
 * 		<TechniqueFilter callbackBelts={this.callbackBelts} callbackKihon={this.callbackKihon}/>
 *
 * @author Kraken (Grupp 7)
 * @version 1.0
 * @since 2023-05-03
 */
function TechniqueFilter({id, belts, setBelts, kihon, setKihon}){

	const onToggle = (checked, belt) => setBelts(prev => {
		if(!checked) {
			return prev.filter(b => b !== belt)
		}
		else {
			return [...prev, belt]
		}
	})
	
	// Checks which of the belts that should be displayed, should be refactored and made better. Works for now...
	return (
		<div id={id} className="filterPos">
			<FilterContainer id={1}>
				<BeltPicker onToggle={onToggle} states={belts} />
				<p className="selected-text">{!(belts.length > 0) ? "" : "Valda bälten"}</p>
				<div className="selected-group">
					{belts?.map((belt, index) => (
						<BeltIcon key={index} color={`#${belt.color}`} child={belt.child}/>
					))}
				</div>
				<div className="kihon-group">
					<CheckBox checked={kihon} onClick={()=>setKihon(!kihon)}/>
					<p className="kihon-text">Kihon</p>
				</div>
			</FilterContainer>
		</div>	
	)
}
export default TechniqueFilter


