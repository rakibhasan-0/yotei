import {React} from "react"
import styles from "../PerformGrading/TechniqueInfoPanel.module.css"
import CommentButton from "../PerformGrading/CommentButton"
import { AlignEnd, AlignTop } from "react-bootstrap-icons"
import RadioButton from "../../Common/RadioButton/RadioButton"

/**
 * This is a WORK IN PROGRESS.
 *
 * @author Team Apelsin (Group 5)
 * @version 1.0
*/
/**
 *
 * @param techniqueId
 * @param categoryTitle
 * @param currentTechniqueTitle
 * @param nextTechniqueTitle
 * @param mainCategoryTitle
 * @returns {Element}
 * @constructor
 */

export default function TechniqueInfoPanel( {
	beltcolor = '#FFDD33',
	techniqueId, 
	categoryTitle = "Test Kategori",
	currentTechniqueTitle = "1. Grepp i två handleder framifrån och svingslag Frigöring – Ju morote jodan uke",
	nextTechniqueTitle = " 2. Stryptag framifrån och svingslag, backhand Frigöring – Ju morote jodan uke, ude osae, ude osae gatame",
	mainCategoryTitle = "Huvudkategori"
}) {



	return (
		
	<>
		<fieldset style={{ height: '30px', width: '100%', marginBottom: '10px', backgroundColor: beltcolor}}>
			<div>
				<h2>{mainCategoryTitle}</h2>
			</div>
		</fieldset>
		<fieldset style={{ height: 'auto', width: '100%', marginBottom: '5px' }}>
			<div>
				<h3>{categoryTitle}</h3>
			</div>
			<div>
				<h1>{currentTechniqueTitle}</h1>
			</div>
			<div style={{width: '70%', float: 'left'}}>
				<h3><b>Nästa:</b>{nextTechniqueTitle}</h3>
			</div>
			<div style={{ display: 'flex', justifyContent: 'flex-end'}}>
				<CommentButton />
			</div>
		</fieldset>
	</>
	)

}
