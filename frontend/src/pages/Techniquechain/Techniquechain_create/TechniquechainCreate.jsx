import InputTextField from "../../../components/Common/InputTextField/InputTextField.jsx"
import React, { useContext, useEffect, useState, useRef } from "react"
import styles from "./TechniquechainCreate.module.css"
import TextArea from "../../../components/Common/TextArea/TextArea.jsx"
import Divider from "../../../components/Common/Divider/Divider.jsx"
import Dropdown from "../../../components/Common/List/Dropdown"
import { useLocation } from "react-router-dom"
import Button from "../../../components/Common/Button/Button.jsx"
import { useNavigate } from "react-router"

export default function TechniquechainCreate() {

	const { state } = useLocation()
	const [errorMessage, setErrorMessage] = useState("")
	const [groups, setGroups] = useState()
	const [group, setGroup] = useState(state?.session?.group)
	const navigate = useNavigate()

	// true when data has been saved, when unmounting and rebuilding view.
	const [techniquechainCreateInput, setTechniquechainCreateInput] = useState(() => {
		const retTechniquechainCreateInput = JSON.parse(localStorage.getItem("techniqueCreateLocalStorageKey"))
		if (retTechniquechainCreateInput) {
			return retTechniquechainCreateInput
		} else {
			return {
				name: "",
				desc: "",
				addBoxChecked: false,
				eraseBoxChecked: false,
				addedTags: []
			}
		}
	})

	const clearTechniqueCreateInput = (addBoxChecked, eraseBoxChecked) => {
		setTechniquechainCreateInput({
			name: "",
			desc: "",
			addBoxChecked: addBoxChecked,
			eraseBoxChecked: eraseBoxChecked,
			addedTags: []
		})

		localStorage.removeItem("techniqueCreateLocalStorageKey")
	}

	const [name, setName] = useState(() => {
		return techniquechainCreateInput.name
	})
	const [desc, setDesc] = useState(() => {
		return techniquechainCreateInput.desc
	})
	const [time, setTime] = useState(() => {
		return techniquechainCreateInput.time
	})

	const [addedTags, setAddedTags] = useState(() => {
		return techniquechainCreateInput.addedTags
	})

	/**
	 * Updates the exerciseCreateInput object when new input is added
	 * @param fieldName The exerciseCreateInput objects attribute to be changed
	 * @param value The new value
	 */
	const storeInputChange = (fieldName, value) => {
		setTechniquechainCreateInput(prevState => ({
			...prevState,
			[fieldName]: value
		}))
	}

	return (
		<div>
			<title>Skapa Kedja</title>
			<h1>Skapa kedja</h1>
			<div style={{ height: "1rem"}}/>

			<InputTextField
				placeholder="Namn"
				text={techniquechainCreateInput.name}
				onChange={(e) => {
					setName(e.target.value)
					storeInputChange("name", e.target.value)
				}}
				required={true}
				type="text"
				id="ExerciseNameInput"
				errorMessage={errorMessage}
			/>
			<TextArea
				className={styles.standArea}
				placeholder="Beskrivning"
				text={techniquechainCreateInput.desc}
				onChange={(e) => {
					setDesc(e.target.value)
					storeInputChange("desc", e.target.value)
				}}
				required={true}
				type="text"
				id = "exercise-description-input"
				errorDisabled={true}
			/>
			<Divider option={"h1_left"} title={"Teknikväv"} />

			<Dropdown id={"techniqueweave-dropdown"} text={group?.name || "Teknikväv"} centered={true}>
				{groups?.length > 0 ? groups.map((plan, index) => (
					<div className={styles.dropdownRow} key={index} onClick={() =>{ 
						setGroup(plan)
					}}>
						<p className={styles.dropdownRowText}>{plan.name}</p>
					</div>
				)) : <div className={styles.dropdownRow}>
					<p className={styles.dropdownRowText}>Kunde inte hitta några Teknikvävar</p>
				</div>}
			</Dropdown>

			<div className={styles.wrapCentering} style={{ marginBottom: "2rem", marginTop: "1rem" }} >
				<Button onClick= {() => navigate("/techniquechain")} id = {"sessions-back"}outlined={true}><p>Tillbaka</p></Button>
			</div>
		</div>
	)

}