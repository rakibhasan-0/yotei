import React, { useContext, useEffect, useState } from "react"
import { Trash, Pencil } from "react-bootstrap-icons"
import { useNavigate } from "react-router"
import { useNodesState } from "reactflow"
import { hasBetaAccess, isAdminUser, HTTP_STATUS_CODES } from "../../../utils.js"
import { AccountContext } from "../../../context"
import styles from "./Techniquechain_page.module.css"
import Spinner from "../../../components/Common/Spinner/Spinner"
import InfiniteScrollComponent from "../../../components/Common/List/InfiniteScrollComponent"
import TechniquechainCard from "../../../components/Common/TechniquechainCard/TechniquechainCard"
import Button from "../../../components/Common/Button/Button.jsx"
import Flowchart from "../../../components/Common/Flowchart/Flowchart.jsx"
import Divider from "../../../components/Common/Divider/Divider.jsx"

/**
 * The Technique Chain page, displays the thechnique chain and the path in its parent weave.
 * 
 * @author Team Durian
 * @version 1.0
 * @since 2024-05-29
 */
export default function Techniquechain_page() {

	//TODOO: add a printer button and functionallity to print a chain and its graph
	//TODOO: add functionality to edit and delete a chain.
	//TODOO: add functionality, when you press a technique/node in the chain info like technique, description comes up.
	//TODOO: show in the react Flow where the start node is.
	
	const navigate = useNavigate()
	const techniqueId = localStorage.getItem("stored_techniquechain")

	//this is the currently chosen technique, onely get the id when mounting so need to get all the other info from db
	const [techniquechain, settechniquechain] = useState()
	const [weaveName, setWeaveName] = useState()

	const context = useContext(AccountContext)
	// eslint-disable-next-line no-unused-vars
	const [showDeletePopup, setShowDeletePopup] = useState(false)
	const [nodes, setNodes, onNodesChanged ] = useNodesState([])
	const [edges, setEdges] = useState([])


	//this is a list of all the techniques to be displayed in the list. read all the real techniqus from the db insted of hard coded
	const [chainTechniques, setChaintechniques] = useState([])
	const [loading, setIsLoading] = useState(true)
	const detailURL = "/techniquechain/techniquechain_page/"

	useEffect(() => {
		getData()
	}, [])

	const getData = async () => {
		const weaveId = await getChainInfo()
		const nodesIdToGet = await getChainNodesInfo()
		const nodeArr = await getWeaveInfo(weaveId)
		await getChainNodes(nodesIdToGet)
		const weaveData= await getNodes(weaveId, nodeArr)
		const tempEdges = await getEdges(weaveData)
		findMarkedEdges(tempEdges, nodesIdToGet)
	}

	const getChainInfo = async () => {

		const requestOptions = {
			method: "GET",
			headers: { "Content-type": "application/json", "token": context.token }
		}
		const response = await fetch(`/api/techniquechain/chain/${techniqueId}`, requestOptions)
		if (response.status !== HTTP_STATUS_CODES.OK) {
			//Implement som error message/popup
			return null
		} else {
			const data = await response.json()
			settechniquechain({id: data.id, name: data.name, description: data.description})
			setWeaveName(data.parent_weave_id.name)
			return data.parent_weave_id.id
		}
	}

	const getChainNodes = async (nodesIdToGet) => {

		let tmpArray = []
		const requestOptions = {
			method: "GET",
			headers: { "Content-type": "application/json", "token": context.token }
		}

		for(let i = 0; i < nodesIdToGet.length; i++) {

			const response = await fetch(`/api/techniquechain/node/${nodesIdToGet[i].id}`, requestOptions)
			if (response.status !== HTTP_STATUS_CODES.OK) {
				//Implement som error message/popup
				return null
			} else {
				const data = await response.json()
				tmpArray.push({id: data.id, name: data.name, posInChain: nodesIdToGet[i].posInChain})
			}
		}
		tmpArray.sort((a, b) => a.posInChain - b.posInChain)
		setChaintechniques(tmpArray)
		return tmpArray
	}

	const getChainNodesInfo = async () => {

		const requestOptions = {
			method: "GET",
			headers: { "Content-type": "application/json", "token": context.token }
		}
		const response = await fetch(`/api/techniquechain/chainNodes/${techniqueId}`, requestOptions)
		if (response.status !== HTTP_STATUS_CODES.OK) {
			//Implement som error message/popup
			return null
		} else {
			const data = await response.json()
			const transformedArray = data.map(item => ({
				id: item.nodeId,
				posInChain: item.posInChain
			}))
			return transformedArray
		}
	}

	const getNodes = async (weaveId, nodeArr) => {
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
			return data
		}
	}

	const getEdges = async (weaveData) => {
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

		return tempEdges
	}

	const getWeaveInfo = async (weaveId) => {
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
			return data.NodeInfo
		}
	}

	const findMarkedEdges = (edges, techniqueNodes) => {
		const nodeIds = new Set(techniqueNodes.map(node => node.id.toString()))
		const filteredEdges = edges.filter(edge => 
			nodeIds.has(edge.source) && nodeIds.has(edge.target)
		)
		const filteredEdgesInChain = removeEdgesNotInChain(techniqueNodes, filteredEdges)
		setEdges(edges.map(edge => ({...edge, style:applyEdgeStyle(edge, filteredEdgesInChain)})))
		setIsLoading(false)
	}

	const removeEdgesNotInChain = (nodes , edges) => {

		const chainDict = {}
		nodes.forEach(node => {
			chainDict[node.id] = node.posInChain
		})

		// Filter edges based on consecutive positions in the chain
		const filteredEdges = edges.filter(edge => {
			const sourcePos = chainDict[parseInt(edge.source, 10)]
			const targetPos = chainDict[parseInt(edge.target, 10)]
			return sourcePos !== undefined && targetPos !== undefined && targetPos === sourcePos + 1
		})

		return filteredEdges
	}

	const applyEdgeStyle = (edge, filteredEdges) => {
		const isSpecial = filteredEdges.some(({id}) => id === edge.id)
		if (isSpecial) {
			return { strokeWidth: 3, stroke: "black", strokeDasharray: 0 }
		}
		return { strokeWidth: 3, stroke: "black", strokeDasharray: 5 }
	}

	if(!isAdminUser(context) && !hasBetaAccess(context)){
		window.location.replace("/404")
		return null
	}
	
	return (
		<div style={{ display: "flex", flexDirection: "column" }}>
			<title>Tekniktrådar</title>
			<h1 style={{textAlign: "left", wordWrap:"break-word"}}>{techniquechain?.name}</h1>
			<div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
				{/* empty div to get the right look with old components */}
				<div ></div> 
				{isAdminUser(context) && (
					<div style={{ display: "flex", flexDirection: "row", gap: "10px", justifyContent: "flex-end"}}>
                        
						<Pencil
							onClick={() => {
								window.localStorage.setItem("popupState", true)
								//navigate("/excercise/edit/" + techniqueId)
							}
							}
							size="24px"
							style={{ color: "var(--red-primary)" }}
						/>
						<Trash
							onClick={() => setShowDeletePopup(true)}
							size="24px"
							style={{ color: "var(--red-primary)" }}
						/>
					</div>
				)}
			</div>
			<h2 style={{ fontWeight: "bold", display: "flex", flexDirection: "row", alignItems: "left", marginTop: "5px", alignContent: "left" }}>Beskrivning</h2>
			<p style={{ textAlign: "left", whiteSpace: techniquechain?.description ? "pre-line" : "normal", fontStyle: !techniquechain?.description ? "italic" : "normal", color: !techniquechain?.description ? "var(--gray)" : "inherit" }}>
				{techniquechain?.description || "Beskrivning saknas."}
			</p>
			<Divider option={"h1_left"} title={"Tekniker i Tråden"} />
			{ loading === false?
				<div>
					<InfiniteScrollComponent>
						{ chainTechniques.map((technique, index) => {
							return (
								<div key={technique.id} style={{ display: "flex", alignItems: "center", marginBottom: "1px", width: "100%" }}>
									<span style={{ marginRight: "10px", fontSize: "25px", marginTop: "10px" }}>{index + 1}</span>
									<div style={{ flex: 1 }}>
										<TechniquechainCard
											item={technique.name}
											key={technique.id}
											id={technique.id}
											detailURL={detailURL}
											index={index}>
										</TechniquechainCard>
									</div>
								</div>	
							)
						})}
					</InfiniteScrollComponent>
				</div>
				: <Spinner/> 
			}
			<br></br>
			<Divider option={"h1_left"} title={"Tekniktråd baserad på teknikväv: \"" + weaveName + "\""} />
			{loading === false ?
				<Flowchart
					edges={edges}
					nodes={nodes}
					setEdges={setEdges}
					setNodes={setNodes}
					onNodesChange={onNodesChanged}
					editable={false}
				/>
				:<Spinner/>
			}
			<div className={styles.wrapCentering} style={{ marginBottom: "2rem", marginTop: "1rem" }} >
				<Button onClick= {() => navigate("/techniquechain")} id = {"sessions-back"} outlined={true}><p>Tillbaka</p></Button>
			</div>	
		</div>
	)

}