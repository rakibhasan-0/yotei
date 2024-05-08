import {React} from "react"
import CommentButton from "../PerformGrading/CommentButton"
import styles from "./TechniqueInfoPanel.module.css"

/**
 * This panel  present the main categori, the current technique and the next
 * technique.
 * 
 *   Props:
 *    id, categoryTitle, currentTechniqueTitle, nextTechniqueTitle, beltColor,
 * 	  onButtonClicked
 *    id 		    		@type {String}   An id for the panel
 *    categoryTitle			@type {String}	 the title of the subcategory
 *    currentTechniqueTitle @type {String}   the current technique
 * 	  nextTechniqueTitle	@type {String}	 the next technique
 *    mainCategoryTitle		@type {String}	 the category title
 *    beltColor				@type {String}	 the color of the belt
 * 	  onButtonClicked		@type {onClick}	 the action that the buttons is
 * 											 supposed to perform
 * 
 * Example Usage:
 * <TechniqueInfoPanel 
 *  beltColor = "#FFDD33",
 *	categoryTitle = "Test Kategori",
 *	currentTechniqueTitle = "1. Grepp i två handleder framifrån och svingslag Frigöring – Ju morote jodan uke",
 *	nextTechniqueTitle = " 2. Stryptag framifrån och svingslag, backhand Frigöring – Ju morote jodan uke, ude osae, ude osae gatame",
 *	mainCategoryTitle = "Huvudkategori",
 *	onButtonClicked = onClick()/>
 *
 * 
 * @author Apelsin
 * @since 2024-05-02
 * @version 1.0 
 */

export default function TechniqueInfoPanel( {
	beltColor = "#FFDD33",
	categoryTitle = "Test Kategori",
	currentTechniqueTitle = "1. Grepp i två handleder framifrån och svingslag Frigöring – Ju morote jodan uke",
	nextTechniqueTitle = " 2. Stryptag framifrån och svingslag, backhand Frigöring – Ju morote jodan uke, ude osae, ude osae gatame",
	mainCategoryTitle = "Huvudkategori",
	onButtonClicked
}) {

	return (
		
		<div style={styles}>
			<fieldset role="fieldsetBelt" style={{ height: "30px", width: "100%", marginBottom: "10px", backgroundColor: beltColor}}>
				<div>
					<h2 role="mainCategoryTitle">{mainCategoryTitle}</h2>
				</div>
			</fieldset>
			<fieldset style={{ height: "auto", width: "100%", marginBottom: "5px" }}>
				<div>
					<h3 role="categoryTitle">{categoryTitle}</h3>
				</div>
				<div>
					<h1 role="currentTechniqueTitle">{currentTechniqueTitle}</h1>
				</div>
				<div style={{width: "70%", float: "left"}}>
					<h3 role="nextTechniqueTitle"><b>Nästa:</b>{nextTechniqueTitle}</h3>
				</div>
				<div style={{ display: "flex", justifyContent: "flex-end"}}>
					<CommentButton onClick={onButtonClicked} />
				</div>
			</fieldset>
		</div>
	)

}
