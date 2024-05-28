import InputTextField from "../../../components/Common/InputTextField/InputTextField.jsx"
import React, { useContext, useEffect, useState } from "react"
import styles from "./TechniquechainCreate.module.css"
import { AccountContext } from "../../../context"
import { HTTP_STATUS_CODES } from "../../../utils"
import TextArea from "../../../components/Common/TextArea/TextArea.jsx"
import Divider from "../../../components/Common/Divider/Divider.jsx"
import Dropdown from "../../../components/Common/List/Dropdown"
import { useLocation } from "react-router-dom"
import Button from "../../../components/Common/Button/Button.jsx"
import { useNavigate } from "react-router"
import InfiniteScrollComponent from "../../../components/Common/List/InfiniteScrollComponent"
import TechniquechainNode from "../../../components/Common/TechniquechainCard/TechniquechainNode"

export default function TechniquechainCreate() {

	const { state } = useLocation()
	const [errorMessage, setErrorMessage] = useState("")
	const context = useContext(AccountContext)
	const [groups, setGroups] = useState()
	const [group, setGroup] = useState(state?.session?.group)
	const [nodesToDisplayId, setNodesToDisplayId] = useState([])
	const [nodesToDisplay, setNodesToDisplay] = useState([])
	const [chosenNodes, setChosenNodes] = useState([])
	const [nodeToGetNext, setNodeToGetNext] = useState()
	const [firstNodes, setFirstNodes] = useState(true)
	const [newChainId, setNewChainId] = useState()
	const [haveChosenNodes, setHaveChosenNodes] = useState(false)
	const [haveChosenWeave, setHaveChosenWeave] = useState(false)
	const navigate = useNavigate()

	// true when data has been saved, when unmounting and rebuilding view.
	const [techniquechainCreateInput, setTechniquechainCreateInput] = useState(() => {
		const retTechniquechainCreateInput = JSON.parse(localStorage.getItem("techniqueCreateLocalStorageKey"))
		if (retTechniquechainCreateInput) {
			return retTechniquechainCreateInput
		} else {
			return {
				name: "",
				desc: "",
				addBoxChecked: false,
				eraseBoxChecked: false,
				addedTags: []
			}
		}
	})

	const [name, setName] = useState(() => {
		return techniquechainCreateInput.name
	})
	const [desc, setDesc] = useState(() => {
		return techniquechainCreateInput.desc
	})

	/**
	 * Updates the exerciseCreateInput object when new input is added
	 * @param fieldName The exerciseCreateInput objects attribute to be changed
	 * @param value The new value
	 */
	const storeInputChange = (fieldName, value) => {
		setTechniquechainCreateInput(prevState => ({
			...prevState,
			[fieldName]: value
		}))
	}

	useEffect(() => {
		getAllWeaves()
	}, [])

	const getAllWeaves = async () => {

		const requestOptions = {
			method: "GET",
			headers: { "Content-type": "application/json", "token": context.token }
		}
		const response = await fetch("/api/techniquechain/weave/all", requestOptions)
		if (response.status !== HTTP_STATUS_CODES.OK) {
			//Implement som error message/popup
			return null
		} else {
			const data = await response.json()
			const transformedArray = data.map(item => ({
				id: item.id,
				name: item.name
			}))		
			setGroups(transformedArray)
			//setIsLoading(false)
		}
	}

	useEffect(() => {
		getStartNodes()
	}, [group])

	const getStartNodes = async () => {

		const requestOptions = {
			method: "GET",
			headers: { "Content-type": "application/json", "token": context.token }
		}
		const response = await fetch(`/api/techniquechain/node/weave/${group.id}`, requestOptions)
		if (response.status !== HTTP_STATUS_CODES.OK) {
			//Implement som error message/popup
			return null
		} else {
			const data = await response.json()
			const transformedArray = data.map(item => ({
				id: item.id
			}))		
			setNodesToDisplayId(transformedArray)
		}
	}

	useEffect(() => {
		getNodes()
	}, [nodesToDisplayId])

	const getNodes = async () => {

		let tmpArray = []

		for(let i = 0; i < nodesToDisplayId.length; i++) {
			const requestOptions = {
				method: "GET",
				headers: { "Content-type": "application/json", "token": context.token }
			}
			const response = await fetch(`/api/techniquechain/node/${nodesToDisplayId[i].id}`, requestOptions)
			if (response.status !== HTTP_STATUS_CODES.OK) {
				//Implement som error message/popup
				return null
			} else {
				const data = await response.json()

				if(firstNodes) {
					if(data.attack) {
						tmpArray.push(data)
					}
				}else {
					tmpArray.push(data)
				}
				
			}
		}
		setNodesToDisplay(tmpArray)
	}

	const handleSave = async () => {

		const requestOptions = {
			method: "POST",
			headers: { "Content-type": "application/json", "token": context.token },
			body: JSON.stringify({
				name: name,
				description: desc,
				parentId: group.id
			})
		}
		const response = await fetch("/api/techniquechain/chain/create", requestOptions)
		if (response.status !== HTTP_STATUS_CODES.OK) {
			//Implement som error message/popup
			return null
		} else {		
			const data = await response.json()
			setNewChainId(data.id)
		}
	}

	useEffect(() => {
		handleSaveNodes()
	}, [newChainId])

	const handleSaveNodes = async () => {

		for(let i = 0; i < chosenNodes.length; i++) {
			const requestOptions = {
				method: "POST",
				headers: { "Content-type": "application/json", "token": context.token },
				body: JSON.stringify({
					nodeId: chosenNodes[i].id,
					chainId: newChainId,
					posInChain: i
				})
			}
			const response = await fetch("/api/techniquechain/chainNodes/create", requestOptions)
			if (response.status !== HTTP_STATUS_CODES.OK) {
				//Implement som error message/popup
				return null
			} else {		
				navigate("/techniquechain")	
			}
		}
	}

	useEffect(() => {

		const foundObject = nodesToDisplay.find(obj => obj.id === nodeToGetNext)
		if(chosenNodes.length == 0 && foundObject) {
			setChosenNodes([foundObject])
			setHaveChosenNodes(true)
		}else if(foundObject) {
			setChosenNodes(prevArray => [ ... prevArray, foundObject])
			setHaveChosenNodes(true)
		}
		if(nodeToGetNext) {
			updateNodesToShow()
		}
	}, [nodeToGetNext])

	const updateNodesToShow = async () => {

		const requestOptions = {
			method: "GET",
			headers: { "Content-type": "application/json", "token": context.token }
		}
		const response = await fetch(`/api/techniquechain/node/${nodeToGetNext}`, requestOptions)
		if (response.status !== HTTP_STATUS_CODES.OK) {
			//Implement som error message/popup
			return null
		} else {		
			const data = await response.json()
			const transformedArray = data.outgoingEdges.map(item => ({
				id: item
			}))		
			setFirstNodes(false)
			setNodesToDisplayId(transformedArray)
		}
	}



	return (
		<div>
			<title>Skapa Tekniktråd</title>
			<h1>Skapa Tekniktråd</h1>
			<div style={{ height: "1rem"}}/>

			<InputTextField
				placeholder="Namn"
				text={techniquechainCreateInput.name}
				onChange={(e) => {
					setName(e.target.value)
					storeInputChange("name", e.target.value)
				}}
				required={true}
				type="text"
				id="ExerciseNameInput"
				errorMessage={errorMessage}
			/>
			<TextArea
				className={styles.standArea}
				placeholder="Beskrivning"
				text={techniquechainCreateInput.desc}
				onChange={(e) => {
					setDesc(e.target.value)
					storeInputChange("desc", e.target.value)
				}}
				required={true}
				type="text"
				id = "exercise-description-input"
				errorDisabled={true}
			/>
			<Divider option={"h1_left"} title={"Teknikväv"} />

			<Dropdown id={"techniqueweave-dropdown"} text={group?.name || "Teknikväv"} centered={true}>
				{groups?.length > 0 ? groups.map((plan, index) => (
					<div className={styles.dropdownRow} key={index} onClick={() =>{ 
						setGroup(plan)
						setHaveChosenWeave(true)
					}}>
						<p className={styles.dropdownRowText}>{plan.name}</p>
					</div>
				)) : <div className={styles.dropdownRow}>
					<p className={styles.dropdownRowText}>Kunde inte hitta några Teknikvävar</p>
				</div>}
			</Dropdown>

			{ haveChosenNodes ? 
				<div>
					<Divider option={"h1_left"} title={"Valda Tekniker"} />
					<InfiniteScrollComponent>
						{ chosenNodes.map((technique, index) => {
							return (
								<div key={technique.id} style={{ display: "flex", alignItems: "center", marginBottom: "1px", width: "100%" }}>
									<div style={{ flex: 1 }}>
										<TechniquechainNode
											item={technique.name}
											key={technique.id}
											id={technique.id}
											detailURL={setNodeToGetNext}
											index={index}>
										</TechniquechainNode>
									</div>
								</div>
							)
						})}
					</InfiniteScrollComponent>		
				</div>
				:<></>
			}

			{haveChosenWeave ?
				<div>
					<Divider option={"h1_left"} title={"Nästa Teknik"} />
					<InfiniteScrollComponent>
						{ nodesToDisplay.map((technique, index) => {
							return (
								<div key={technique.id} style={{ display: "flex", alignItems: "center", marginBottom: "1px", width: "100%" }}>
									<div style={{ flex: 1 }}>
										<TechniquechainNode
											item={technique.name}
											key={technique.id}
											id={technique.id}
											detailURL={setNodeToGetNext}
											index={index}>
										</TechniquechainNode>
									</div>
								</div>
							)
						})}
					</InfiniteScrollComponent>
				</div>
				:<></>
			}

			<div style={{display: "flex", flexDirection: "row", width: "100%", justifyContent: "center", gap: 10 }}>
				<div className={styles.wrapCentering} style={{ marginBottom: "2rem", marginTop: "1rem" }} >
					<Button onClick= {() => navigate("/techniquechain")} id = {"sessions-back"}outlined={true}><p>Tillbaka</p></Button>
				</div>
				<div className={styles.wrapCentering} style={{ marginBottom: "2rem", marginTop: "1rem" }} >
					<Button onClick= {() => handleSave()} id = {"sessions-back"}outlined={true}><p>Spara</p></Button>
				</div>
			</div>
		</div>
	)

}