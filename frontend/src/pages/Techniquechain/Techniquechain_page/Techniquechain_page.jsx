import React, { useContext, useEffect, useState } from "react"
import { Trash, Pencil, Clock, Plus } from "react-bootstrap-icons"
import { useLocation, useNavigate, useParams } from "react-router"
import { isEditor } from "../../../utils"
import { AccountContext } from "../../../context"
import PrintButton from "../../../components/Common/PrintButton/PrintButton"
import styles from "./Techniquechain_page.module.css"

export default function Techniquechain_page() {

	const navigate = useNavigate()
	const techniqueId = localStorage.getItem("stored_techniquechain")
	const [techniquechain, settechniquechain] = useState({id: techniqueId, name: "test övning 1", description: "hejsan mycket rolig kedja"})
	const accountRole = useContext(AccountContext)
	const [showDeletePopup, setShowDeletePopup] = useState(false)

	return (
		<div style={{ display: "flex", flexDirection: "column" }}>
			<title>Teknikkedja</title>
			<h1 style={{textAlign: "left", wordWrap:"break-word"}}>{techniquechain?.name}</h1>
			<div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
				{/* empty div to get the right look with old components */}
				<div ></div> 
				{isEditor(accountRole) && (
					<div style={{ display: "flex", flexDirection: "row", gap: "10px", justifyContent: "flex-end"}}>
                        
						{/* TODOO: add a printer button and functionallity to print a chain and its graph */}
						<Pencil
							onClick={() => {
								window.localStorage.setItem("popupState", true)
								navigate("/excercise/edit/" + techniqueId)
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
		</div>
	)

}