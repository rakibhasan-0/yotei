import { ChevronDown } from "react-bootstrap-icons"
import { Link, useNavigate } from "react-router-dom"
import styles from "./TechniqueCard.module.css"
import PopupMini from "../../Popup/PopupMini"
import TechniqueDetailMini from "../../../../pages/Activity/Technique/TechniqueDetail/TechniqueDetailMini"
//import ExerciseDetailMini from "../../../../pages/Activity/Exercise/ExerciseDetailMini"
import { useState } from "react"

/**
 * Technique card component.
 * Used to display each technique on the technique page.
 *
 * Props:
 *		technique (object) : The technique/activity object.
 *		checkBox (Component) : If you want a checkbox to be displayed, send it as a prop.
 *		id: Id used for testing.
 *
 * @author Medusa, Coconut, Tomato, Team Kiwi
 * @version 2.3
 * @since 2024-05-16
 *
 * @update Converted to css module 2024-04-19, Hannes (group 1)
 * @update Fixed so that techniques that are in lists get the correct path, 2024-05-17, Team Tomato (Group 6)
 * @update Added inverted belt category. 2024-05-20, Team Kiwi (Teodor Bäckström)
 * @update Added a popUp window for when popUp is true.
 */
function TechniqueCard({ technique, checkBox, id, popUp}) {
	const navigate = useNavigate()
	const [isOpen, setIsOpen] = useState(false)
	
	// Fixes the path regardless if the technique is in a list or not.
	const path = (technique.path === undefined) ? technique.techniqueID : technique.path

	const handleClick = () => {
		
		setTechnique()

		if (!popUp){
			if (technique.activity_id && technique.type === "technique") {
				navigate("/technique/" + technique.activity_id)
			} else if (technique.type === "technique" && technique.id) { 
				//This is only entered through the grading protocol statistics popup. 
				//TODO : Change technique.id to technique.activity_id (Problem is because of the api)
				navigate("/technique/" + technique.id)
			} else if (technique.type === "exercise" && technique.activity_id) {
				navigate("/exercise/exercise_page/" + technique.activity_id)
			} else {
				navigate("/technique/" + path)
			}
		}
		else {
			setIsOpen(true)
		}
		
	}

	const setTechnique = () =>{
		localStorage.setItem("stored_technique", id)
	}

	return (
		<div 

			//If the technique count is 0, the card will be transparent otherwise
			//it will be normal, this is mostly for the statistics page
			className={`${styles["technique-card"]} ${
				(technique.count === 0 && !isOpen) ? styles["transparent-card"] : ""
			}`}
			id={id} 
			onClick={setTechnique}>
			
			
			<PopupMini title = {technique.name} id = "pop-up-id-tech" isOpen = {isOpen} setIsOpen = {setIsOpen} isNested = {true}> 
				<TechniqueDetailMini id = {technique.techniqueID ? technique.techniqueID : technique.activity_id}>
				</TechniqueDetailMini>
			</PopupMini>

			{technique.type === "exercise" ? null : constructColor(technique)}

			<div className={styles["technique-info-container"]}>
				{checkBox ? <div className={styles["technique-checkbox-container"]}>{checkBox}</div> : null}

				<div className={styles["technique-name-container"]}>
					<Link onClick={handleClick}>
						<h5 className={styles["technique-name"]}>{technique.name}</h5>
					</Link>
				</div>

				{/* if the technique object has count attribute then we will not render ChevronDown sign */}
				<div className={styles["technique-arrow-container"]}>
					{technique.count || technique.count == 0 ? null : (
						<Link to={"/technique/" + technique.techniqueID}>
							<ChevronDown />
						</Link>
					)}
				</div>

				{/* we are about to count the number of occurrence to display on card */}



				<div className={styles.countContainer}>
					{technique.count || technique.count == 0 ? <p>x{technique.count}</p> : null}
				</div>
			</div>
		</div>
	)
}

function constructColor(technique) {
	return (
		<div className={styles["technique-card-belt-color-container"]}>
			{
				technique.beltColors !== undefined && technique.beltColors !== null
					? technique.beltColors.length > 0
						? technique.beltColors.map((belt, index) => {
							if (belt !== undefined) {
								return belt.is_child
									? constructChildBelt(belt, technique.beltColors.length, index)
									: belt.is_inverted
										? constructInvertedBelt(belt, technique.beltColors.length, index)
										: constructAdultBelt(belt, technique.beltColors.length, index)
							} else {
								return constructAdultBelt("13c9ed", technique.beltColors.length, index)
							}
						})
						: constructDefaultBelt("8e03ad") //om vi fär 0st färger (lila)
					: constructDefaultBelt("8e03ad") //om vi inte får färger (lila)
			}
		</div>
	)
}
function constructDefaultBelt(color) {
	return <div className={styles["technique-card-belt-color"]} style={{ background: `#${color}` }} />
}

function constructAdultBelt(belt, beltLength, index) {

	if (belt.belt_name.toLowerCase().includes("dan")) {
		const num = parseInt(belt.belt_name.split(" ")[0])
		return (
			<div
				key={index}
				className={
					styles[
						[
							"technique-card-belt-color",
							belt.belt_name === "Vitt" ? "technique-card-belt-border" : "",
						].join(" ")
					]
				}
				style={{
					background: `#${belt.belt_color}`,
					height: `${100 / beltLength}%`,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					flexDirection: "column",
					gap: "5px",
				}}
			>
				{[...Array(num)].map((i) => (
					<div
						key={`${index}-${i}-dan`}
						className={styles["technique-card-belt-color"]}
						style={{ background: "gold", height: `${15 / beltLength}%` }}
					></div>
				))}
			</div>
		)
	}

	return (
		<div
			key={index}
			className={
				styles[
					["technique-card-belt-color", belt.belt_name === "Vitt" ? "technique-card-belt-border" : ""].join(
						" "
					)
				]
			}
			style={{
				background: `#${belt.belt_color}`,
				height: `${100 / beltLength}%`,
			}}
		/>
	)
}

function constructChildBelt(belt, beltLength, index) {
	return (
		<div
			key={index}
			className={styles[["technique-card-belt-color", "technique-card-belt-border"].join(" ")]}
			style={{
				// background: `radial-gradient(circle, rgba(0,0,0,1) 20%, rgba(0,0,0,1) 70%, rgba(255,255,255,1) 70%`,
				background: `linear-gradient(90deg, #fff 35%, #${belt.belt_color} 35%, #${belt.belt_color} 65%, #fff 65%)`,
				height: `${100 / beltLength}%`,
			}}
		/>
	)
}

function constructInvertedBelt(belt, beltLength, index) {
	return (
		<div
			key={index}
			className={
				styles[
					["technique-card-belt-color", "technique-card-belt-border"].join(" ")
				]
			}
			style={{
				// background: `radial-gradient(circle, rgba(0,0,0,1) 20%, rgba(0,0,0,1) 70%, rgba(255,255,255,1) 70%`,
				background: `linear-gradient(90deg, #${belt.belt_color} 35%, #fff 35% , #fff 65%, #${belt.belt_color} 65%)`,
				height: `${100 / beltLength}%`,
			}}
		/>
	)
}


export default TechniqueCard