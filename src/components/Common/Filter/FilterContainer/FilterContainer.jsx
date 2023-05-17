import "./FilterContainer.css"
import { useState } from "react"
import FilterBox from "../FilterBox/FilterBox"
import React from "react"
import Button from "../../Button/Button"
import { Sliders } from "react-bootstrap-icons"
/**
 * This is the component that holds the filter elements in a single component. 
 * 
 * Props:
 *		id 			@type {string}  	- The id of the component, mostly used for testing.
 *		children	@type {component}	- The components that will appear inside of the filter box.
 *
 * Example usage:
 * 		<FilterContainer id={"filter-container"}>
 *			<div className="kihon-group">
 *				<CheckBox checked={kihon} onClick={()=> onKihonChange(!kihon)}/>
 *				<p className="kihon-text">Kihon</p>
 *			</div>
 *		</FilterContainer>	
 *
 * @author Kraken (Grupp 7)
 * @version 1.0
 * @since 2023-05-04
 */
function FilterContainer({ id, title ,children}) {
	const [active, setActive] = useState(false)
	
	function showFilter() {
		setActive(!active)
	}

	return (
		<div id={id} className="filterContainer">
			<div className="buttonGroup">
				<Button id={"filter-button"} onClick={showFilter} width='40px'>
					<Sliders/>	
				</Button>
			</div>
			<FilterBox id={"filter-box"} status={active} title={title}>
				{children}
			</FilterBox>
		</div>
	) 
}
export default FilterContainer
