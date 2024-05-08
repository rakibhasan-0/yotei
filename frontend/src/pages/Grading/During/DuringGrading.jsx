import React, { useState } from "react"

import TechniqueInfoPanel from "../../../components/Grading/PerformGrading/TechniqueInfoPanel"
import Button from "../../../components/Common/Button/Button"
import Popup from "../../../components/Common/Popup/Popup"
import ExamineePairBox from "../../../components/Grading/PerformGrading/ExamineePairBox"

import styles from "./DuringGrading.module.css"
import RoundButton from "../../../components/Common/RoundButton/RoundButton"
import { ArrowRight, ArrowLeft } from "react-bootstrap-icons"
import {Link} from "react-router-dom"

// Temp
import ProtocolYellow from "./yellowProtocolTemp.json"
//import InfiniteScrollComponent from "../../../components/Common/List/InfiniteScrollComponent"

const listOfPairs = [{first: "Isak", second: "Teodor"},  {first: "Isak2", second: "Teodor2"},  {first: "Isak3", second: "Teodor3"},{first: "Isak", second: "Teodor"},  {first: "Isak2", second: "Teodor2"},  {first: "Isak3", second: "Teodor3"}, {first: "Isak", second: "Teodor"},  {first: "Isak2", second: "Teodor2"},  {first: "Isak3", second: "Teodor3"}]


/**
 * Get all techniques from grading protocol and 
 * returns array that could be iterated in order
 * 
 * @param gradingProtocolJSON - A JSON object that contains data for a specific grading
 * 
 * @returns Array with techniques that is in order. 
 * 			Each item contains {categoryName, current_technique and next_technique } for a specific JSON-file  
 * 
 * @author Team Apelsin (2024-05-07)
 */
function getTechniqueNameList(gradingProtocolJSON) {
	// Store data in an array for chronological traversal
	const chronologicalData = []

	// Traverse the categories and techniques to store in chronological order
	gradingProtocolJSON.categories.forEach(category => {
		const categoryName = category.category_name
		const techniques = category.techniques

		techniques.forEach((technique, index) => {
			const nextTechnique = index < techniques.length - 1 ? techniques[index + 1] : null
			chronologicalData.push({ categoryName, technique, nextTechnique })
		})
	})

	// Remove null to not get errors when printing
	chronologicalData.forEach((element, index) => {
		// Check if element's nextTechnique is null and index is not the last element
		if (element.nextTechnique === null && index < chronologicalData.length - 1) {
			element.nextTechnique = chronologicalData[index + 1].technique
		}
		// Check if element's nextTechnique is null and index is the last element
		else if (element.nextTechnique === null && index === chronologicalData.length - 1) {
			element.nextTechnique = "---"
            console.log(element.nextTechnique)
		}
	})
	return chronologicalData
}

/**
 * Gets a map from categoryIndex to index in dataArray.
 * 
 * @param dataArray - An array with chronologicalData from a given JSON-file
 * 
 * @returns A map that takes a category name and maps it to an index in the dataArray
 * 			Could be used for navigation to correct technique 
 * 
 * @author Team Apelsin (2024-05-07)
 */
function getCategoryIndices(dataArray) {
	const res = []
	const seenCategories = new Set() // To keep track of seen categories

	dataArray.forEach((element, categoryIndex) => {
		const category = element.categoryName
		if (category && !seenCategories.has(category)) {
			res.push({ category, categoryIndex })
			seenCategories.add(category) // Add category to the set
		}
	})

	return res
}

export default function DuringGrading() {
	const [currentIndex, setCurrentIndex] = useState(0)
	const [showPopup, setShowPopup] = useState(false)

	// Go to summary when the index is equal to length. Maybe change the look of the buttons.
	const goToNextTechnique = () => {
		setCurrentIndex(currentIndex === techniqueNameList.length - 1 ? currentIndex : currentIndex + 1)
	}
	const goToPrevTechnique = () => {
		setCurrentIndex(currentIndex === 0 ? currentIndex : currentIndex - 1)
	}

	// TODO: Loads everytime the button is pressed. Should only happen once at start. useEffect?
	const techniqueNameList = getTechniqueNameList(ProtocolYellow)
	const categoryIndexMap = getCategoryIndices(techniqueNameList)

	console.log(categoryIndexMap)
	console.log(listOfPairs)

	return (
		<div className={styles.container}>
			<TechniqueInfoPanel
				categoryTitle=""
				currentTechniqueTitle={techniqueNameList[currentIndex].technique.text}
				nextTechniqueTitle={techniqueNameList[currentIndex].nextTechnique.text}
				mainCategoryTitle={techniqueNameList[currentIndex].categoryName}>

			</TechniqueInfoPanel>			
			<div className={styles.scrollableContainer}>
				{listOfPairs.map((item, index) => (
					<ExamineePairBox 
                        key={index}
						rowColor={index % 2 == 0 ? "#FFFFFF" : "#F8EBEC"}
						examineeLeftName={item.second} 
						examineeRightName={item.second} pairNumber={index+1}>
					</ExamineePairBox>
				))}
			</div>

            <div className={styles.bottomRowContainer}>
                {/* Prev technique button */}
                <div id={"prev_technique"} onClick={goToPrevTechnique} className={styles.btnPrevActivity}>
                    {<ArrowLeft/>}
                </div>
                { /*Techniques button*/ }
                <Button id={"techniques-button"} onClick={() => setShowPopup(true)}><p>Tekniker</p></Button>
                { /* Next technique button */ }
                <div id={"next_technique"} onClick={goToNextTechnique} className={styles.btnNextActivity}>
                    {<ArrowRight/>}
                </div>
            </div>

			<Popup 
				id={"navigation-popup"} 
				title={"Tekniker"} 
				isOpen={showPopup} 
				setIsOpen={setShowPopup}> 
				<div className={styles.popupContent}>
					{/* Should link to the respective technique grading page. */}
					{categoryIndexMap.map((techniqueName, index) => (
						<Button 
                            key={index}
                            onClick={() => {
                                setCurrentIndex(techniqueName.categoryIndex)
                                setShowPopup(false)}}>
                            <p>{techniqueName.category}</p></Button>
					))}
					{/* Should link to the "after" part of the grading as well as save the changes to the database. */}
					<Link to="/groups">
						<Button id={"summary-button"} onClick={() => setShowPopup(false)}><p>Fortsätt till summering</p></Button>
					</Link>
				</div>
			</Popup>
		</div>
	)
}
