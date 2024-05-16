import style from "./FilterContainer.module.css"
import { useState } from "react"
import FilterBox from "../FilterBox/FilterBox"
import React from "react"
import FilterButton from "../FilterButton/FilterButton"

/**
 * This is the component that holds the filter elements in a single component. 
 * 
 * Props:
 *		id 			@type {string}  	- The id of the component, mostly used for testing.
 *		title		@type {string}		- The title of the filter box.
 *		numFilters  @type {integer}		- Number of active filters.
 *		children	@type {component}	- The components that will appear inside of the filter box.
 *
 * Example usage:
 * 		<FilterContainer id={"filter-container"} title={"testFilter"} numFilters={0}>
 *			<div className="kihon-group">
 *				<CheckBox checked={kihon} onClick={()=> onKihonChange(!kihon)}/>
 *				<p className="kihon-text">Kihon</p>
 *			</div>
 *		</FilterContainer>	
 *
 * @author Kraken (Grupp 7), Tomtato (Group 6)
 * @version 1.1
 * @since 2023-05-30
 */
function FilterContainer({ id, title ,numFilters, children}) {
	const [active, setActive] = useState(false)
	const [buttonToggle, setToggle] = useState(false)

	function showFilter() {
		setToggle(!buttonToggle)
		setActive(!active)
	}

	return (
		<div id={id}>
			<div className={style.buttonGroup}>
				<FilterButton
					showFilter = {showFilter}
					buttonToggle = {buttonToggle}
					numFilters = {numFilters}
				/>
			</div>
			<FilterBox id={"filter-box"} className={style.filterBox} status={active} title={title}>
				{children}
			</FilterBox>
		</div>
	) 
}
export default FilterContainer
