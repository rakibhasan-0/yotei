import { useState } from "react"
import styles from "./TechniqueWeaveCreate.module.css"
import InputTextField from "../../../components/Common/InputTextField/InputTextField"
import TextArea from "../../../components/Common/TextArea/TextArea"
import Flowchart from "../../../components/Common/Flowchart/Flowchart"

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

	const [errorMessage, setErrorMessage] = useState("")
	return (<>
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
				setTechniqueDesc(e)
			}}
			required={true}
			type="text"
			id = "exercise-description-input"
			errorDisabled={true}
		/>
		<Flowchart></Flowchart>
	</>
	)
}

export default CreateWeave