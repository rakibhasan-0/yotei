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
			{constructColor(technique)}

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

				<div className="technique-arrow-container">
					<a href={"/technique/technique_page/" + technique.techniqueID}>
						<ChevronDown />
					</a>
				</div>
				

			</div>
		</div>

	)
}


function constructColor(technique) {
	return (
		<div className="technique-card-belt-color-container">
			{
				technique.beltColors !== undefined ?
					technique.beltColors.length > 0 ?  	
						technique.beltColors.map((belt, key) => {
							return (belt !== undefined ?
								belt.is_child ?
									constructChildBelt(technique, belt, technique.beltColors.length, key)
									: 
									constructAdultBelt(technique, belt, technique.beltColors.length, key) 
								: constructAdultBelt("13c9ed", technique.beltColors.length, key) 
							)})
						:	constructDefaultBelt(technique, "8e03ad") //om vi fär 0st fägerger (lila)

					: constructDefaultBelt(technique, "8e03ad") //om vi inte får färger (lila)
					
			}
					
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

function constructAdultBelt(technique, belt, beltLength, key) {
	if (belt.belt_name.toLowerCase().includes("dan")) {
		console.log(belt)
		const num = parseInt(belt.belt_name.split(" ")[0])
		return (
			<div
				key={key}
				className={["technique-card-belt-color", belt.belt_name === "Vitt" ? "technique-card-belt-border" : ""].join(" ")}
				style={
					{
						background: `#${belt.belt_color}`,
						height: `${100 / beltLength}%`,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						flexDirection: "column",
						gap: "5px",
					}
				} >

				{ [...Array(num)].map((i) =>
					<div
						key={`${key}-${i}-dan`}
						className={"technique-card-belt-color"}
						style={ { background: "gold", height: `${15 / beltLength}%` } }
					> 
					</div>
				)}

			</div>
		)
	}

	return (
		<div
			key={key}
			className={["technique-card-belt-color", belt.belt_name === "Vitt" ? "technique-card-belt-border" : ""].join(" ")}
			style={
				{
					background: `#${belt.belt_color}`,
					height: `${100 / beltLength}%`
				}
			}
		/>
	)

}

function constructChildBelt(technique, belt, beltLength, key) {
	return (
		<div 
			key={key}
			className={["technique-card-belt-color", "technique-card-belt-border"].join(" ")}
			style={
				{
					// background: `radial-gradient(circle, rgba(0,0,0,1) 20%, rgba(0,0,0,1) 70%, rgba(255,255,255,1) 70%`, 
					background: `linear-gradient(90deg, #fff 25%, #${belt.belt_color} 25%, #${belt.belt_color} 75%, #fff 75%)`,	
					height: `${100 / beltLength}%`
				}
			}
		/>
	)
}

export default TechniqueCard
