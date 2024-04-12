import style from "./FilterBox.module.css"
import React from "react"
/**
 * The component that represent the box that will contain the filter options.
 * 
 * Props:
 *		id 			@type {string}  	- The id of the component
 *		title		@type {string}		- The title of the filter box.
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
function FilterBox({ id, status, title="Filtrering" , children }) {
	return (
		<div id={id} className={( status ? style.filterBoxPressed : style.filterBox)}>
			<fieldset className={style.fieldset}>
				<legend className={style.legend}>{title}</legend>
				{children}
			</fieldset>
		</div>
	) 
}
export default FilterBox
