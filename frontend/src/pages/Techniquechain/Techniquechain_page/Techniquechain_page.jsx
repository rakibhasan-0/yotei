import React, { useContext, useEffect, useState } from "react"
import { Trash, Pencil, Clock, Plus } from "react-bootstrap-icons"
import { useLocation, useNavigate, useParams } from "react-router"
import { isEditor } from "../../../utils"
import { AccountContext } from "../../../context"
import PrintButton from "../../../components/Common/PrintButton/PrintButton"
import styles from "./Techniquechain_page.module.css"
import Spinner from "../../../components/Common/Spinner/Spinner"
import InfiniteScrollComponent from "../../../components/Common/List/InfiniteScrollComponent"
import TechniquechainCard from "../../../components/Common/TechniquechainCard/TechniquechainCard"
import Button from "../../../components/Common/Button/Button.jsx"

export default function Techniquechain_page() {

	const navigate = useNavigate()
	const techniqueId = localStorage.getItem("stored_techniquechain")

	//this is the currently chosen technique, onely get the id when mounting so need to get all the other info from db
	const [techniquechain, settechniquechain] = useState({id: techniqueId, name: "test övning 1", description: "hejsan mycket rolig kedja"})
	const accountRole = useContext(AccountContext)
	const [showDeletePopup, setShowDeletePopup] = useState(false)

	//this is a list of all the techniques to be displayed in the list. read all the real techniqus from the db insted of hard coded
	const [chainTechniques, setChaintechniques] = useState([{id: techniqueId, name: "test övning 1", description: "hejsan mycket rolig kedja"}, {id: techniqueId, name: "test övning 2", description: "hejsan mycket rolig kedja"}])
	const [loading, setIsLoading] = useState(false)
	const detailURL = "/techniquechain/techniquechain_page/"

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
			{ loading ? <Spinner/> :
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
			}
			{/* TODOO add the graph component to show the parent graph that the chain is created from, the chain needs to be marked somehow in the graph */}
            
			<div className={styles.wrapCentering} style={{ marginBottom: "2rem", marginTop: "1rem" }} >
				<Button onClick= {() => navigate("/techniquechain")} id = {"sessions-back"}outlined={true}><p>Tillbaka</p></Button>
			</div>	
		</div>
	)

}