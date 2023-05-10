import "./FilterBox.css"
import React from "react"
/**
 * The component that represent the box that will contain the filter options.
 * 
 * Props:
 *		id 			@type {string}  	- The id of the component.
 *		status 		@type {object} 		- A bool if the box should be shown or not.
 *		children 	@type {component} 	- The components that will appear inside of the filter box.

 * Example usage:
 *		<FilterBox id={"filterBox"} status={!active}>
 *			<div className="kihon-group">
 *				<p className="kihon-text">Kihon</p>
 *				<CheckBox checked={kihon} onClick={()=>setKihon(!kihon)}/>
 *			</div>
 *		</FilterBox>
 *
 * @author Kraken (Grupp 7)
 * @version 1.0
 * @since 2023-05-04
 */
function FilterBox({ id, status, children }) {
	return (
		<div id={id} className={"filterBox" + ( status ? "" : "-pressed")}>
			<fieldset>
				<legend>Filtrering</legend>
				{children}
			</fieldset>
		</div>
	) 
}
export default FilterBox
