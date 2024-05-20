import React, { useEffect, useState } from "react"
import Popup from "../../components/Common/Popup/Popup"
import style from "./GradingStatisticsPopup.module.css"
import Dropdown from "../../components/Common/List/Dropdown" // Updated import
import GradingProtocolsRowsMenu from "../../components/Grading/GradingProtocolsRowsMenu"
import GradingProtocolsRows from "../../components/Grading/GradingProtocolsRows"
import Spinner from "../../components/Common/Spinner/Spinner"


export default function GradingStatisticsPopup({ id, groupID, belts}) {
	// State for showing the popup
	const [showPopup, setShowPopup] = useState(false)
	const [protocols, setProtocols] = useState([])
	const [chosenProtocol, setChosenProtocol] = useState([])
	const [loading, setLoading] = useState(false)
	const [data, setData] = useState([])
	//const [belts, setBelts] = useState([])
	console.log("Group is " + groupID)
	console.log(belts)

	useEffect(() => {
		if (belts.length > 0 && groupID) {
			async function fetchGroupGradingProtocol() {
				try {
					setLoading(true)
					const responseFromGroupNameAPI = await fetch(`/api/statistics/${groupID}/grading_protocol?beltId=${belts[0].id}`)
					if (!responseFromGroupNameAPI.ok) {
						throw new Error("Failed to fetch group data")
					}
					if(responseFromGroupNameAPI.status === 204) {
						setData([])
						setProtocols([])
						setChosenProtocol([])
						setLoading(false)
						return
					}
					const groups = await responseFromGroupNameAPI.json()
					console.log(groups)
					setData(groups)
					setProtocols([groups.code + " " + groups.name])
					setChosenProtocol(groups.code + " " + groups.name)
					console.log(data.categories)
				} catch (error) {
					console.error("Fetching error:", error)
				} finally {
					setLoading(false)
				}
			}
			fetchGroupGradingProtocol()
		}
	}, [groupID, belts])

	const togglePopup = () => {
		setShowPopup(!showPopup)
	}

	const onSelectRow = (protocol) => {
		setChosenProtocol(protocol)
	}

	return (
		<div className={style.gradingStatisticsContainer} id={id}>
			<div className={style.gradingButtonContainer}>
				{/* the button for the grading statistics */}
				<button onClick={togglePopup} id="popup-button">
					<img src="/GradingStatistics.svg" alt="Grading Statistics" />
				</button>
			</div>

			<Popup
				title={"Graderingsprotokoll"}
				setIsOpen={setShowPopup}
				isOpen={showPopup}
				id="grading-statistics-popup"
			>
				<Dropdown text={chosenProtocol} id="grading-protocols-dropdown">
					<GradingProtocolsRowsMenu protocols={protocols} onSelectRow = {onSelectRow} />
				</Dropdown>
				{loading ? <Spinner /> : <div>
					{	
						(data.belt && data.categories) &&
						<GradingProtocolsRows data={data.categories} chosenProtocol={chosenProtocol} beltColors = {[data.belt]} />
					}
				</div>} 


			</Popup>
		</div>
	)
}
