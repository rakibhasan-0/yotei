import React, { useState, useContext, useCallback } from "react"
import styles from"./Flowchart.module.css"
// Som default styling for nodes and flowchart window
import "reactflow/dist/style.css"
// Styling for the nodes, could not be done in a css module
import "./style.css"
import Button from "../Button/Button"
import Popup from "../Popup/Popup"
import AddTechnique from "../../Workout/CreateWorkout/AddTechnique"
import { AccountContext } from "../../../context"
import ReactFlow, { addEdge, applyEdgeChanges, MarkerType,} from "reactflow"

import CustomNode from "./CustomNode"
import FloatingEdge from "./FloatingEdge"
import CustomConnectionLine from "./CustomConnectionLine"

// CREATE CUSTOM EDGES? SKAPA REPRESENTATIONEN VID KJEDJOR DÄR KANTER/STARTNOD ÄR MARKERADE!

/**
 * Displays a thechinque weave as a Flowchart.
 * 
 * !NOTE! 
 * This component is far from done and is not optimally implemented, 
 * it is left in this state due to time constraints and unclear specifications.
 * The decision on starting the implementation was made so that the users can test
 * something that maybe resembles what they are looking for. A complete remodel
 * might be a good idea however I suggest you continue working with react flow to
 * create and visualize the flowchart! /id20eht
 * Great docs can be found here https://reactflow.dev/examples.
 * !NOTE!
 * 
 * TODOS: Delete nodes, click on nodes to show descriptions and techniques, 
 * handle tags, handle permissions, improve styling for mobile use, error handling
 * navigate to correct tab when saving/exiting
 * 
 * @author Durian Team 3
 * @version 1.0
 * @since 2024-05-20
 */

//Register styles and custom components for the flowchart
const connectionLineStyle = {
	strokeWidth: 3,
	stroke: "blue",
}

const nodeTypes = {
	custom: CustomNode,
}

const edgeTypes = {
	floating: FloatingEdge,
}

const defaultEdgeOptions = {
	style: { strokeWidth: 3, stroke: "black", strokeDasharray: 5 },
	type: "floating",
	markerEnd: {
		type: MarkerType.ArrowClosed,
		color: "black",
	},
}

const Flowchart = ({weaveId, nodes, edges, setEdges, setNodes, onNodesChange, editable}) => {
	const context = useContext(AccountContext)
	//States and functions to handle the nodes and their edges
	const onConnect = useCallback((params) => {
		if(params.source === params.target) return
		setEdges((eds) => addEdge(params, eds))}, [setEdges])

	const onEdgesChange = useCallback(
		(changes) => {setEdges((eds) => {
			console.log(eds); applyEdgeChanges(changes, eds)
		})},
		[],
	)
	const [activityPopup, setActivityPopup] = useState(false)
	//States to track in the choose activity popup
	const [ownName, setOwnName] = useState("")
	const [nodeDesc, setNodeDesc] = useState("")
	const [chosenTech, setChosenTech] = useState(null)
	const [participant, setParticipant] = useState(1)
	const [attack, setAttack] = useState(false)

	function handleSubmit(){
		setActivityPopup(false)
		handleAddNode(chosenTech, ownName, nodeDesc, participant)
		setOwnName("")
		setChosenTech(null)
		setNodeDesc("")
		setAttack(false)
		setParticipant(1)
	}

	async function handleAddNode() {

		const requestOptions = {
			method: "POST",
			headers: { "Content-type": "application/json", "token": context.token },
			body: JSON.stringify({
				name: ownName ? ownName : chosenTech.name, 
				description: nodeDesc, 
				attack: attack, 
				participant: participant, 
				parentWeave: Number(weaveId), 
				technique: chosenTech ? chosenTech.techniqueID : -1,
			})
		}

		const response = await fetch("/api/techniquechain/node/create", requestOptions)
		const jsonResp = await response.json()
		const id = jsonResp.id
		const node = [{ 
			id: id + "", //must be a string
			type: "custom",
			data: {id: id + "", ownName: ownName, name: chosenTech? chosenTech.name : "", participant: participant, attack: attack},
			position: { x: 50, y: 50}, 
		}]
		if(nodes) {
			const nds = nodes.concat(node)
			setNodes(nds)
		} else {
			setNodes(nodes)
		}	

		if (response.status !== 200) {
			//Implement some error message/popup
			return null
		} else {
			setActivityPopup(false)
			return id
		}
	}

	return (
		<div className={styles.Flowchart}>
			<div className={styles.canvas}>
				<ReactFlow
					nodes={nodes}
					edges={edges}
					onNodesChange={editable? onNodesChange : () => null}
					onEdgesChange={editable? onEdgesChange : () => null}
					onConnect={editable? onConnect : ()=> null}
					fitView
					attributionPosition="top-right"
					nodeTypes={nodeTypes}
					edgeTypes={edgeTypes}
					defaultEdgeOptions={defaultEdgeOptions}
					connectionLineComponent={CustomConnectionLine}
					connectionLineStyle={connectionLineStyle}
				>
				</ReactFlow>
					
				{editable && <div className={styles.buttonRow}>
					<Button onClick={() =>setActivityPopup(true)}>
						<h2>+ Aktivitet</h2>
					</Button>
				</div>}
			</div>
			<Popup title="Lägg till teknik" isOpen={activityPopup} setIsOpen={setActivityPopup}>
				<AddTechnique 
					submit={handleSubmit}
					participant={participant}
					chosenTech={chosenTech}
					nodeDesc={nodeDesc}
					ownName={ownName}
					attack={attack}
					setChosenTech={setChosenTech}
					setParticipant={setParticipant}
					setNodeDesc={setNodeDesc}
					setOwnName={setOwnName}
					setAttack={setAttack}
				/>
				
			</Popup>
		</div>
	)
}

export default Flowchart
