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
 *
 * Example usage: 
 * 		<TechniqueFilter belts={selectedBelts} setBelts={setSelectedBelts} kihon={kihon} setKihon= {setKihon}/>
 *
 * @author Kraken (Grupp 7)
 * @version 1.0
 * @since 2023-05-17
 */
function TechniqueFilter({id, belts, onBeltChange, kihon, onKihonChange}){
	
	return (
		<div id={id} className={style.filterPos}>
			<FilterContainer id={"technique-filter-container"}>
				<BeltPicker id={"techniqueFilter-BeltPicker"} onToggle={onBeltChange} states={belts} />
				{/** If no belts have been picked, hide the "Valda bälten" text. */}
				<p className={style.selectedText}>{!(belts.length > 0) ? "" : "Valda bälten"}</p>
				<div className={style.selectedGroup}>
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
export default TechniqueFilter