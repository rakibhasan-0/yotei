import React, { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { AccountContext } from "../../../context"

// Temp
import ProtocolYellow from "./yellowProtocolTemp.json"

/* Achive:
-- Take out 

*/


function getTechniqueNameList() {
	// Store data in an array for chronological traversal
	const chronologicalData = [];

	// Traverse the categories and techniques to store in chronological order
	ProtocolYellow.categories.forEach(category => {
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
	// TODO: Loads everytime the button is pressed. Should only happen once at start.
	const techniqueNameList = getTechniqueNameList()
	const categoryIndexMap = getCategoryIndices(techniqueNameList)

	console.log(categoryIndexMap)

	return (
		<div>
			<h1>During Examination</h1>
            <h2>JSON-file: </h2>
			<p>{techniqueNameList[currentIndex].categoryName}</p>
			<p>Current: {techniqueNameList[currentIndex].technique.text}</p>
			<p>Next: {techniqueNameList[currentIndex].nextTechnique.text}</p>
			<button onClick={goToNextTechnique}>Next</button>
		</div>
	)
}