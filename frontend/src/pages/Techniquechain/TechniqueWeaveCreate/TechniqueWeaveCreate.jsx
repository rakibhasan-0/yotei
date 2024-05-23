import { useState, useContext, useReducer, useEffect } from "react"
import styles from "./TechniqueWeaveCreate.module.css"
import InputTextField from "../../../components/Common/InputTextField/InputTextField"
import TextArea from "../../../components/Common/TextArea/TextArea"
import Flowchart from "../../../components/Common/Flowchart/Flowchart"
import Button from "../../../components/Common/Button/Button"
import ConfirmPopup from "../../../components/Common/ConfirmPopup/ConfirmPopup"
import Divider from "../../../components/Common/Divider/Divider"
import CheckBox from "../../../components/Common/CheckBox/CheckBox"
import TagInput from "../../../components/Common/Tag/TagInput"
import AddUserComponent from "../../../components/Workout/CreateWorkout/AddUserComponent"
import { useLocation } from "react-router"
import { workoutCreateReducer, WORKOUT_CREATE_TYPES, WorkoutCreateInitialState } from "../../../components/Workout/CreateWorkout/WorkoutCreateReducer"
import { AccountContext } from "../../../context"
/**
 * The technique weave create page.
 * ADD DESC
 * 
 * @author Team Durian
 * @version 1.0
 * @since 2024-05-20
 */

const CreateWeave = () => {
	const [techniqueWeaveName, setTechniqueName] = useState("")
	const [techniqueWeaveNameErr, setTechniqueNameErr] = useState("")
	const [techniqueWeaveDesc, setTechniqueDesc] = useState("")
	const [showPopup, setShowPopup] = useState(false)

	const [errorMessage, setErrorMessage] = useState("")


	const context = useContext(AccountContext)
	const { state } = useLocation()
	const [workoutCreateInfo, workoutCreateInfoDispatch] = useReducer(workoutCreateReducer, JSON.parse(JSON.stringify(WorkoutCreateInitialState)))
	const [hasLoadedData, setHasLoadedData] = useState(false)

	useEffect(() => {
		const item = localStorage.getItem("workoutCreateInfo")

		if (item) {
			workoutCreateInfoDispatch({ type: WORKOUT_CREATE_TYPES.INIT_WITH_DATA, payload: JSON.parse(item) })
		} else {
			workoutCreateInfoDispatch({ type: WORKOUT_CREATE_TYPES.SET_INITIAL_STATE })
		}

		setHasLoadedData(true)
	}, [])

	const test = () => {
		console.log("foo")
	}

	const handleGoBack = () => {
		console.log("lol")
	}

	const confirmGoBack = () => {
		console.log("lol")
	}

	return (
		<>
			<title>Skapa teknikväv</title>
			<h1>Skapa teknikväv</h1>
			<InputTextField
				id="create-technique-weave-name"
				text={techniqueWeaveName}
				placeholder="Namn"
				errormessage={techniqueWeaveNameErr}
				onChange={e => {
					setTechniqueName(e.target.value)
					setTechniqueNameErr(null)
				}}
				required={true}
				type="text"
				errorMessage={errorMessage}
			/>
			<TextArea
				className={styles.standArea}
				placeholder="Beskrivning"
				text={techniqueWeaveDesc}
				onChange={(e) => {
					setTechniqueDesc(e.target.value)
				}}
				required={true}
				type="text"
				id = "exercise-description-input"
				errorDisabled={true}
			/>
			<Flowchart callback={test} state={state}></Flowchart>
			<CheckBox
				id="workout-create-checkbox"
				label="Privat pass"
				onClick={() =>
					console.log("yep")
				}
				checked={false}
			/>
			<Divider option={"h1_center"}></Divider>
			<AddUserComponent
				id="workout-create-add-users"
				addedUsers={[{userId: 1, username: "eyyy"}]}
				setAddedUsers={() =>
					console.log("yeye")
				}
			/>
			<Divider option={"h1_left"} title={"Taggar"} />

			<TagInput addedTags={[{id: 1, name: "eyo"}]}/>

			<div style={{display: "flex", flexDirection: "row", width: "100%", justifyContent: "center", gap: 10 }}>
				<Button
					onClick={() => {
						handleGoBack()
					}}
					outlined={true}
					id="workout-create-back-button"
				>
					<h2>Tillbaka</h2>
				</Button>
			
				<ConfirmPopup
					id = "confirm-pop-up-go-back"
					showPopup={showPopup}
					setShowPopup={setShowPopup}
					onClick={confirmGoBack}
					popupText="Är du säker på att du vill gå tillbaka?"
					confirmText="Ja"
					backText="Avbryt"
					zIndex={1000} 
				/>
				<Button type="submit" id="workout-create-back-button">
					<h2>Spara</h2>
				</Button>
			</div>
			
		</>
	)
}

export default CreateWeave