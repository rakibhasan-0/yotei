import React, { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { AccountContext } from "../../../context"
import TechniqueInfoPanel from "../../../components/Grading/PerformGrading/TechniqueInfoPanel";

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
	const chronologicalData = [];

	// Traverse the categories and techniques to store in chronological order
	gradingProtocolJSON.categories.forEach(category => {
		const categoryName = category.category_name;
		const techniques = category.techniques;

		techniques.forEach((technique, index) => {
			const nextTechnique = index < techniques.length - 1 ? techniques[index + 1] : null;
			chronologicalData.push({categoryName, technique, nextTechnique});
		});
	});

	// Remove null to not get errors when printing
	chronologicalData.forEach((element, index) => {
		// Check if element's nextTechnique is null and index is not the last element
		if(element.nextTechnique === null && index < chronologicalData.length - 1){
			element.nextTechnique = chronologicalData[index+1].technique
		} 
		// Check if element's nextTechnique is null and index is the last element
		else if(element.nextTechnique === null && index === chronologicalData.length - 1) {
			element.nextTechnique = '---'
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
	const res = [];
	const seenCategories = new Set(); // To keep track of seen categories
  
	dataArray.forEach((element, index) => {
	  const category = element.categoryName;
	  if (category && !seenCategories.has(category)) {
		res.push({ category, index });
		seenCategories.add(category); // Add category to the set
	  }
	});
   
	return res;
  }

export default function DuringGrading() {
	const navigate = useNavigate()
	const { examinationID } = useParams()
	const { token } = useContext(AccountContext)
	const [currentIndex, setCurrentIndex] = useState(0);

	const goToNextTechnique = () => {
		setCurrentIndex(currentIndex + 1);
	}
	// TODO: Loads everytime the button is pressed. Should only happen once at start. useEffect?
	const techniqueNameList = getTechniqueNameList(ProtocolYellow)
	const categoryIndexMap = getCategoryIndices(techniqueNameList)

	console.log(categoryIndexMap)

	return (
		<div>
			<TechniqueInfoPanel 
				categoryTitle=""
				currentTechniqueTitle = {techniqueNameList[currentIndex].technique.text}
				nextTechniqueTitle = {techniqueNameList[currentIndex].nextTechnique.text}
				mainCategoryTitle = {techniqueNameList[currentIndex].categoryName}></TechniqueInfoPanel>
			<button onClick={goToNextTechnique}>Next</button>
		</div>
	)
}