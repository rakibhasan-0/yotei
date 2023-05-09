import { useState } from "react"
import CheckBox from "../../../Common/CheckBox/CheckBox"
import { ChevronDown } from "react-bootstrap-icons"
import "./TechniqueCard.css"

/**
 * Technique card component.
 * Used to display each technique on the technique page.
 * 
 * Props:
 *		activity (object) : The technique/activity object.
 *		checkBox (boolean) : If a checkbox should be included in the card or not
 *		id: Id used for testing.
 * 
 * @author Medusa
 * @version 1.0
 * @since 2023-05-02
 */
function TechniqueCard({ technique, checkBox, id }) {
	const [checked, setChecked] = useState(false)
	// console.log(technique)
	return (
		<div className="technique-card" id={id}>
			<div className="technique-card-belt-color-container">
				{
					technique.beltColors !== undefined ?
						technique.beltColors.length > 0 ?  	
							technique.beltColors.map((belt) => {
								return (belt !== undefined ?
									belt.isChild ? constructChildBelt(technique, belt)
										: 
										constructAdultBelt(technique, belt) //barnbälte 
									: constructAdultBelt("13c9ed") // när det finns färger och är ett vuxenbälte
								)})
							:	constructDefaultBelt("8e03ad") //om vi fär 0st fägerger (lila)

						: constructDefaultBelt("8e03ad") //om vi inte får färger (lila)
					
				}
				
			</div>
			<div className="technique-info-container">
				{checkBox ? 
					<div className="technique-checkbox-container">
						{checked ? 
							<CheckBox checked={true} onClick={() => setChecked(false)}/>
							:
							<CheckBox checked={false} onClick={() => setChecked(true)}/>
						}
					</div>
					:
					null
				}
				<div className="technique-name-container">
					<h5 className="technique-name">{technique.name}</h5>	
				</div>
				<a href={"/technique/technique_page/" + technique.id}>
					<div className="technique-arrow-container">
						<ChevronDown />
					</div>
				</a>
			</div>
		</div>
	)
}


function constructDefaultBelt(color) {
	return (
		<div
			className={"technique-card-belt-color"}
			style={{background: `#${color}`}}
		/>
	)
}

function constructAdultBelt(technique, belt) {
	return (
		<div
			key={technique.id + belt.id}
			className={["technique-card-belt-color", belt.name === "Vitt" ? "technique-card-belt-border" : ""].join(" ")}
			style={{background: `#${belt.belt_color}`}}
		/>
	)

}

function constructChildBelt(technique, belt) {
	return (
		<div key={technique.id  + belt.id} className={["technique-card-belt-color", "technique-card-belt-border"].join(" ")} style={{background: `linear-gradient( #fff 33%, #${belt.belt_color} 33%, #${belt.belt_color} 66%, #fff 0)`}}></div>
	)
}

export default TechniqueCard
