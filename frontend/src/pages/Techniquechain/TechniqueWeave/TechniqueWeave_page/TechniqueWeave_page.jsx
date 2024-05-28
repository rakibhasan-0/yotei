import React, { useContext, useEffect, useState } from "react"
import { Trash, Pencil } from "react-bootstrap-icons"
import { useNavigate } from "react-router"
import { isAdminUser, HTTP_STATUS_CODES } from "../../../../utils.js"
import { AccountContext } from "../../../../context"
import Spinner from "../../../../components/Common/Spinner/Spinner"
import InfiniteScrollComponent from "../../../../components/Common/List/InfiniteScrollComponent"
import TechniquechainCard from "../../../../components/Common/TechniquechainCard/TechniquechainCard"
import Button from "../../../../components/Common/Button/Button.jsx"

export default function TechniqueWeave_page() {

	const navigate = useNavigate()
	const weaveId = localStorage.getItem("stored_techniqueweave")

	//this is the currently chosen technique, onely get the id when mounting so need to get all the other info from db
	const [techniquechain, settechniquechain] = useState()
	const context = useContext(AccountContext)
	const [showDeletePopup, setShowDeletePopup] = useState(false)

	//this is a list of all the techniques to be displayed in the list. read all the real techniqus from the db insted of hard coded
	const [loading, setIsLoading] = useState(false)

	useEffect(() => {
		getChainInfo()
	}, [])

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
			console.log(data)
			setIsLoading(false)
		}
	}

	return (
		<div style={{ display: "flex", flexDirection: "column" }}>
			<title>Teknikväv</title>
			<h1 style={{textAlign: "left", wordWrap:"break-word"}}>{techniquechain?.name}</h1>
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
			<p style={{ textAlign: "left", whiteSpace: techniquechain?.description ? "pre-line" : "normal", fontStyle: !techniquechain?.description ? "italic" : "normal", color: !techniquechain?.description ? "var(--gray)" : "inherit" }}>
				{techniquechain?.description || "Beskrivning saknas."}
			</p>
			{ loading ? <Spinner/> :<></>
			}
            
			<div style={{ marginBottom: "2rem", marginTop: "1rem" }} >
				<Button onClick= {() => navigate("/techniquechain")} id = {"sessions-back"}outlined={true}><p>Tillbaka</p></Button>
			</div>	
		</div>
	)

}