import { ChevronDown } from "react-bootstrap-icons"
import { Link, useNavigate } from "react-router-dom"
import styles from "./TechniqueCard.module.css"

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
function TechniqueCard({ technique, checkBox, id}) {
	const navigate = useNavigate()

	const handleClick = () => {
		// Save in cookie
		navigate("/technique/" + technique.techniqueID)

	}
	
	return (
		<div className={styles["technique-card"]} id={id}>
			{constructColor(technique)}

			<div className={styles["technique-info-container"]}>
				{checkBox ? (
					<div className={styles["technique-checkbox-container"]}>{checkBox}</div>
				) : null}

				<div className={styles["technique-name-container"]}>
					<Link onClick={handleClick} >
						<h5 className={styles["technique-name"]}>{technique.name}</h5>
					</Link>
				</div>

				<div className={styles["technique-arrow-container"]}>
					<Link to={"/technique/" + technique.techniqueID}>
						<ChevronDown />
					</Link>
				</div>
			</div>
		</div>
	)
}


function constructColor(technique) {
	return (
		<div className={styles["technique-card-belt-color-container"]}>
			{
				technique.beltColors !== undefined ?
					technique.beltColors.length > 0 ?  	
						technique.beltColors.map((belt, index) => {
							return (belt !== undefined ?
								belt.is_child ?
									constructChildBelt(belt, technique.beltColors.length, index)
									: 
									constructAdultBelt(belt, technique.beltColors.length, index) 
								: constructAdultBelt("13c9ed", technique.beltColors.length, index) 
							)})
						:	constructDefaultBelt("8e03ad") //om vi fär 0st fägerger (lila)

					: constructDefaultBelt("8e03ad") //om vi inte får färger (lila)
					
			}
					
		</div>
	)
}

function constructDefaultBelt(color) {
	return (
		<div
			className={styles["technique-card-belt-color"]}
			style={{background: `#${color}`}}
		/>
	)
}

function constructAdultBelt(belt, beltLength, index) {
	if (belt.belt_name.toLowerCase().includes("dan")) {
		const num = parseInt(belt.belt_name.split(" ")[0])
		return (
			<div
				key={index}
				className={styles[["technique-card-belt-color", belt.belt_name === "Vitt" ? "technique-card-belt-border" : ""].join(" ")]}
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
						key={`${index}-${i}-dan`}
						className={styles["technique-card-belt-color"]}
						style={ { background: "gold", height: `${15 / beltLength}%` } }
					> 
					</div>
				)}

			</div>
		)
	}

	return (
		<div
			key={index}
			className={styles[["technique-card-belt-color", belt.belt_name === "Vitt" ? "technique-card-belt-border" : ""].join(" ")]}
			style={
				{
					background: `#${belt.belt_color}`,
					height: `${100 / beltLength}%`
				}
			}
		/>
	)

}

function constructChildBelt(belt, beltLength, index) {
	return (
		<div 
			key={index}
			className={styles[["technique-card-belt-color", "technique-card-belt-border"]].join(" ")}
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
