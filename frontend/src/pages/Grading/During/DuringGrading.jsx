import React, { useState, useEffect } from "react"

import TechniqueInfoPanel from "../../../components/Grading/PerformGrading/TechniqueInfoPanel"
import Button from "../../../components/Common/Button/Button"
import Popup from "../../../components/Common/Popup/Popup"
import ExamineePairBox from "../../../components/Grading/PerformGrading/ExamineePairBox"

import styles from "./DuringGrading.module.css"
import { ArrowRight, ArrowLeft } from "react-bootstrap-icons"
import {Link, Navigate, useParams, useNavigate} from "react-router-dom"
import {setError as setErrorToast} from "../../../utils" 

// Temp
import ProtocolYellow from "./yellowProtocolTemp.json"



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

/**
 * Main function that is rendered for during grading
 * 
 *  @author Team Apelsin (2024-05-12)
 */
export default function DuringGrading() {
	const [currentIndex, setCurrentIndex] = useState(0)
	const [showPopup, setShowPopup] = useState(false)
	const [examinees, setExaminees] = useState(undefined)
	const [pairs, setPairs] = useState([])
  const { gradingId } = useParams()
  const navigate = useNavigate()

	// Get info about grading
	// TODO: Loads everytime the button is pressed. Should only happen once at start. useEffect?
	const techniqueNameList = getTechniqueNameList(ProtocolYellow)
	const categoryIndexMap = getCategoryIndices(techniqueNameList)

	// Go to summary when the index is equal to length. Maybe change the look of the buttons.
	const goToNextTechnique = () => {
		setCurrentIndex(currentIndex === techniqueNameList.length - 1 ? currentIndex : currentIndex + 1)
	}
	const goToPrevTechnique = () => {
		setCurrentIndex(currentIndex === 0 ? currentIndex : currentIndex - 1)
	}

	// Run first time and fetch all examinees in this grading
	useEffect(() => {
		(async () => {
			try {
				const response = await fetch("/api/examination/examinee/all", {})
				if (response.status === 404) {
					console.log("404")
					return
				}
				if (!response.ok) {
					console.log("could not fetch examinees")
					throw new Error("Could not fetch examinees")
				}
				const all_examinees = await response.json()
				
				const current_grading_examinees = getExamineesCurrentGrading(all_examinees)
				setExaminees(current_grading_examinees)
				console.log("Fetched examinees in this grading: ", current_grading_examinees)
			} catch (ex) {
				setErrorToast("Kunde inte hämta alla utövare")
				console.error(ex)
			}
		})()
	}, [] )

	// Run after examinees is fetched and match pairs 
	useEffect(() => {
		if(examinees !== undefined){ // To prevent running first time. Is there a better way to chain api calls?
			(async () => {
				try {
					const response = await fetch("/api/examination/pair/all", {})
					if (response.status === 204) {
						return
					}
					if (!response.ok) {
						throw new Error("Could not fetch pairs")
					}
					const pairs_json = await response.json()

					// Get only pairs in this grading
					const pair_names_current_grading = getPairsInCurrrentGrading(pairs_json)
					setPairs(pair_names_current_grading)
					console.log("Fetched pairs in this examination: ", pair_names_current_grading)
				} catch (ex) {
					setErrorToast("Kunde inte hämta alla par")
					console.error(ex)
				}
			})()
		}
		
		
	}, [examinees])

	return (
		<div className={styles.container}>
			<TechniqueInfoPanel
				categoryTitle=""
				currentTechniqueTitle={techniqueNameList[currentIndex].technique.text}
				nextTechniqueTitle={techniqueNameList[currentIndex].nextTechnique.text}
				mainCategoryTitle={techniqueNameList[currentIndex].categoryName}>

			</TechniqueInfoPanel>
			{/* All pairs */}			
			<div className={styles.scrollableContainer}>
				{pairs.map((item, index) => (
					<ExamineePairBox 
						key={index}
						rowColor={index % 2 === 0 ? "#FFFFFF" : "#F8EBEC"}
						examineeLeftName={item.nameLeft} 
						examineeRightName={item.nameRight} pairNumber={index+1}>
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
          <Button id={"summary-button"} onClick={gotoSummary}><p>Fortsätt till summering</p></Button>
				</div>
			</Popup>
		</div>
	)

  /**
   * @author Team Pomagrade (2024-05-13)
   */
  function gotoSummary() {
    //TODO: setShowPopup(false)
    navigate(`/grading/${gradingId}/3`)
  }

	/**
	 * 
	 * @param {Array} all_examinees All examinees from all gradings
	 * @returns {Array} All examiees in this grading
	 * 
	 *  @author Team Apelsin (2024-05-12)
	 */
	function getExamineesCurrentGrading(all_examinees) {
		const current_grading_examinees = []
		all_examinees.forEach((examinee) => {
			if (examinee.grading_id == gradingId) {
				current_grading_examinees.push(examinee)
			}
		})
		return current_grading_examinees
	}

	/**
	 * 
	 * @param {Array} pairs_json Array with all pairs in all gradings
	 * @returns Array with all pairs in this grading, presented by name, ie {nameLeft, nameRight}
	 * 
	 * @author Team Apelsin (2024-05-12)
	 * 
	 * TODO: Does not handle single examinee, ie an examinee not included in a pair
	 */
	function getPairsInCurrrentGrading(pairs_json) {
		const pair_names_current_grading = []
		pairs_json.forEach((pair) => {
			const examinee1 = examinees.find(item => item.examinee_id === pair.examinee_1_id)
			const examinee2 = examinees.find(item => item.examinee_id === pair.examinee_2_id)
			if (examinee1 !== undefined || examinee2 !== undefined) { // Only add if something is found
				const name1 = examinee1 ? examinee1.name : "" // If only one name found
				const name2 = examinee2 ? examinee2.name : ""
				pair_names_current_grading.push({ nameLeft: name1, nameRight: name2 })
			}
		})
		return pair_names_current_grading
	}
}