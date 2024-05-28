import { useState, useEffect, useContext } from "react"
import styles from "./TechniqueWeaveCreate.module.css"
import InputTextField from "../../../../components/Common/InputTextField/InputTextField"
import TextArea from "../../../../components/Common/TextArea/TextArea"
import Flowchart from "../../../../components/Common/Flowchart/Flowchart"
import Button from "../../../../components/Common/Button/Button"
import ConfirmPopup from "../../../../components/Common/ConfirmPopup/ConfirmPopup"
import Divider from "../../../../components/Common/Divider/Divider"
import CheckBox from "../../../../components/Common/CheckBox/CheckBox"
import TagInput from "../../../../components/Common/Tag/TagInput"
import AddUserComponent from "../../../../components/Workout/CreateWorkout/AddUserComponent"
import { AccountContext } from "../../../../context"
import { useNavigate} from "react-router"
import { HTTP_STATUS_CODES } from "../../../../utils"
import { useNodesState } from "reactflow"

/**
 * The technique weave create page.
 * !NOTE! 
 * This component is far from done and is not optimally implemented, 
 * it is left in this state due to time constraints and unclear specifications.
 * The decision on starting the implementation was made so that the users can test
 * something that maybe resembles what they are looking for. A complete remodel
 * might be a good idea...
 * !NOTE!
 * 
 * TODOS: Validation of input, not being able to save a weave without a name
 * 				add node coordinates when saving a weave (more things are commented in the code)
 * 
 * @author Team Durian
 * @version 1.0
 * @since 2024-05-20
 */

const CreateWeave = () => {
	const [techniqueWeaveName, setTechniqueName] = useState("")
	const [weaveId, setWeaveId] = useState("")
	const [nodes, setNodes, onNodesChange] = useNodesState([])
	const [edges, setEdges] = useState([])
	// Should be used to prompt the user to fill in a name for the weave
	const [techniqueWeaveNameErr, setTechniqueNameWeaveErr] = useState("")
	const [techniqueWeaveDesc, setTechniqueDesc] = useState("")

	const [showPopup, setShowPopup] = useState(false)
	const context = useContext(AccountContext)
	const navigate = useNavigate()

	useEffect(()=> {
		createWeave()
	}, [])

	const createWeave = async () => {
		const requestOptions = {
			method: "POST",
			headers: { "Content-type": "application/json", "token": context.token },
			body: JSON.stringify({
				name: techniqueWeaveName,
				description: techniqueWeaveDesc
			})
		}

		const response = await fetch("/api/techniquechain/weave/create", requestOptions)
		if (response.status !== HTTP_STATUS_CODES.OK) {
			//Implement some error message/popup
			return null
		} else {
			const data = await response.json()
			setWeaveId(data.id)
		}
	}

	const handleSave = async () => {
		console.log("Edges")
		console.log(edges)
		console.log("nodes")
		console.log(nodes)
		// Should probably check for unnecessary whitespaces and wierd characters
		if(techniqueWeaveName) {
			edges.map(async (edge)  => {
				const requestOptions1 = {
					method: "POST",
					headers: { "Content-type": "application/json", "token": context.token },
					body: JSON.stringify({
						fromNodeId: parseInt(edge.source),
						toNodeId: parseInt(edge.target)
					})
				}
				const response = await fetch("/api/techniquechain/edge/create", requestOptions1)
				if(response.status !== 201) console.error("failed to create edge")
			})

			nodes.map(async (node)  => {
				const requestOptions2 = {
					method: "POST",
					headers: { "Content-type": "application/json", "token": context.token },
					body: JSON.stringify({
						node_x_pos: node.position.x,
						node_y_pos: node.position.y,
						node_id: node.id,
						techniqueWeaveId: weaveId
					})
				}
				const response = await fetch("/api/techniquechain/weaveRepresentation/create", requestOptions2)
				if(!response.ok) console.error("failed to create representation")
			})
			const requestOptions = {
				method: "PUT",
				headers: { "Content-type": "application/json", "token": context.token },
				body: JSON.stringify({
					id: weaveId,
					name: techniqueWeaveName,
					description: techniqueWeaveDesc
				})
			}

			const response = await fetch("/api/techniquechain/weave/edit", requestOptions)
			if (response.status !== HTTP_STATUS_CODES.OK) {
			//Implement som error message/popup
				console.error("error editing weave")
				return null
			} else {
			//success popup
				navigate("/techniquechain/")
			}	
		}

	}

	const handleGoBack = () => {
		//Should make sure that no unsaved changes are discarded without prompting the user
		//And if the user discards the newly created weave it should be deleted from db as it is created on render
		//the reason for that behavior is due to the fact that every node needs to be linked to a weave
		navigate(-1)
	}

	const confirmGoBack = () => {
		//Confirm to discard unsaved changes, navigate to techniquechain with correct tab
		console.log("TODO")
	}

	return (
		<div className={styles.content}>
			<title>Skapa teknikväv</title>
			<h1>Skapa teknikväv</h1>
			<InputTextField
				id="create-technique-weave-name"
				text={techniqueWeaveName}
				placeholder="Namn"
				errormessage={techniqueWeaveNameErr}
				onChange={e => {
					setTechniqueName(e.target.value)
					setTechniqueNameWeaveErr("")
				}}
				required={true}
				type="text"
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
			<Flowchart 
				weaveId={weaveId}
				nodes={nodes}
				edges={edges}
				setNodes={setNodes}
				setEdges={setEdges}
				onNodesChange={onNodesChange}
				editable={true}
			/>
			<CheckBox
				id="workout-create-checkbox"
				label="Privat pass"
				onClick={() =>
					console.log("TODO: Implement private toggle")
				}
				checked={false}
			/>
			<Divider option={"h1_center"}></Divider>
			{/*Should get data from backend*/}
			<AddUserComponent
				id="workout-create-add-users"
				addedUsers={[{userId: 1, username: "eyyy"}]}
				setAddedUsers={() =>
					console.log("TODO: Implement permissions")
				}
			/>
			<Divider option={"h1_left"} title={"Taggar"} />
			{/*Should get data from backend*/}
			<TagInput addedTags={[{id: 1, name: "eyo"}]}/>

			<div style={{display: "flex", flexDirection: "row", width: "100%", justifyContent: "center", gap: 10 }}>
				<Button
					onClick={() => {
						handleGoBack()
					}}
					outlined={true}
					id="technique-weave-back-button"
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
				<Button type="submit" id="workout-create-back-button" onClick={handleSave}>
					<h2>Spara</h2>
				</Button>
			</div>
			
		</div>
	)
}

export default CreateWeave