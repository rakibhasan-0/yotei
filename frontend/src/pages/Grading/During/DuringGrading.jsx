import React, { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { AccountContext } from "../../../context"

// Temp
import ProtocolYellow from "./yellowProtocolTemp.json"

/* Achive:
-- Take out 

*/
const goToNextTechnique = () => {
	setCurrentIndex(currentIndex + 1);
}

function getCurrentTechniqueName() {
	const jsonString = JSON.stringify(ProtocolYellow)
	
	// Parse the JSON data
	const data = JSON.parse(jsonString);

	// Store data in an array for chronological traversal
	const chronologicalData = [];

	// Traverse the categories and techniques to store in chronological order
	data.categories.forEach(category => {
		const categoryName = category.category_name;
		const techniques = category.techniques;

		techniques.forEach((technique, index) => {
			const nextTechnique = index < techniques.length - 1 ? techniques[index + 1] : null;
			chronologicalData.push({categoryName, technique, nextTechnique});
		});
	});

	chronologicalData.forEach((element, index) => {
		if(element.nextTechnique === null && index < chronologicalData.length - 1){
			element.nextTechnique = chronologicalData[index+1].technique
		}
	})

	// Log chronological data
	console.log("Technique list",chronologicalData);

	return chronologicalData
}

export default function DuringGrading() {
	const navigate = useNavigate()
	const { examinationID } = useParams()
	const { token } = useContext(AccountContext)
	const [currentIndex, setCurrentIndex] = useState(0);
	// How to call const TODO

	

	//const technique_list = ProtocolYellow.categories.
	//console.log("curretn index:", {currentIndex} )
	
	
	const currentTechnique = getCurrentTechniqueName()
	console.log("curretn technique", currentTechnique[currentIndex].technique.text)




	// On open
	

	//const arrayToPrint = ['Apple', 'Banana', 'Orange'];
	// <p>Current technique={currentTechnique[currentIndex].technique}</p>

	return (
		<div>
			<h1>During Examination</h1>
            <h2>JSON-file: </h2>
			<p>Current index={currentIndex}</p>
			<p>Current technique={currentTechnique[currentIndex].technique.text}</p>
			
			
			<button onClick={goToNextTechnique}>Next</button>
			
			
			
		</div>
	)
	/*
	{
				ProtocolYellow.categories.map((category_name, techniques) => (
					<p>{category_name}</p>
				))
			}
			*/
}