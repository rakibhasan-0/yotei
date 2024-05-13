import React, { useState, useEffect, useRef, useContext } from "react"

import TechniqueInfoPanel from "../../../components/Grading/PerformGrading/TechniqueInfoPanel"
import Button from "../../../components/Common/Button/Button"
import Popup from "../../../components/Common/Popup/Popup"
import ExamineePairBox from "../../../components/Grading/PerformGrading/ExamineePairBox"
import ExamineeBox from "../../../components/Grading/PerformGrading/ExamineeBox"
import ExamineeButton from "../../../components/Grading/PerformGrading/ExamineeButton"

import styles from "./DuringGrading.module.css"
import { ArrowRight, ArrowLeft } from "react-bootstrap-icons"
import {Link} from "react-router-dom"
import {setError as setErrorToast} from "../../../utils" 

// Temp
import ProtocolYellow from "./yellowProtocolTemp.json"
import { AccountContext } from "../../../context"


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
 * @version 1.0
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
			element.nextTechnique = {text: ""}
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
 * @version 1.0
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
 *  @author Team Apelsin (2024-05-13)
 *  @version 2.0
 */
export default function DuringGrading() {
	const [currentIndex, setCurrentIndex] = useState(0)
	const [showPopup, setShowPopup] = useState(false)
	const [examinees, setExaminees] = useState(undefined)
	const [pairs, setPairs] = useState([])
	const grading_id = 3 // temp, should be collected from url
	const context = useContext(AccountContext)
	const {token, userId} = context

	// Get info about grading
	// TODO: Loads everytime the button is pressed. Should only happen once at start. useEffect?
	const techniqueNameList = getTechniqueNameList(ProtocolYellow)
	const categoryIndexMap = getCategoryIndices(techniqueNameList)

	// Go to summary when the index is equal to length. Maybe change the look of the buttons.
	const goToNextTechnique = () => {
		setCurrentIndex(prevIndex => Math.min(prevIndex + 1, techniqueNameList.length - 1))
		// reset the button colors
		setSelectedButtons({})
		// Should also load any stored result
	}
    
	const goToPrevTechnique = () => {
		setCurrentIndex(prevIndex => Math.max(prevIndex - 1, 0))
		// reset the button colors
		setSelectedButtons({})
		// Should also load any stored result
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
					const pair_examinees_current_grading = getPairsInCurrrentGrading(pairs_json)
					setPairs(pair_examinees_current_grading)
					console.log("Fetched pairs in this examination: ", pair_examinees_current_grading)
				} catch (ex) {
					setErrorToast("Kunde inte hämta alla par")
					console.error(ex)
				}
			})()
		}
		
		
	}, [examinees])

	// Handle the G and U buttons of each examinee
	const [selectedButtons, setSelectedButtons] = useState({})
	// Usage:
	// handleButtonClick(technique, pairIndex, buttonId, 'left')
	// handleButtonClick(technique, pairIndex, buttonId, 'right')
	const handleButtonClick = (technique, examinee_id, pairIndex, buttonId, side) => {
		const buttonType = buttonId.includes("pass") ? "pass" : "fail"
		const oppositeButtonType = buttonType === "pass" ? "fail" : "pass"

		setSelectedButtons(prev => ({
			...prev,
			[pairIndex]: {
				...prev[pairIndex],
				[`${buttonType}-button-${pairIndex}-${side}`]: buttonId,
				[`${oppositeButtonType}-button-${pairIndex}-${side}`]: null,
			}
		}))
		console.log(`Pressed ${buttonId} button in pair ${pairIndex} on technique: ${technique}`)
		// Update backend
		let buttonTypeData = (buttonType === "pass" ? true : false)
		addExamineeResult(examinee_id, technique, buttonTypeData)

	}

	async function addExamineeResult(examineeId, techniqueName, passStatus) {
		const data = await postExamineeResult({ examinee_id: examineeId, technique_name: techniqueName, pass: passStatus }, token)
			.catch(() => setErrorToast("Kunde inte lägga till resultat. KOlla internetuppkoppling."))
		
		//setExaminees([...examinees, { id: data["examinee_id"], name: data["name"] }])
	}

	async function postExamineeResult(result, token) {
		console.log("Result posted: ", result)
		const requestOptions = {
			method: "POST",
			headers: { "Content-Type": "application/json", "token": token },
			body: JSON.stringify(result)
		}
	
		return fetch("/api/examination/examresult", requestOptions)
			.then(response => { return response })
			.catch(error => { alert(error.message) })
	}
	console.log("One pair: ", pairs[0])

	// Extracted Examinee component to remove duplicate code.
	const Examinee = ({ examinee, index, side }) => ( // TODO: this makes it work
		<ExamineeBox examineeName={examinee.name} onClickComment={() => console.log("CommentButton clicked")}>
			<ExamineeButton
				id={`pass-button-${index}-${side}`}
				type="green"
				onClick={() => handleButtonClick(techniqueNameList[currentIndex].technique.text, examinee.examinee_id, index, `pass-button-${index}-${side}`, side)}
				isSelected={selectedButtons[index]?.[`pass-button-${index}-${side}`] === `pass-button-${index}-${side}`}
			>
				<p>G</p>
			</ExamineeButton>
			<ExamineeButton 
				id={`fail-button-${index}-${side}`}
				type="red"
				onClick={() => handleButtonClick(techniqueNameList[currentIndex].technique.text, examinee.examinee_id, index, `fail-button-${index}-${side}`, side)}
				isSelected={selectedButtons[index]?.[`fail-button-${index}-${side}`] === `fail-button-${index}-${side}`}
                
			>
				<p>U</p>
			</ExamineeButton>
		</ExamineeBox>
	)

	// Scroll to the top of the examinees list after navigation
	const scrollableContainerRef = useRef(null)
	// className={boxStyles.examineeButton}

	return (
		<div className={styles.container}>
			<TechniqueInfoPanel
				categoryTitle=""
				currentTechniqueTitle={techniqueNameList[currentIndex].technique.text}
				nextTechniqueTitle={techniqueNameList[currentIndex].nextTechnique.text}
				mainCategoryTitle={techniqueNameList[currentIndex].categoryName}>

			</TechniqueInfoPanel>
			{/* All pairs */}			
			<div ref={scrollableContainerRef} className={styles.scrollableContainer}>
				{pairs.map((item, index) => (
					<ExamineePairBox 
						key={index}
						rowColor={index % 2 === 0 ? "#FFFFFF" : "#F8EBEC"}
						leftExaminee={<Examinee examinee={item.examineeLeft} index={index} side='left' />}
						rightExaminee={<Examinee examinee={item.examineeRight} index={index} side='right' />}
						pairNumber={index+1}>
					</ExamineePairBox>
				))}
			</div>

			<div className={styles.bottomRowContainer}>
				{/* Prev technique button */}
				<div 
					id={"prev_technique"} 
					onClick={() => {
						goToPrevTechnique() 
						scrollableContainerRef.current.scrollTop = 0}} 
					className={styles.btnPrevActivity}>
					{<ArrowLeft/>}
				</div>
				{ /*Techniques button*/ }
				<Button id={"techniques-button"} onClick={() => setShowPopup(true)}><p>Tekniker</p></Button>
				{ /* Next technique button */ }
				<div 
					id={"next_technique"} 
					onClick={() => {
						goToNextTechnique()
						scrollableContainerRef.current.scrollTop = 0}} 
					className={styles.btnNextActivity}>
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
								setShowPopup(false)
								// Reset the 'U'. 'G' button colors
								setSelectedButtons({})
								scrollableContainerRef.current.scrollTop = 0}}>
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
			if (examinee.grading_id == grading_id) {
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
				pair_names_current_grading.push({ examineeLeft: examinee1, examineeRight: examinee2 })
			}
		})
		return pair_names_current_grading
	}



}