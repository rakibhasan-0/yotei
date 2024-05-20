import React, { useState, useRef } from "react"
import Draggable from "react-draggable"
import styles from"./Flowchart.module.css"
import Button from "../Button/Button"
import Divider from "../Divider/Divider"
import TagInput from "../Tag/TagInput"
import CheckBox from "../CheckBox/CheckBox"
import AddUserComponent from "../../Workout/CreateWorkout/AddUserComponent"
import FlowChartNode from "./FlowchartNode"

/**
 * The technique index page.
 * Fetches and displays the techniques.
 * 
 * @author Durian Team 3
 * @version 1.0
 * @since 2024-05-20
 */

const Flowchart = () => {
	const [nodes, setNodes] = useState([{id: 1, name: "teknik1", x: 10, y: 10},{id: 2, name: "teknik2", x: 20, y: 20},{id: 3, name: "teknik3", x: 30, y: 30}])
	const [connections, setConnections] = useState([])
	const [selectedBox, setSelectedBox] = useState(null)
	const [isAddingConnection, setIsAddingConnection] = useState(false)
	const [isDeletingConnection, setIsDeletingConnection] = useState(false)

	const boxRefs = useRef({})
	const boxCounter = useRef(3) // Counter to generate unique IDs for new boxes

	const handleDrag = (e, data, id) => {
		setNodes((prevBoxes) =>
			prevBoxes.map((box) =>
				box.id === id ? { ...box, x: data.x, y: data.y } : box
			)
		)
	}

	const handleAddBox = () => {
		setNodes((prevBoxes) => [
			...prevBoxes,
			{ id: boxCounter.current++, x: 50, y: 50 }
		])
	}

	const handleSelectBox = (id) => {
		if (!isAddingConnection && !isDeletingConnection) {
			return
		}

		if (selectedBox === null) {
			setSelectedBox(id)
		} else {
			if (selectedBox !== id) {
				if (isAddingConnection) {
					setConnections((prevConnections) => [
						...prevConnections,
						{ from: selectedBox, to: id }
					])
				} else if (isDeletingConnection) {
					setConnections((prevConnections) =>
						prevConnections.filter(
							(conn) => !(conn.from === selectedBox && conn.to === id)
						)
					)
				}
			}
			setSelectedBox(null)
			setIsAddingConnection(false)
			setIsDeletingConnection(false)
		}
	}

	const handleAddConnectionMode = () => {
		setIsAddingConnection(true)
		setSelectedBox(null)
	}

	const handleDeleteConnectionMode = () => {
		setIsDeletingConnection(true)
		setSelectedBox(null)
	}

	const getArrowCoordinates = (box1, box2) => {
		const midX1 = box1.x + 50
		const midY1 = box1.y + 50
		const midX2 = box2.x + 50
		const midY2 = box2.y + 50

		const dx = midX2 - midX1
		const dy = midY2 - midY1

		const absDx = Math.abs(dx)
		const absDy = Math.abs(dy)

		let x1, y1, x2, y2

		if (absDx > absDy) {
			if (dx > 0) {
				x1 = box1.x + 100
				y1 = midY1
				x2 = box2.x
				y2 = midY2
			} else {
				x1 = box1.x
				y1 = midY1
				x2 = box2.x + 100
				y2 = midY2
			}
		} else {
			if (dy > 0) {
				x1 = midX1
				y1 = box1.y + 100
				x2 = midX2
				y2 = box2.y
			} else {
				x1 = midX1
				y1 = box1.y
				x2 = midX2
				y2 = box2.y + 100
			}
		}

		return { x1, y1, x2, y2 }
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
						<div>
							<FlowChartNode
								id={node.id}
								name={node.name}
								onClick={handleSelectBox(node.id)}
								selected={selectedBox === node.id}
								ref={(el) => (boxRefs.current[node.id] = el)}
							/>
						</div>
					</Draggable>
				))}
				{/* 				<svg className={styles.arrow}>
					<defs>
						<marker
							id="arrowhead"
							markerWidth="10"
							markerHeight="7"
							refX="10"
							refY="3.5"
							orient="auto"
						>
							<polygon points="0 0, 10 3.5, 0 7" />
						</marker>
					</defs>
					{connections.map((connection, index) => {
						const fromBox = nodes.find((node) => node.id === connection.from)
						const toBox = nodes.find((node) => node.id === connection.to)
						const { x1, y1, x2, y2 } = getArrowCoordinates(fromBox, toBox)
						return (
							<line
								key={index}
								x1={x1}
								y1={y1}
								x2={x2}
								y2={y2}
								stroke="black"
								markerEnd="url(#arrowhead)"
							/>
						)
					})}
				</svg> */}
				<div className={styles.buttonRow}>
					{nodes.length > 1 && 
            <Button>Koppla</Button>
					}
					<Button>+</Button>
					
				</div>
			</div>
			<Divider option={"h1_center"}></Divider>
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
				addedUsers={[{userId: 1, username: "eyo"}]}
				setAddedUsers={() =>
					console.log("yeye")
				}
			/>
			<Divider option={"h1_left"} title={"Taggar"} />

			<TagInput addedTags={[{id: 1, name: "eyo"}]}/>

		</div>
	)
}

export default Flowchart
