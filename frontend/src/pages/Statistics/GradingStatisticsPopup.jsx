import React, { useEffect, useState } from "react"
import Popup from "../../components/Common/Popup/Popup"
import style from "./GradingStatisticsPopup.module.css"
import Dropdown from "../../components/Common/List/Dropdown" // Updated import
import GradingProtocolsRowsMenu from "../../components/Grading/GradingProtocolsRowsMenu"
import GradingProtocolsRows from "../../components/Grading/GradingProtocolsRows"
import Spinner from "../../components/Common/Spinner/Spinner"

/**
 *  The component for the grading statistics popup. It shows what techniques are required for each belt.
 *  And what techniques have been completed by the group.
 * 
 * 
 * @param {String} id - The id of the component, for testing purposes
 * @param {String} groupID - The id of the group
 * @param {Array} belts - The belts of the group
 * 
 * @since 2024-05-20
 * @author Team Coconut 
 */



export default function GradingStatisticsPopup({ id, groupID, belts}) {

	const [showPopup, setShowPopup] = useState(false)
	const [protocols, setProtocols] = useState([])
	const [chosenProtocol, setChosenProtocol] = useState([])
	const [beltID, setBeltID] = useState([])
	const [loading, setLoading] = useState(false)
	const [data, setData] = useState([])



	//Initial fetch of the grading protocol
	useEffect(() => {

		if (belts.length > 0 && groupID) {
			async function fetchGroupGradingProtocol() {
				try {
	
					setLoading(true)
					setChosenProtocol(belts[0].name)
					setBeltID(belts[0].id)
					const responseFromGroupNameAPI = await fetch(`/api/statistics/${groupID}/grading_protocol?beltId=${belts[0].id}`)
					if(responseFromGroupNameAPI.status === 204) {
						setLoading(false)
						return
					}
					if (!responseFromGroupNameAPI.ok) {
						throw new Error("Failed to fetch group data")
					}
					const groups = await responseFromGroupNameAPI.json()
					console.log(groups)
					setData(groups)
					setProtocols(belts.map(belt => belt.name))

				} catch (error) {
					console.error("Fetching error:", error)
				} finally {
					setLoading(false)
				}
			}
			fetchGroupGradingProtocol()
		}
	}, [belts])

	//Switching between grading protocols
	useEffect(() => {
		if(belts.length > 0 && groupID) {

			async function fetchGroupGradingProtocolSwitch() {
				try {

					setLoading(true)
					setBeltID(belts.find(belt => belt.name === chosenProtocol).id)
					const responseFromGroupNameAPI = await fetch(`/api/statistics/${groupID}/grading_protocol?beltId=${beltID}`)
					if (!responseFromGroupNameAPI.ok) {
						throw new Error("Failed to fetch group data")
					}
					if(responseFromGroupNameAPI.status === 204) {
						setLoading(false)
						return
					}
					const groups = await responseFromGroupNameAPI.json()
	
					setData(groups)
					setProtocols(belts.map(belt => belt.name))

				} catch (error) {
					console.error("Fetching error:", error)
				} finally {
					setLoading(false)
				}
			}
			fetchGroupGradingProtocolSwitch()
		}

	}, [chosenProtocol])

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
				<Dropdown text={data.code + " " + data.name} id="grading-protocols-dropdown">
					<GradingProtocolsRowsMenu protocols={protocols} onSelectRow = {onSelectRow} />
				</Dropdown>
				{loading ? <Spinner /> : <div>
					{	
						(data.belt && data.categories) &&
						<GradingProtocolsRows data={data.categories} beltColors = {[data.belt]} />
					}
				</div>} 


			</Popup>
		</div>
	)
}
