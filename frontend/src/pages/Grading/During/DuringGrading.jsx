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
			step.technique_step_num = currentTechniqueStep
			console.log("response grading", step.technique_step_num)

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
        console.log("leftExamineeState:", leftExamineeState);
        console.log("rightExamineeState:", rightExamineeState);
    }, [leftExamineeState, rightExamineeState]);


	// Will handle the api call that will update the database with the result. 
	const examineeClick = (newState, technique, pairIndex, buttonId) => {
        console.log(`Pressed ${buttonId} button in pair ${pairIndex} on technique: ${technique}, with new state ${newState}`)
		// Check what state the button is in and send the proper information to DB.
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
			{techniqueNameList && (		
				<div ref={scrollableContainerRef} className={styles.scrollableContainer}>
					{pairs.map((item, index) => (
						<ExamineePairBox 
							key={index}
							rowColor={index % 2 === 0 ? "#FFFFFF" : "#F8EBEC"}
							leftExaminee={
								<ExamineeBox 
									examineeName={item.nameLeft} 
									onClick={(newState) => examineeClick(newState, techniqueNameList[currentTechniqueStep].technique.text, index, `${index}-left`)}
									buttonState={leftExamineeState}
									setButtonState={setLeftExamineeState}>
								</ExamineeBox>
							}
							rightExaminee={
								item.rightId ? (
									<ExamineeBox 
										examineeName={item.nameRight}
										onClick={(newState) => examineeClick(newState, techniqueNameList[currentTechniqueStep].technique.text, index, `${index}-right`)}
										buttonState={rightExamineeState}
										setButtonState={setRightExamineeState}
										examineeId={item.rightId}
									/>
								) : null
							}
							pairNumber={index+1}>
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
										onUpdateStepToDatabase(techniquestep)
										return techniquestep
									})
									setShowPopup(false)
									// Fetch the correct result for each examinee conected to this technique
									scrollableContainerRef.current.scrollTop = 0}}>
								<p>{techniqueName.category}</p></Button>
						))}
                
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
   * @author Team Pomagrade (2024-05-13)
   */
	function gotoSummary() {
		//TODO: setShowPopup(false)
		navigate(`/grading/${gradingId}/3`)
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
			if (examinee1 !== undefined || examinee2 !== undefined) { // Only add if something is found
				const name1 = examinee1 ? examinee1.name : "" // If only one name found
				const name2 = examinee2 ? examinee2.name : ""
				const id1 = examinee1 ? examinee1.examineeId : ""
				const id2 = examinee2 ? examinee2.examineeId : ""
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
            // const response = await fetch(`/api/examination/examresult/${techniqueNameList[currentTechniqueStep].technique.text}/${gradingId}`, requestOptions);
            const response = await fetch(`/api/examination/examresult/all`, requestOptions);
            
            if (!response.ok) {
                throw new Error("Failed to fetch technique results")
            }
            const data = await response.json()
            if (!Array.isArray(data)) {
                throw new Error('Fetched data is not an array');
            }
            console.log("data: ", data)
            // TODO: MAKE SURE THE VARIABLE NAMES ALIGN WITH THE ONES IN THE RESULT DATA.
            const filtered = data
                .filter(item => item.technique_name === technique)
                .map(item => ({ examineeId: item.examineeId, pass: item.pass }));

            console.log("filtered results: ", filtered);
            setResults("filtered data: ", filtered);
        } catch (error) {
            alert(error.message)
            return null // Handle the error gracefully, return null or an empty object/array
        }
    }

    /**
     *  
     * Function to update the color of all examinees
     * @param {Array} res the current result for the current technique.
     * 
     * @author Team Apelsin 2024-05-16
     * @version 1.0
     * 
     */
    function updateExamineeColors(results, pairs) {
        results.forEach((techniqueResult) => {
            const id = techniqueResult.examinee_id

            const examinee1 = pairs.find(item => item.leftId === id)
            const examinee2 = pairs.find(item => item.rightId === id) 
            console.log("Examinee1: ", examinee1, " Examinee2: ", examinee2)

            let techniqueState
            switch (techniqueResult.pass) {
                case true:
                    techniqueState = "pass"
                    break;
                case false:
                    techniqueState = "fail"
                    break;
                default:
                    techniqueState = "default"
            }

            if(examinee1) {
                setLeftExamineeState(techniqueState)
            } else if(examinee2) {
                setRightExamineeState(techniqueState)
            }
        })
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