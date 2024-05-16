import BeltPicker from "../BeltPicker/BeltPicker"
import FilterContainer from "./FilterContainer/FilterContainer"
import CheckBox from "../CheckBox/CheckBox"
import BeltIcon from "../BeltIcon/BeltIcon"
import style from "./TechniqueFilter.module.css"
/**
 * This is the filter component for filtering techniques. The component is used on the technique page
 * but additional filter components can be created with the more generic filter components.
 * 
 * Props:
 *		id 				@type {string}   	- The id of the component, used mostly for testing.
 * 		belts 			@type {object} 		- A object that represents the selected belts in the belt-picker. 
 * 											  Check the BeltPicker documentation for further information about the returned object.
 *		onBeltChange	@type {function} 	- Function for setting the selected belts.
 *		kihon			@type {object} 		- True/False if the kihon checkbox has been selected or not.
 *		onKihonChange 	@type {function} 	- Function for setting the kihon boolean uppon selection.
 *		onClearBelts	@type {function}	- Function to run when the clear belts button is pressed.
 *
 * Example usage: 
 * 		<TechniqueFilter
 *			belts={belts}
 *			onBeltChange={handleBeltChanged}
 *			kihon={kihon}
 *			onKihonChange={handleKihonChanged}
 *			id="testTechniqueFilter"
 *			onClearBelts={clearSelectedBelts}>
 *		</TechniqueFilter>
 *
 * @author Kraken (Grupp 7), Tomato (Group 6)
 * @version 1.1
 * @since 2023-05-24
 */
export default function TechniqueFilter({id, belts, onBeltChange, kihon, onKihonChange, onClearBelts, filterWhiteBelt}){
	
	return (
		<div id={id} className={style.filterPos}>
			<FilterContainer id={"technique-filter-container"}
				numFilters={kihon ? 1 + belts.length : belts.length}>
				<div className={style.techniqueBeltPicker}>
					<BeltPicker id={"techniqueFilter-BeltPicker"} onToggle={onBeltChange} states={belts} onClearBelts={onClearBelts} filterWhiteBelt={filterWhiteBelt} />
				</div>
				<p className={(belts.length > 0) ? style.selectedTextVis : style.selectedTextHid }>
					{(belts.length > 0) ? "Valda bälten" : ""}
				</p>
				<div className={(belts.length > 0) ? style.selectedGroupVis : style.selectedGroupHid}>
					{belts?.map((belt, index) => (
						<BeltIcon key={index} belt={belt}/>
					))}
				</div>
				<div className={style.kihonGroup}>
					<CheckBox id={"techniqueFilter-KihonCheck"} checked={kihon} onClick={()=> onKihonChange(!kihon)}/>
					<p className={style.kihonText}>Kihon</p>
				</div>
			</FilterContainer>
		</div>	
	)
}