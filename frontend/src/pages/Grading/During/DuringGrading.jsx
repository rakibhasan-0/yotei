import React, { useState, useEffect } from "react"

import TechniqueInfoPanel from "../../../components/Grading/PerformGrading/TechniqueInfoPanel"

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

	dataArray.forEach((element, index) => {
		const category = element.categoryName
		if (category && !seenCategories.has(category)) {
			res.push({ category, index })
			seenCategories.add(category) // Add category to the set
		}
	})

	return res
}

export default function DuringGrading() {
	//const navigate = useNavigate()
	//const { examinationID } = useParams()
	//const { token } = useContext(AccountContext)
	const [currentIndex, setCurrentIndex] = useState(0)
	const [examinees, setExaminees] = useState(undefined)
	const [pairs, setPairs] = useState()
	const grading_id = 1 // temp, should be collected from url

	const goToNextTechnique = () => {
		setCurrentIndex(currentIndex + 1)
	}

	useEffect(() => {
		(async () => {
			//setIsLoadingGroups(true)
			try {
				const response = await fetch("/api/examination/examinee/all", {})
				if (response.status === 404) {
					console.log("404")
					//setIsLoadingGroups(false)
					return
				}
				if (!response.ok) {
					//setIsLoadingGroups(false)
					console.log("could not fetch examinees")
					throw new Error("Could not fetch examinees")
				}
				const all_examinees = await response.json()
				
				const current_grading_examinees = getExamineesCurrentGrading(all_examinees)
				setExaminees(current_grading_examinees)
				console.log("Examinees in this grading: ", current_grading_examinees)
				
				//setIsLoadingGroups(false)
			} catch (ex) {
				//setIsLoadingGroups(false)
				setErrorToast("Kunde inte hämta alla utövare")
				console.error(ex)
			}
		})()
	}, [] )

	useEffect(() => {
		if(examinees !== undefined){ // To prevent running first time. Is there a better way to chain api calls?
			(async () => {
				try {
					//setIsLoadingWorkouts(true)
					const response = await fetch("/api/examination/pair/all", {})
					if (response.status === 204) {
						//setIsLoadingWorkouts(false)
						return
					}
					if (!response.ok) {
						//setIsLoadingWorkouts(false)
						throw new Error("Could not fetch pairs")
					}
					const pairs_json = await response.json()

					// Get only pairs in this grading
					const pair_names_current_grading = getPairsInCurrrentGrading(pairs_json)
					setPairs(pair_names_current_grading)
					console.log("Pairs in this examination: ", pair_names_current_grading)
					//setIsLoadingWorkouts(false)
				} catch (ex) {
					//setIsLoadingWorkouts(false)
					setErrorToast("Kunde inte hämta alla par")
					console.error(ex)
				}
			})()
		}
		
		
	}, [examinees])


	// TODO: Loads everytime the button is pressed. Should only happen once at start. useEffect?
	const techniqueNameList = getTechniqueNameList(ProtocolYellow)
	const categoryIndexMap = getCategoryIndices(techniqueNameList)

	//console.log(categoryIndexMap)

	return (
		<div>
			<TechniqueInfoPanel
				categoryTitle=""
				currentTechniqueTitle={techniqueNameList[currentIndex].technique.text}
				nextTechniqueTitle={techniqueNameList[currentIndex].nextTechnique.text}
				mainCategoryTitle={techniqueNameList[currentIndex].categoryName}></TechniqueInfoPanel>
			<button onClick={goToNextTechnique}>Next</button>
		</div>
	)

	/**
	 * 
	 * @param {Array} all_examinees All examinees from all gradings
	 * @returns {Array} All examiees in this grading
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
	 * @returns Array with all pairs in this grading, presented by name, ie {name1, name2}
	 */
	function getPairsInCurrrentGrading(pairs_json) {
		const pair_names_current_grading = []
		pairs_json.forEach((pair) => {
			const examinee1 = examinees.find(item => item.examinee_id === pair.examinee_1_id)
			const examinee2 = examinees.find(item => item.examinee_id === pair.examinee_2_id)
			if (examinee1 !== undefined || examinee2 !== undefined) { // Only add if something is found
				const name1 = examinee1 ? examinee1.name : '' // If only one name found
				const name2 = examinee2 ? examinee2.name : ''
				pair_names_current_grading.push({ name1, name2 })
			}
		})
		return pair_names_current_grading
	}
}