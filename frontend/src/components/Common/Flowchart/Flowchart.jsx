import React, { useState, useContext, useCallback } from "react"
import styles from"./Flowchart.module.css"
import Button from "../Button/Button"
import Popup from "../Popup/Popup"
import AddTechnique from "../../Workout/CreateWorkout/AddTechnique"
import { AccountContext } from "../../../context"
import ReactFlow, { addEdge, useNodesState, useEdgesState} from "reactflow"


/**
 * Displays a thechinque weave as a Flowchart.
 * 
 * !NOTE! 
 * This component is far from done and is not optimally implemented, 
 * it is left in this state due to time constraints and unclear specifications.
 * The decision on starting the implementation was made so that the users can test
 * something that maybe resembles what they are looking for. A complete remodel
 * might be a good idea...
 * !NOTE!
 * 
 * TODOS: Mappa ids för att göra kopplingar, Radera noder, visa beskrivning, 
 * resizea flowchartrutan, lägga till pilar, 
 * 
 * @author Durian Team 3
 * @version 1.0
 * @since 2024-05-20
 */

const Flowchart = ({weaveId}) => {
	//const [nodes, setNodes] = useState([])
	const context = useContext(AccountContext)
	const [nodes, setNodes, onNodesChange] = useNodesState([])
	const [edges, setEdges, onEdgesChange] = useEdgesState([])

	// eslint-disable-next-line no-unused-vars
	const [connections, setConnections] = useState([])
	const [activityPopup, setActivityPopup] = useState(false)
	const [clickedNodes, setClickedNodes] = useState([])


	const [ownName, setOwnName] = useState("")
	const [nodeDesc, setNodeDesc] = useState("")
	const [chosenTech, setChosenTech] = useState(null)
	const [participant, setParticipant] = useState(1)

	const onConnect = useCallback(
		(params) => setEdges((eds) => addEdge(params, eds)),
		[],
	)

	function handleSubmit(){
		setActivityPopup(false)
		console.log(chosenTech)
		handleAddNode(chosenTech, ownName, nodeDesc, participant)
		setOwnName("")
		setChosenTech(null)
		setNodeDesc("")
		setParticipant(1)
	}

	async function handleAddNode(chosenTech, ownName, nodeDesc, participant) {
		console.log(nodes)
		const node = [{ 
			id: "nodes.length + 1",
			type: "input", 
			data: {label: chosenTech ? chosenTech.name : ownName}, 
			position: { x: 50, y: 50}, 
			style: {backgroundColor: participant === 1 ? "lightblue" : "lightgreen"}}
		]
		if(nodes) {
			setNodes((nds) => nds.concat(node))
		} else {
			setNodes(nodes)
		}
			
		const requestOptions = {
			method: "POST",
			headers: { "Content-type": "application/json", "token": context.token },
			body: JSON.stringify({
				name: ownName ? ownName : chosenTech.name, 
				description: nodeDesc, 
				attack: false, 
				participant: participant, 
				parentWeave: Number(weaveId), 
				technique: chosenTech.techniqueID ? chosenTech.techniqueID : -1,
			})
		}

		const response = await fetch("/api/techniquechain/node/create", requestOptions)

		if (response.status !== 201) {
			//Implement some error message/popup
			console.log("fk")
			return null
		} else {
			const jsonResp = await response.json()
			setActivityPopup(false)
			return jsonResp.workoutId
		}
	}

	const handleSelectNode = (id) => {
		const prev = clickedNodes[1]
		console.log(id + " " + prev)
		setClickedNodes([prev, id])
	}

	const handleConnection = () => {
	}
	{/* <div 
							id={node.id} 
							type="button" 
							onClick={() => handleSelectNode(node.id)}
							//className={styles.node}
							className={[styles.node, `${clickedNodes[0] === node.id || clickedNodes[1] === node.is ? "selected" : ""}`]}
							style={node.participant === 1 ? {backgroundColor: "lightblue"}:{backgroundColor: "lightgreen"}}
						>
							{node.name}	
		</div> */}
	return (
		<div className={styles.Flowchart}>
			<div className={styles.canvas}>
				<ReactFlow
					nodes={nodes}
					edges={edges}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					onConnect={onConnect}
					fitView
					attributionPosition="top-right"
					className="overview"
				>

				</ReactFlow>
					
				<div className={styles.buttonRow}>
					{nodes ? nodes.length > 1 : false && 
							<Button onClick={() => handleConnection()}><h2>Koppla</h2></Button>
					}
					<Button onClick={() =>setActivityPopup(true)}>
						<h2>+ Aktivitet</h2>
					</Button>
				</div>
			</div>
			<Popup title="Lägg till teknik" isOpen={activityPopup} setIsOpen={setActivityPopup}>
				<AddTechnique 
					submit={handleSubmit}
					participant={participant}
					chosenTech={chosenTech}
					nodeDesc={nodeDesc}
					ownName={ownName}
					setChosenTech={setChosenTech}
					setParticipant={setParticipant}
					setNodeDesc={setNodeDesc}
					setOwnName={setOwnName}
				/>
				
			</Popup>
		</div>
	)
}

export default Flowchart
