import { useState } from "react"
import BeltPicker, { BELTS } from "../BeltPicker/BeltPicker"
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
function TechniqueFilter({id, callbackBelts, callbackKihon}){

	const [belts, setBelts] = useState({})
	const [kihon, setKihon] = useState(false)

	const onToggle = ({ belt, adult }) => setBelts(prev => {
		if (!prev[belt]) {
			prev[belt] = { child: false, adult: false }
		}
		const key = adult ? "adult" : "child"
		prev[belt][key] = !prev[belt][key]
		//getActiveBelts()
		return {...prev} // Must return a new object to force react to update
	})

	function getActiveBelts(){
		let existsBelts = false
		for (let i = 0; i < BELTS.length; i++){
			let test = belts[BELTS[i]]
			if (test !== undefined && (test.child || test.adult)){
				existsBelts = true
			}
		}
		
		return existsBelts
	}

	
	// Callback functions for returning the selected belts and if kihon is toggled.
	callbackBelts(belts)
	callbackKihon(kihon)
	
	return (
		<div id={id} className="filterPos">
			<FilterContainer id={1}>
				<BeltPicker onToggle={onToggle} states={belts} />
				<p className="selected-text">{!getActiveBelts() ? "" : "Valda bälten"}</p>
				<div className="selected-group">
					{Object.entries(belts).map(([key, value]) => {
						if(value.child && !value.adult) {
							return (<BeltIcon id={`belt-child-${key}-text`} key={key} belt={key == "white" ? "red" : key} child={true}/>)
						} else if (!value.child && value.adult) {
							return (<BeltIcon id={`belt-adult-${key}-text`} key={key} belt={key} child={false}/>)
						} else if (value.child && value.adult) {
							return (
								<div key={key} style={{display: "flex", gap: "10px"}}>
									<BeltIcon id={`belt-child-${key}-text`} belt={key == "white" ? "red" : key} child={true}/>
									<BeltIcon id={`belt-adult-${key}-text`} belt={key} child={false}/>
								</div>
							)
						}
					})}
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


