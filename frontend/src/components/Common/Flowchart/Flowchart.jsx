import React, { useState, useRef, } from "react"
import Draggable from "react-draggable"
import styles from"./Flowchart.module.css"
import Button from "../Button/Button"
import FlowChartNode from "./FlowchartNode"
import Popup from "../Popup/Popup"
import AddTechnique from "../../Workout/CreateWorkout/AddTechnique"

/**
 * The technique index page.
 * Fetches and displays the techniques.
 * 
 * TODOS: Mappa ids för att göra kopplingar, Radera noder, spara väven, 
 * måste inte ange en teknik, visa beskrivning, resizea flowchartruten
 * 
 * @author Durian Team 3
 * @version 1.0
 * @since 2024-05-20
 */

const Flowchart = () => {
	const [nodes, setNodes] = useState([{id: 1, name: "en väääääldigt lång teknik1", x: 0, y: 110, participant: 1},{id: 2, name: "teknik2", x: 20, y: 20, participant: 2},{id: 3, name: "teknik3", x: 30, y: 30, participant: 1}])
	
	const [connections, setConnections] = useState([])
	const [activityPopup, setActivityPopup] = useState(false)
	const [selectedBox, setSelectedBox] = useState(null)
	const [isAddingConnection, setIsAddingConnection] = useState(false)
	const [isDeletingConnection, setIsDeletingConnection] = useState(false)
	const [clickedNodes, setClickedNodes] = useState([])


	const [ownName, setOwnName] = useState("")
	const [nodeDesc, setNodeDesc] = useState("")
	const [chosenTech, setChosenTech] = useState(null)
	const [participant, setParticipant] = useState(1)


	const handleDrag = (e, data, id) => {
		setNodes((prevBoxes) =>
			prevBoxes.map((node) =>
				node.id === id ? { ...node, x: data.x, y: data.y } : node
			)
		)
	}

	function handleSubmit(){
		setActivityPopup(false)
		handleAddNode(chosenTech, ownName, nodeDesc, participant)
		setOwnName("")
		setChosenTech(null)
		setNodeDesc("")
		setParticipant(1)
	}

	function handleAddNode(chosenTech, ownName, nodeDesc, participant) {
		setActivityPopup(false)
		setNodes((prevBoxes) => [
			...prevBoxes,
			{ id: nodes.length+1, x: 50, y: 50, name: ownName ? ownName : chosenTech.name, participant: participant }
		])
	}

	const handleSelectNode = (id) => {
		console.log(id + "hej")
		setClickedNodes(prev => {
			console.log(prev)
			const newClickedButtons = [id, ...prev]
			return newClickedButtons.slice(0, 2)
		})
	}
	const handleConnection = () => {
		console.log(clickedNodes)
	}

	return (
		<div className={styles.Flowchart}>
			<div className={styles.canvas}>
				{nodes.map((node) => (
					<Draggable
						key={node.id}
						defaultPosition={{ x: node.x, y: node.y }}
						onDrag={(e, data) => handleDrag(e, data, node.id)}
						bounds={"parent"}
					>
						<div 
							id={node.id} 
							type="button" 
							onClick={(node)=>handleSelectNode(node.id)}
							//className={styles.node}
							className={[styles.node, `${clickedNodes[0] === node.id || clickedNodes[1] === node.is ? "selected" : ""}`]}
							style={node.participant === 1 ? {backgroundColor: "lightblue"}:{backgroundColor: "lightgreen"}}
						>
							{node.name}
						</div>
					</Draggable>
				))}
				<div className={styles.buttonRow}>
					{nodes.length > 1 && 
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
