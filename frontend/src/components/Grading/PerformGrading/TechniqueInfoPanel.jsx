import {React} from "react"
import CommentButton from "../PerformGrading/CommentButton"

/**
 * This is a WORK IN PROGRESS.
 *
 * @author Team Apelsin (Group 5)
 * @version 1.0
 * @since 2024-05-02
*/
/**
 *
 * @param id
 * @param categoryTitle
 * @param currentTechniqueTitle
 * @param nextTechniqueTitle
 * @param mainCategoryTitle
 * @param beltColor
 * @returns {Element}
 * @constructor
 */

export default function TechniqueInfoPanel( {
	beltColor = "#FFDD33",
	id,
	categoryTitle = "Test Kategori",
	currentTechniqueTitle = "1. Grepp i två handleder framifrån och svingslag Frigöring – Ju morote jodan uke",
	nextTechniqueTitle = " 2. Stryptag framifrån och svingslag, backhand Frigöring – Ju morote jodan uke, ude osae, ude osae gatame",
	mainCategoryTitle = "Huvudkategori"
}) {

	return (
		
		<div data-testid={id}>
			<fieldset role="test" style={{ height: "30px", width: "100%", marginBottom: "10px", backgroundColor: beltColor}}>
				<div>
					<h2>{mainCategoryTitle}</h2>
				</div>
			</fieldset>
			<fieldset style={{ height: "auto", width: "100%", marginBottom: "5px" }}>
				<div>
					<h3>{categoryTitle}</h3>
				</div>
				<div>
					<h1>{currentTechniqueTitle}</h1>
				</div>
				<div style={{width: "70%", float: "left"}}>
					<h3><b>Nästa:</b>{nextTechniqueTitle}</h3>
				</div>
				<div style={{ display: "flex", justifyContent: "flex-end"}}>
					<CommentButton />
				</div>
			</fieldset>
		</div>
	)

}
