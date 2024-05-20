import React, { useState, useRef } from "react"
import Draggable from "react-draggable"
import "./App.css"
const Flowchart = () => {
	const [boxes, setBoxes] = useState([
		{ id: 1, x: 100, y: 100 },
		{ id: 2, x: 300, y: 100 }
	])
	const [connections, setConnections] = useState([])
	const [selectedBox, setSelectedBox] = useState(null)
	const [isAddingConnection, setIsAddingConnection] = useState(false)
	const [isDeletingConnection, setIsDeletingConnection] = useState(false)

	const boxRefs = useRef({})
	const boxCounter = useRef(3) // Counter to generate unique IDs for new boxes

	const handleDrag = (e, data, id) => {
		setBoxes((prevBoxes) =>
			prevBoxes.map((box) =>
				box.id === id ? { ...box, x: data.x, y: data.y } : box
			)
		)
	}

	const handleAddBox = () => {
		setBoxes((prevBoxes) => [
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
		<div className="Flowchart">
			<div className="canvas">
				{boxes.map((box) => (
					<Draggable
						key={box.id}
						defaultPosition={{ x: box.x, y: box.y }}
						onDrag={(e, data) => handleDrag(e, data, box.id)}
					>
						<div
							className={`box ${selectedBox === box.id ? "selected" : ""}`}
							ref={(el) => (boxRefs.current[box.id] = el)}
							onClick={() => handleSelectBox(box.id)}
						>
              Box {box.id}
						</div>
					</Draggable>
				))}
				<svg className="arrows">
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
						const fromBox = boxes.find((box) => box.id === connection.from)
						const toBox = boxes.find((box) => box.id === connection.to)
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
				</svg>
				<button className="add-box-button" onClick={handleAddBox}>
          Add Box
				</button>
				<button className="add-connection-button" onClick={handleAddConnectionMode}>
          Add Connection
				</button>
				<button className="delete-connection-button" onClick={handleDeleteConnectionMode}>
          Delete Connection
				</button>
			</div>
		</div>
	)
}

export default Flowchart
