import React, { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { isAdminUser, HTTP_STATUS_CODES } from "../../../../utils.js"
import { AccountContext } from "../../../../context"
import Spinner from "../../../../components/Common/Spinner/Spinner"
import Button from "../../../../components/Common/Button/Button.jsx"
import Flowchart from "../../../../components/Common/Flowchart/Flowchart.jsx"
import { useNodesState, useEdgesState } from "reactflow"

export default function TechniqueWeave_page() {

	const navigate = useNavigate()
	const weaveId = localStorage.getItem("stored_techniqueweave")

	//this is the currently chosen technique, onely get the id when mounting so need to get all the other info from db
	// eslint-disable-next-line no-unused-vars
	const [techniqueWeave, settechniqueWeave] = useState()
	const [nodes, setNodes, onNodesChanged ] = useNodesState([])
	const [edges, setEdges] = useState([])
	const [nodeArr, setNodeArr] = useState([])
	const [weaveData, setWeaveData] = useState([])

	const context = useContext(AccountContext)

	//this is a list of all the techniques to be displayed in the list. read all the real techniqus from the db insted of hard coded
	const [loading, setIsLoading] = useState(true)

	useEffect(() => {
		const getChainInfo = async () => {
			const requestOptions = {
				method: "GET",
				headers: { "Content-type": "application/json", "token": context.token }
			}
			const response = await fetch(`/api/techniquechain/weave/${weaveId}`, requestOptions)
			if (response.status !== HTTP_STATUS_CODES.OK) {
				//Implement som error message/popup
				return null
			} else {
				const data = await response.json()
				settechniqueWeave(data)
				setNodeArr(data.NodeInfo)
			}
		}
		getChainInfo()
	}, [])

	useEffect(()=> {
		if(nodeArr) {
			getNodes(nodeArr)
		}
	}, [nodeArr])

	useEffect(()=> {
		getEdges()
	},[weaveData])




	const getNodes = async () => {
		const requestOptionsNodes = {
			method: "GET",
			headers: { "Content-type": "application/json", "token": context.token }
		}
	
		const nodesResponse = await fetch(`/api/techniquechain/node/weave/${weaveId}`, requestOptionsNodes)
		if (nodesResponse.status !== HTTP_STATUS_CODES.OK) {
			//Implement som error message/popup
			return null
		} else {
			const data = await nodesResponse.json()
			const tempNodes = []
			for(let i = 0; i < data.length; i++) {
				const nodeReps = data.map(node => {
					const match = nodeArr.find(nodeRep => nodeRep.node_id === node.id)
					return match ? match : null
				})
				const node = { 
					id: data[i].id + "", //must be a string
					type: "custom",
					data: {id: data[i].id + "", ownName: data[i].name, participant: data[i].participant, attack: data[i].attack},
					position: {x: nodeReps[i].node_x_pos , y: nodeReps[i].node_y_pos}, 
				}
				tempNodes.push(node)
			}
			setNodes(tempNodes)
			setWeaveData(data)
		}
	}

	const getEdges = async () => {
		const tempEdges = []
		weaveData.map(node => node.outgoingEdges.map((target) => {
			const edge = { 
				id: tempEdges.length + "", 
				source: node.id + "", 
				target: target + "",
				type: "floating",
			}
			tempEdges.push(edge)
		}))
		setEdges(tempEdges)
		setIsLoading(false)
	}
		

	const handleGoback = () => {
		sessionStorage.setItem("active-tab", "weave")
		navigate("/techniquechain")
	}

	return (
		<div style={{ display: "flex", flexDirection: "column" }}>
			<title>Teknikväv</title>
			<h1 style={{textAlign: "left", wordWrap:"break-word"}}>{techniqueWeave?.name}</h1>
			<div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
				{/* empty div to get the right look with old components */}
				<div ></div> 
				{isAdminUser(context) && (
					<div style={{ display: "flex", flexDirection: "row", gap: "10px", justifyContent: "flex-end"}}>          
						{/* TODOO: add a printer, edit and delete button and functionallity to print a graph graph */}
					</div>
				)}
			</div>
			<h2 style={{ fontWeight: "bold", display: "flex", flexDirection: "row", alignItems: "left", marginTop: "5px", alignContent: "left" }}>Beskrivning</h2>
			<p style={{ textAlign: "left", whiteSpace: techniqueWeave?.description ? "pre-line" : "normal", fontStyle: !techniqueWeave?.description ? "italic" : "normal", color: !techniqueWeave?.description ? "var(--gray)" : "inherit" }}>
				{techniqueWeave?.description || "Beskrivning saknas."}
			</p>
			{ loading && nodes.length !== 0 && edges.length !== 0 ? <Spinner/> :
				<Flowchart 
					weaveId={weaveId} 
					nodes={nodes} 
					edges={edges} 
					editable={false} 
					setEdges={setEdges} 
					setNodes={setNodes}
					onNodesChange={onNodesChanged}
				/>
			}
            
			<div style={{ marginBottom: "2rem", marginTop: "1rem" }} >
				<Button onClick= {() => handleGoback()} id = {"sessions-back"}outlined={true}><p>Tillbaka</p></Button>
			</div>	
		</div>
	)

}