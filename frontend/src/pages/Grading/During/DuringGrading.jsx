import React, { useState, useEffect , useContext, useRef } from "react"

import TechniqueInfoPanel from "../../../components/Grading/PerformGrading/TechniqueInfoPanel"
import Button from "../../../components/Common/Button/Button"
import Popup from "../../../components/Common/Popup/Popup"
import ExamineePairBox from "../../../components/Grading/PerformGrading/ExamineePairBox"
import ExamineeBox from "../../../components/Grading/PerformGrading/ExamineeBox"

import styles from "./DuringGrading.module.css"
import { ArrowRight, ArrowLeft } from "react-bootstrap-icons"
import { useParams, useNavigate } from "react-router-dom"
import {setError as setErrorToast} from "../../../utils" 
import { AccountContext } from "../../../context"

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
 * @author Team Apelsin (2024-05-15)
 * @version 2.0
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
	const { gradingId } = useParams()
	const navigate = useNavigate()

	const context = useContext(AccountContext)
	const { token } = context

	// Get info about grading
	// TODO: Loads everytime the button is pressed. Should only happen once at start. useEffect?
	const techniqueNameList = getTechniqueNameList(ProtocolYellow)
	const categoryIndexMap = getCategoryIndices(techniqueNameList)

	// Go to summary when the index is equal to length. Maybe change the look of the buttons?
	const goToNextTechnique = () => {
		setCurrentIndex(prevIndex => Math.min(prevIndex + 1, techniqueNameList.length - 1))
		// reset the button colors
		// Should also load any stored result
	}
    
	const goToPrevTechnique = () => {
		setCurrentIndex(prevIndex => Math.max(prevIndex - 1, 0))
		// reset the button colors
		// Should also load any stored result
	}
	//

	// Run first time and fetch all examinees in this grading
	useEffect(() => {
		(async () => {
			try {
				const response = await fetch("/api/examination/examinee/all", {headers: {"token": token}})
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
					const response = await fetch("/api/examination/pair/all", {headers: {"token": token}})
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

	const [leftExamineeState, setLeftExamineeState] = useState("default")
	const [rightExamineeState, setRightExamineeState] = useState("default")
	// Will handle the api call that will update the database with the result. 
	/**
	 * 
	 * @param {String} newState : is 'pass', 'fail', 'default' 
	 * @param {String} technique : name on technique
	 * @param {Int} pairIndex : index of what number the of the pair that is clicked
	 * @param {String} buttonId : button index namne that ends with either 'left' or 'right'
	 */
	const examineeClick = (newState, technique, pairIndex, buttonId) => {
		console.log(`Pressed ${buttonId} button in pair ${pairIndex} on technique: ${technique}, with new state ${newState}`)
		// Check what state the button is in and send the proper information to DB.
		let examinee_clicked = buttonId.endsWith('left') ? pairs[pairIndex].leftId : pairs[pairIndex].rightId
		let buttonTypeData = (newState === "pass" ? true : false)
		//buttonTypeData = null
		console.log("Examinee_id: ", examinee_clicked+100)
		addExamineeResult(examinee_clicked, `${technique}`, buttonTypeData)
		console.log("Added to DB: Examinee_id:", examinee_clicked, ", Techniquename: ", technique, ", newState: ", buttonTypeData )
	}

	// Scroll to the top of the examinees list after navigation
	const scrollableContainerRef = useRef(null)

	return (
		<div className={styles.container}>
			<TechniqueInfoPanel
				categoryTitle=""
				currentTechniqueTitle={techniqueNameList[currentIndex].technique.text}
				nextTechniqueTitle={techniqueNameList[currentIndex].nextTechnique.text}
				mainCategoryTitle={techniqueNameList[currentIndex].categoryName}
				gradingId={gradingId}>

			</TechniqueInfoPanel>
			{/* All pairs */}			
			<div ref={scrollableContainerRef} className={styles.scrollableContainer}>
				{pairs.map((item, index) => (
					<ExamineePairBox 
						key={index}
						rowColor={index % 2 === 0 ? "#FFFFFF" : "#F8EBEC"}
						leftExaminee={
							<ExamineeBox 
								examineeName={item.nameLeft} 
								onClick={(newState) => examineeClick(newState, techniqueNameList[currentIndex].technique.text, index, `${index}-left`)}
								buttonState={leftExamineeState}
								setButtonState={setLeftExamineeState}
								examineeId={item.leftId}>
							</ExamineeBox>
						}
						rightExaminee={
							<ExamineeBox 
								examineeName={item.nameRight}
								onClick={(newState) => examineeClick(newState, techniqueNameList[currentIndex].technique.text, index, `${index}-right`)}
								buttonState={rightExamineeState}
								setButtonState={setRightExamineeState}
								examineeId={item.rightId}>
							</ExamineeBox>
						}
						pairNumber={index+1}
						gradingId={gradingId}
						currentTechniqueId={techniqueNameList[currentIndex].technique.text}>

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
								scrollableContainerRef.current.scrollTop = 0}}>
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
	 * Adds a status update to backend for an athlete
	 * TODO: Must have option to update status, call a put from this code
	 * @param {Int} examineeId id of the examinee that should have result added
	 * @param {String} techniqueName name on technique in grading
	 * @param {String} passStatus could be either 'pass', 'fail' or 'default'
	 * 
	 * @author Team Apelsin (2024-05-13)
	 */
	async function addExamineeResult(examineeId, techniqueName, passStatus) {
		const data = await postExamineeResult({ examinee_id: examineeId, technique_name: techniqueName, pass: passStatus }, token)
			.catch(() => setErrorToast("Kunde inte lägga till resultat. Kolla internetuppkoppling."))
	}

	/**
	 * Perform a post to backend for status for an athlete
	 * @param {JSON} result JSON object with info about result, 
	 * 						should be on format "{ examinee_id: **examineeId**, technique_name: **techniqueName**, pass: **passStatus** }"
	 * 
	 * @author Team Apelsin (2024-05-13)
	 */
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
				const id1 = examinee1 ? examinee1.examinee_id : ""
				const id2 = examinee2 ? examinee2.examinee_id : ""
				pair_names_current_grading.push({ 
					nameLeft: name1, 
					nameRight: name2, 
					leftId: id1, 
					rightId: id2
				})
			}
		})
		return pair_names_current_grading
	}
}