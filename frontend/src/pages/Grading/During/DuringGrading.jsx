import React, { useState, useEffect, useRef, useContext } from "react"

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
	const [currentTechniqueStep, setCurrentTechniqueStep] = useState(undefined)
	const [indexBeforeRandondi, setRandoriIndex] = useState(0)
	const [showPopup, setShowPopup] = useState(false)
	const [examinees, setExaminees] = useState(undefined)
	const [pairs, setPairs] = useState([])
	const [leftExamineeState, setLeftExamineeState] = useState("default")
	const [rightExamineeState, setRightExamineeState] = useState("default")
	const [results, setResults] = useState([])
	const [techniqueNameList, setTechniqueNameList] = useState(undefined)
	const [categoryIndexMap, setCategoryIndices] = useState(undefined)
	const { gradingId } = useParams()
	const navigate = useNavigate()
	const scrollableContainerRef = useRef(null) // Scroll to the top of the examinees list after navigation
	
	const context = useContext(AccountContext)
	const { token } = context
    

	// Go to summary when the index is equal to length. Maybe change the look of the buttons.
	const goToNextTechnique = () => {
		setCurrentTechniqueStep(nextStep => {
			if(nextStep === techniqueNameList.length -2){
				setRandoriIndex(nextStep)
			}
			const nextTechniqueStep = Math.min(nextStep + 1, techniqueNameList.length - 1)
			onUpdateStepToDatabase(nextTechniqueStep)
			return nextTechniqueStep
		})
		// reset the button colors
		// Should also load any stored result
	}
	//goes to previous technique if it is not the first technique.
	const goToPrevTechnique = () => {
		if(currentTechniqueStep === 0) {
			goToAddExamineePage()
		} else {
			setCurrentTechniqueStep(prevStep => {
				const previousTechniqueStep = Math.max(prevStep - 1, 0)
				onUpdateStepToDatabase(previousTechniqueStep)
				return previousTechniqueStep
			})
		}
		// reset the button colors
		// Should also load any stored result
	}

	// this update the database with what techniquestep the user is on, and it works with forward and backward navigation.
	const onUpdateStepToDatabase = async (currentTechniqueStep) => {
		try {
			const response = await fetch(`/api/examination/grading/${gradingId}`, { headers: { "token": token } })
			if (!response.ok) {
				setErrorToast("kunde inte hämta steg från databasen")
				return
			}
			const step = await response.json()
			step.techniqueStepNum = currentTechniqueStep
			console.log("response grading", step.techniqueStepNum)

			const update = await fetch("/api/examination/grading", {
				method: "PUT",
				headers: {
					"Content-type": "application/json",
					"token": token
				},
				body: JSON.stringify(step)
			})
			
			if (!update.ok) {
				setErrorToast("kunde inte uppdatera steg i databasen")
				return
			}
		} catch (error) {
			setErrorToast("Något gick fel när du försökte uppdatera steg i databasen")
			console.error(error)
		}
	}
	
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
    
	// Run to fetch the correct grading, to in turn fetch the correct grading protocol
	useEffect(() => {
		async function fetchData() {
			try {
				const grading = await fetchGrading()
				const protocol = await fetchProtocol(grading)
				const parsedProtocol = parseProtocol(protocol)
				updateState(parsedProtocol)
			} catch (error) {
				handleFetchError(error)
			}
		}
    
		fetchData()
	}, [])

	useEffect(() => {
		if(currentTechniqueStep !== undefined) {
			fetchTechniqueResults(techniqueNameList[currentTechniqueStep].technique.text, token) 
		}
	}, [currentTechniqueStep])
    
	// Debugging the examinee states.    
	useEffect(() => {
		console.log("leftExamineeState:", leftExamineeState)
		console.log("rightExamineeState:", rightExamineeState)
	}, [leftExamineeState, rightExamineeState])


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
		let examinee_clicked = buttonId.endsWith("left") ? pairs[pairIndex].leftId : pairs[pairIndex].rightId
		addExamineeResult(examinee_clicked, `${technique}`, newState)
	}
    
	return (
		<div className={styles.container}>
			{techniqueNameList && (
				<TechniqueInfoPanel
					categoryTitle=""
					currentTechniqueTitle={techniqueNameList[currentTechniqueStep].technique.text}
					nextTechniqueTitle={techniqueNameList[currentTechniqueStep].nextTechnique.text}
					mainCategoryTitle={techniqueNameList[currentTechniqueStep].categoryName}>
				</TechniqueInfoPanel>
			)}
			{/* All pairs */}	
			{techniqueNameList && results && (		
				<div ref={scrollableContainerRef} className={styles.scrollableContainer}>
					{pairs.map((item, index) => (
						<ExamineePairBox 
							key={index}
							rowColor={index % 2 === 0 ? "#FFFFFF" : "#F8EBEC"}
							leftExaminee={
								<ExamineeBox 
									examineeName={item.nameLeft} 
									onClick={(newState) => examineeClick(newState, techniqueNameList[currentTechniqueStep].technique.text, index, `${index}-left`)}
									status={getExamineeStatus(item.leftId, results)}
									setButtonState={setLeftExamineeState}
									examineeId={item.leftId}
									techniqueName={techniqueNameList[currentTechniqueStep].technique.text}
								/>
							}
							rightExaminee={
								item.rightId ? (
									<ExamineeBox 
										examineeName={item.nameRight}
										onClick={(newState) => examineeClick(newState, techniqueNameList[currentTechniqueStep].technique.text, index, `${index}-right`)}
										status={getExamineeStatus(item.rightId, results)}
										setButtonState={setRightExamineeState}
										examineeId={item.rightId}
										techniqueName={techniqueNameList[currentTechniqueStep].technique.text}
									/>
								) : null
							}
							pairNumber={index+1}
							techniqueName={techniqueNameList[currentTechniqueStep].technique.text}
							examineePairId={item.pairId}
						>
						</ExamineePairBox>
					))}
				</div>
			)}

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
				title={"Tekniker-kategorier"} 
				isOpen={showPopup} 
				setIsOpen={setShowPopup}> 
				{techniqueNameList && (		
					<div className={styles.popupContent}>
						{categoryIndexMap.map((techniqueName, index) => (
							<Button 
								key={index}
								width={"100%"}
								onClick={() => {
									setCurrentTechniqueStep(() => {
										const techniquestep = techniqueName.categoryIndex
										if(techniqueNameList[currentTechniqueStep].categoryName != "YAKUSOKU GEIKO OR RANDORI"){
											setRandoriIndex(currentTechniqueStep)
										}
										onUpdateStepToDatabase(techniquestep)
										return techniquestep
									})
									setShowPopup(false)
									// Fetch the correct result for each examinee conected to this technique
									scrollableContainerRef.current.scrollTop = 0}}>
								<p>{techniqueName.category}</p></Button>
						))}
						{
							// Button that allows the user to return to the technique they was on when going 
							// into randori and is only visible when in the randori category.
							currentTechniqueStep === techniqueNameList.length - 1 && (
								<Button
									width={"100%"}
									outlined={true}
									onClick={() => {
										setCurrentTechniqueStep(() => {
											onUpdateStepToDatabase(indexBeforeRandondi)
											return indexBeforeRandondi
										})
										setShowPopup(false)
									}}>
									<p className={styles.navigationGoBackButton}>Tillbaka till <br/>{techniqueNameList[indexBeforeRandondi].technique.text}</p>
								</Button>)}
						<div>
							{/* Go back to the add examinee page */}
							<Button 
								id={"back-button"} 
								outlined={true}
								onClick={goToAddExamineePage}>
								<p>Tillbaka till <br />&quot;Lägg till deltagare&quot;</p>
							</Button>
							{/* Go to the summary page */}
							<Button 
								id={"summary-button"} 
								onClick={gotoSummary}>
								<p>Fortsätt till summering</p>
							</Button>
						</div>
					</div>
				)}
			</Popup>
		</div>
	)

	/**
     * A function to get the status of an examinee.
     * 
     * @param {*} examineeId the Id of the examinee that we want to find status of 
     * @param {*} results The examination results of the current technique to search through
     * @returns the status of the examinee
     * @author Team Apelsin (2024-05-21)
     * @version 1.0
     */

	function getExamineeStatus(examineeId, results) {
		const result = results.find(res => res.examineeId === examineeId)
		console.log("id:", examineeId, "res:", result)
    
		if (!result) {
			return "default"
		}
    
		if (result.pass === null) {
			return "default"
		}
    
		return result.pass ? "pass" : "fail"
	}
    

	/**
   * @author Team Pomagrade (2024-05-13)
	 * Get method for the grading information. 
	 * @returns JSON response
	 */
	function getGradingProtocol() {
		return fetch(`/api/examination/grading/${gradingId}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"token": token },
		})
			.then(response => {
				if (!response.ok) {
					throw new Error("Network response was not ok")
				}
				return response.json()
			})
	}

	/**
	 * Update step for the grading process. 
	 * @param {String} grading_data 
	 * @returns status code
	 */
	function updateStep(grading_data) {
		delete grading_data.examinees
		grading_data.step = 3

		console.log(grading_data)

		return fetch("/api/examination/grading", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"token": token },
			body: JSON.stringify(grading_data),

		})
			.then(response => {
				if (!response.ok) {
					throw new Error("Network response was not ok")
				}
				return response.status

			})
	}

	async function gotoSummary() {
		//TODO: setShowPopup(false)
		const [grading_data] = await Promise.all([
			getGradingProtocol(),
		])
		updateStep(grading_data)


		navigate(`/grading/${gradingId}/3`)
	}



	/**
	 * Adds a status update to backend for an athlete
	 * @param {Int} examineeId id of the examinee that should have result added
	 * @param {String} techniqueName name on technique in grading
	 * @param {String} passStatus could be either 'pass', 'fail' or 'default'
	 * 
	 * @author Team Apelsin (2024-05-17) - c21ion
	 */
	async function addExamineeResult(examineeId, techniqueName, passStatus) {

		// Convert string for pass status to Boolean
		const passStatusMap = {
			pass: true,
			fail: false,
			default: null,
		}
		// Check existance
		const foundExamineeResult = results.find(item => item.examineeId === examineeId)
		if( foundExamineeResult ){
			await putExamineeResult({ resultId: foundExamineeResult.resultId, examineeId: foundExamineeResult.examineeId, techniqueName: foundExamineeResult.techniqueName, pass: passStatusMap[passStatus] }, token)
				.catch(() => setErrorToast("Kunde inte lägga till resultat. Kolla internetuppkoppling."))
		}else{
			const examineeResultToPost = { examineeId: examineeId, techniqueName: techniqueName, pass: passStatusMap[passStatus] }
			const response = await postExamineeResult(examineeResultToPost, token)
				.catch(() => setErrorToast("Kunde inte lägga till resultat. Kolla internetuppkoppling."))
			const responseJson = await response.json()
			// console.log(responseJson)
			// Create a copy of the current state
			let tempRes = [...results]

			// Add the new response to the copy
			tempRes.push(responseJson)

			// Update the state with the modified copy
			setResults(tempRes)
			// console.log("Response: ", JSON.stringify(responseJson))
		}
	}

	/**
	 * Perform a post to backend for status for an athlete
	 * @param {JSON} result JSON object with info about result, 
	 * 						should be on format "{ examinee_id: **examineeId**, technique_name: **techniqueName**, pass: **passStatus** }"
	 * 
	 * @author Team Apelsin (2024-05-13, c21ion)
	 */
	async function postExamineeResult(result, token) {
		const requestOptions = {
			method: "POST",
			headers: { "Content-Type": "application/json", "token": token },
			body: JSON.stringify(result)
		}
		// console.log("Fetched POST: ", JSON.stringify(result))

		return fetch("/api/examination/examresult", requestOptions)
			.then(response => { return response })
			.catch(error => { alert(error.message) })
	}

	/**
	 * Perform a put to backend for status for an athlete
	 * @param {JSON} result JSON object with info about result, 
	 * 						should be on format "{ resultid: **resultId**, examinee_id: **examineeId**, technique_name: **techniqueName**, pass: **passStatus** }"
	 * 
	 * @author Team Apelsin (2024-05-17, c21ion) 
	 */
	async function putExamineeResult(result, token) {
		const requestOptions = {
			method: "PUT",
			headers: { "Content-Type": "application/json", "token": token },
			body: JSON.stringify(result)
		}

		// console.log("Fetched PUT: ", result)

		return fetch("/api/examination/examresult", requestOptions)
			.then(response => { return response })
			.catch(error => { alert(error.message) })
	}



	/**
     * Navigate back to the page where examinees are added.
     * 
     * @author Team Apelsin (2024-05-15)
     */
	function goToAddExamineePage() {
		navigate(`/grading/${gradingId}/1`)
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
			if (examinee.gradingId == gradingId) {
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
     * @author Team Apelsin (2024-05-17)
     * @version 2.0
     */
	function getPairsInCurrrentGrading(pairs_json) {
		const pair_names_current_grading = []
		pairs_json.forEach((pair) => {
			const examinee1 = examinees.find(item => item.examineeId === pair.examinee1Id)
			const examinee2 = examinees.find(item => item.examineeId === pair.examinee2Id)
			const examineePair = pair.examineePairId
			if (examinee1 !== undefined || examinee2 !== undefined) { // Only add if something is found
				const name1 = examinee1 ? examinee1.name : "" // If only one name found
				const name2 = examinee2 ? examinee2.name : ""
				const id1 = examinee1 ? examinee1.examineeId : ""
				const id2 = examinee2 ? examinee2.examineeId : ""
				pair_names_current_grading.push({ 
					pairId: examineePair,
					nameLeft: name1, 
					nameRight: name2, 
					leftId: id1, 
					rightId: id2
				})
			}
		})
		return pair_names_current_grading
	}

	/**
     * TODO: SHOULD ONLY RETURN THE RESULTS CONNECTED TO THE CURRENT EXAMINATION AND TECHNIQUE
     * 
     * Function to fetch all results for a technique in the database
     * @param {Array} pairs All the pairs of the examination
     * @param {String} techniqueName Name of the technique 
     * @param {any} token 
     * @returns {Promise} The grading data.
     * 
     * @author Team Apelsin 2024-05-16
     * @version 1.0
     * 
     */
	async function fetchTechniqueResults(technique, token) {
		const requestOptions = {
			method: "GET",
			headers: { "token": token },
		}
		try {
			const response = await fetch("/api/examination/examresult/all", requestOptions)
            
			if (!response.ok) {
				throw new Error("Failed to fetch technique results")
			}
			const data = await response.json()
			if (!Array.isArray(data)) {
				throw new Error("Fetched data is not an array")
			}
			const filtered = data
				.filter(item => item.techniqueName === technique)

			// console.log("filtered results: ", filtered);
			setResults(filtered)
		} catch (error) {
			alert(error.message)
			return null // Handle the error gracefully, return null or an empty object/array
		}
	}
	/**
     * Fetches the current grading from the server.
     * @returns {Promise<Object>} A Promise that resolves to the current grading object.
     * @throws {Error} Throws an error if the grading is not found or cannot be fetched.
     */
	async function fetchGrading() {
		const response = await fetch("/api/examination/all", {headers: {"token": token}})
		if (response.status === 404) {
			console.log("404")
			throw new Error("Grading not found")
		}
		if (!response.ok) {
			console.log("Could not fetch the grading")
			throw new Error("Could not fetch the grading")
		}
		const allGradings = await response.json()
		return getCurrentGrading(allGradings)
	}

	/**
     * Fetches the examination protocol for a given grading from the server.
     * @param {Object} grading The grading object for which to fetch the examination protocol.
     * @returns {Promise<Object>} A Promise that resolves to the examination protocol object.
     * @throws {Error} Throws an error if the examination protocols are not found or cannot be fetched.
     */
	async function fetchProtocol(grading) {
		const response = await fetch("/api/examination/examinationprotocol/all", { headers: { "token": token } })
		if (response.status === 404) {
			console.log("404")
			throw new Error("Examination protocols not found")
		}
		if (!response.ok) {
			console.log("Could not fetch examination protocols")
			throw new Error("Could not fetch examination protocols")
		}
		const allProtocols = await response.json()
		return getProtocolCurrentGrading(allProtocols, grading)
	}

	/**
     * Parses the examination protocol by converting it from a string to a JSON object.
     * @param {Object} protocol The examination protocol to parse.
     * @returns {Object} The parsed examination protocol object.
     */
	function parseProtocol(protocol) {
		const parsedProtocol = { ...protocol }
		parsedProtocol.examinationProtocol = JSON.parse(protocol.examinationProtocol)
		return parsedProtocol
	}

	/**
     * Updates the state with the parsed examination protocol.
     * @param {Object} parsedProtocol - The parsed examination protocol object.
     */
	function updateState(parsedProtocol) {
		const techniqueNameList = getTechniqueNameList(parsedProtocol.examinationProtocol)
		const categoryIndexMap = getCategoryIndices(techniqueNameList)
		setTechniqueNameList(techniqueNameList)
		setCategoryIndices(categoryIndexMap)
		// TODO: Set the index to the one inside the technique_step when it is available
		setCurrentTechniqueStep(0)
	}

	/**
     * Handles errors that occur during fetching of examination protocols.
     * @param {Error} error The error object containing details of the error.
     */
	function handleFetchError(error) {
		setErrorToast("Kunde inte hämta protokollet")
		console.error(error)
	}

	/**
     * Finds the current grading from a list of all gradings based on the grading ID.
     * @param {Object[]} all_gradings An array containing all available gradings.
     * @returns {Object|undefined} The current grading object, or undefined if not found.
     */
	function getCurrentGrading(all_gradings) {
		const current_grading = all_gradings.find((grading) => grading.gradingId == gradingId)
		return current_grading
	}

	/**
     * Finds the examination protocol for the current grading from a list of all protocols.
     * @param {Object[]} all_protocols An array containing all available examination protocols.
     * @param {Object} current_grading The current grading object.
     * @returns {Object|undefined} The examination protocol for the current grading, or undefined if not found.
     */
	function getProtocolCurrentGrading(all_protocols, current_grading) {
		const current_grading_protocol = all_protocols.find((protocol) => protocol.beltId === current_grading.beltId)
		return current_grading_protocol
	}
}