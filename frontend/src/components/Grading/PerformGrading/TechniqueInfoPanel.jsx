import {React} from "react"


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
	techniqueId, 
	categoryTitle = "Test Kategori",
	currentTechniqueTitle = "Test nuvarande teknik",
	nextTechniqueTitle = "Test nästa teknik",
	mainCategoryTitle = "Huvudkategori"
}) {



	return (
		<div id={techniqueId}>
			<fieldset style={"height: 20px; width: 100%; margin-bottom: 10px; "}>
				<div>
					<h3>{mainCategoryTitle}</h3>
				</div>
			</fieldset>
			<fieldset>
				<legend>{categoryTitle}</legend>
				<div>
					<h1>{currentTechniqueTitle}</h1>
				</div>
				<div>
					<h3>{nextTechniqueTitle}</h3>
				</div>
			</fieldset>
		</div>
	)

}
