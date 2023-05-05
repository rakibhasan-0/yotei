import "./FilterButton.css"
import React from "react"

/**
 * The component that is representing the button of the filter.
 * 
 * Props:
 *		id 		@type {string}  	- The id of the component.
 *		status	@type {boolean}		- The status if the button is toggled or not.
 *		onClick @type {function}	- The function that should run when the button is clicked.
 *
 * Example usage:
 * 			<FilterButton id={1} status={active} onClick={showFilter}/>
 * 
 * @author Kraken (Grupp 7)
 * @version 1.0
 * @since 2023-05-02
 */
function FilterButton({ id , status, onClick}) {
	return(
		<div id={id} className={"filterButton" + ( status ? "" : "-pressed")} onClick={() => onClick()}>
			<img src="./public/filterIcon.svg"/>
	
		</div>
	)
}
export default FilterButton
