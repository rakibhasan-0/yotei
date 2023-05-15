import { ChevronDown } from "react-bootstrap-icons"
import "./TechniqueCard.css"

/**
 * Technique card component.
 * Used to display each technique on the technique page.
 * 
 * Props:
 *		technique (object) : The technique/activity object.
*		checkBox (Component) : If you want a checkbox to be displayed, send it as a prop.
 *		id: Id used for testing.
 * 
 * @author Medusa
 * @version 1.0
 * @since 2023-05-15
 */
function TechniqueCard({ technique, checkBox, id }) {
	
	return (
		<div className="technique-card" id={id}>
			<div className="technique-card-belt-color-container">
				{
					technique.beltColors !== undefined ?
						technique.beltColors.length > 0 ?  	
							technique.beltColors.map((belt) => {
								return (belt !== undefined ?
									belt.is_child ?
										constructChildBelt(technique, belt)
										: 
										constructAdultBelt(technique, belt) 
									: constructAdultBelt("13c9ed") 
								)})
							:	constructDefaultBelt(technique, "8e03ad") //om vi fär 0st fägerger (lila)

						: constructDefaultBelt(technique, "8e03ad") //om vi inte får färger (lila)
					
				}
				
			</div>
			<div className="technique-info-container">
				{checkBox ? 
					<div className="technique-checkbox-container">
						{checkBox}
					</div>
					:
					null
				}
				<div className="technique-name-container">
					<a href={"/technique/technique_page/" + technique.techniqueID}>
						<h5 className="technique-name">{technique.name}</h5>	
					</a>
				</div>

				<a href={"/technique/technique_page/" + technique.techniqueID}>
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
			key={technique.techniqueID + belt.belt_name + belt.is_child}
			className={["technique-card-belt-color", belt.belt_name === "Vitt" ? "technique-card-belt-border" : ""].join(" ")}
			style={{background: `#${belt.belt_color}`}}
		/>
	)

}

function constructChildBelt(technique, belt) {
	return (
		<div 
			key={technique.techniqueID  + belt.belt_name + belt.is_child}
			className={["technique-card-belt-color", "technique-card-belt-border"].join(" ")}
			style={{background: `linear-gradient( #fff 33%, #${belt.belt_color} 33%, #${belt.belt_color} 66%, #fff 0)`}}
		/>
	)
}

export default TechniqueCard
