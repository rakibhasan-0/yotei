import "./FilterContainer.css"
import { useState } from "react"
import FilterBox from "../FilterBox/FilterBox"
import FilterButton from "../FilterButton/FilterButton"
import React from "react"
/**
 * This is the component that holds the filter elements in a single component. 
 * 
 * Props:
 *		id 			@type {string}  	- The id of the component.
 *		children	@type {component}	- The components that will appear inside of the filter box.
 *
 * Example usage:
 * 		<FilterContainer id={filter}>
 * 			<BeltPicker onToggle={onToggle} states={belts} />
 * 			<div className="kihon-group">
 * 				<p className="kihon-text">Kihon</p>
 * 				<CheckBox checked={kihon} onClick={()=>setKihon(!kihon)}/>
 * 			</div>
 * 		</FilterContainer>	
 *
 * @author Kraken (Grupp 7)
 * @version 1.0
 * @since 2023-05-04
 */
function FilterContainer({ id, children}) {
	const [active, setActive] = useState(true)
	
	function showFilter() {
		setActive(!active)
	}

	return (
		<div id={id} className="filterContainer">
			<div className="buttonGroup">
				<FilterButton id={1} status={active} onClick={showFilter}/>
			</div>
			<FilterBox id={2} status={!active}>
				{children}
			</FilterBox>
		</div>
	) 
}
export default FilterContainer
