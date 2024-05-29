import React, { useState, useContext, useCallback } from "react"
import styles from"./Flowchart.module.css"
// Some default styling for nodes and flowchart window
import "reactflow/dist/style.css"
// Styling for the nodes, could not be done in a css module
import "./style.css"
import Button from "../Button/Button"
import Popup from "../Popup/Popup"
import AddTechnique from "../../Workout/CreateWorkout/AddTechnique"
import { AccountContext } from "../../../context"
import ReactFlow, { addEdge, applyEdgeChanges, MarkerType,} from "reactflow"
//Custom components for the flowchart
import CustomNode from "./CustomNode"
import FloatingEdge from "./FloatingEdge"
import CustomConnectionLine from "./CustomConnectionLine"

/**
 * Displays a thechinque weave as a Flowchart. Is also used to create a weave.
 * 
 * !NOTE! 
 * This component is far from done and is not optimally implemented, 
 * it is left in this state due to time constraints and unclear specifications.
 * The decision on starting the implementation was made so that the users can test
 * something that maybe resembles what they are looking for.
 * I suggest you continue working with react flow to create and visualize the flowchart! /id20eht
 * Great docs can be found here https://reactflow.dev/examples.
 *
 * 
 * TODOS: Delete nodes, click on nodes to show descriptions and techniques, 
 * handle tags, handle permissions, improve styling for mobile use (drag and drop 
 * functionality is not great, also visuals and clickable areas should be updated)
 * , error handling, navigate to correct tab when saving/exiting
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
//If no style attribute is found on the edge this will be used
const defaultEdgeOptions = {
	style: { strokeWidth: 3, stroke: "black", strokeDasharray: 5 },
	type: "floating",
	markerEnd: {
		type: MarkerType.ArrowClosed,
		color: "black",
	},
}
/**
 * 
 * @param {String} weaveId: A weave Id, used to add new nodes into a weave
 * @param {Array} nodes: An array of node objects (is an empty array if the weave is empty)
 * @param {Array} edges: An array of edge objects (is an empty array if the weave has no edges)
 * @param {Function} setNodes: set state funtion to add new nodes to nodes array
 * @param {Function} setEdges: set state funtion to add new edges to edge array
 * @param {Function} onNodesChange: function to update nodes (aquired from useNodesState)
 * @param {Boolean} editable: (optional) is set to false when nodes and edges should not be able to change
 * 
 * @returns A flowchart component
 */
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

	//Function that handles the submit of addActivity popup
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
			type: "custom", //maps to nodeTypes
			data: {id: id + "", ownName: ownName, name: chosenTech? chosenTech.name : "", participant: participant, attack: attack}, //All data needed in the node
			position: { x: 50, y: 50}, // Default position (should maybe be set dynamically to hinder nodes from covering each other)
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
