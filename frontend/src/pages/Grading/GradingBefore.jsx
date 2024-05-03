import { useState, useEffect, useContext } from "react"
import { Link, useLocation, useNavigate} from "react-router-dom"
import Button from "../../components/Common/Button/Button"
import style from "./GradingCreate.module.css"
import styles from "./GradingBefore.module.css"
import Spinner from "../../components/Common/Spinner/Spinner"
import { AccountContext } from "../../context"
import { Draggable } from "react-drag-reorder"
import AddExaminee from "../../components/Common/AddExaminee/AddExaminee"


/**
 * The grading create page.
 * Creates a new grading.
 * 
 * @author Team Pomegranate
 * @version 1.0
 * @since 2024-05-02
 */
export default function GradingCreate() {

	const [beltColors] = useState(["Gult", "Orange", "Grönt", "Blått", "Brunt"])
	const [belts, setBelts] = useState({}) 
	const [loading, setLoading] = useState(true)
	const context = useContext(AccountContext)
	const { token, userId } = context

	const [numExaminees, setNumExaminee] = useState(8)
	const [numPairs, setNumPairs] = useState(0)


	// För att hålla koll på examinee-element och deras ordning
	const [examinee, setExaminee] = useState([
		["hi"],
		["hello"],
		["cool"],
		["zup"],
		["Anton"],
		["Malin"],
		["Hannes"],
		["Linus"]
	])

	const handleDrag = (startIndex, endIndex) => {

		console.log(startIndex, endIndex)

		if(numPairs > 0) {
			startIndex = startIndex === 0 ? startIndex : startIndex - numPairs
			endIndex = endIndex === 0 ? endIndex : endIndex - numPairs
		}

		let data = [...examinee]
    
		// Get the dragged and landed
		let start = data[startIndex]
		let end = data[endIndex]
    

		// If both dragged and landed have only one element
		if (start.length === 1 && end.length === 1) {

			// Move the dragged element to the landed array
			end.push(start[0])
			start.pop()

			// Remove the dragged element from its original position
			data[startIndex] = []
			setNumPairs(numPairs+1)

		} else {
			data[endIndex] = start
      
		}

		data = data.filter(item => item.length > 0)

		// Update the state with the modified data array
		setExaminee(data)
	}

	useEffect(() => {
		console.log(examinee) // Log examinee after it has been updated
	}, [examinee]) // Run this effect whenever examinee changes

	return (
		<div>
			<div className = {style.beltButtonStyle}> 
				<div style={{ backgroundColor: "#FFD700", borderRadius: "0.3rem", padding: "0px" }}>
					<h2>KIHON WAZA</h2>
				</div>
			</div>

			<div className="column">
				<Draggable onPosChange={handleDrag}>
					{examinee.map((innerExaminee, innerIdx) => {
						return (
							<div key={innerIdx} className="flexItem">
								{innerExaminee}
							</div>
						)
					})}
				</Draggable>
			</div>
     

       	<AddExaminee
				name="example-input-text-field"
				id="example-input-text-field"
				type="text"
				placeholder="Write here"
				value={"as"}
				required={true}
	      />

			<div className={styles.buttonContainer}>
				<Button
					width="100%"
					outlined={true}
					onClick={() => {
						navigate("/grading/create")
					}}
				>
					<p>Tillbaka</p>
				</Button>
				<Button
					width="100%"
					onClick={() => {
						addExerciseAndTags()
					}}
				>
					<p>Forsätt</p>
				</Button>
			</div>
		</div>
	)
}