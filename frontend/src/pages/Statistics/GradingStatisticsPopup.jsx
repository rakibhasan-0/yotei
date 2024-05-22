import React, { useEffect, useState } from "react"
import Popup from "../../components/Common/Popup/Popup"
import style from "./GradingStatisticsPopup.module.css"
import Dropdown from "../../components/Common/List/Dropdown"
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


export default function GradingStatisticsPopup({ id, groupID, belts,datesFrom,datesTo}) {

	const [showPopup, setShowPopup] = useState(false)
	const [protocols, setProtocols] = useState([])
	const [chosenProtocol, setChosenProtocol] = useState("")
	const [beltID, setBeltID] = useState(null)
	const [loading, setLoading] = useState(false)
	const [data, setData] = useState([])

	useEffect(() => {
		if (belts.length > 0) {
			setProtocols(belts.map(belt => belt.name))
			setChosenProtocol(belts[0].name)
			setBeltID(belts[0].id)
		}
	}, [belts])

	useEffect(() => {
		if (groupID && beltID !== null) {
			const fetchGroupGradingProtocol = async () => {
				try {
					setLoading(true)
					const response = await fetch(`/api/statistics/${groupID}/grading_protocol?beltId=${beltID}&startdate=${datesFrom}&enddate=${datesTo}`)
					if (!response.ok) {
						throw new Error("Failed to fetch group data")
					}
					if(response.status === 204){
						//For belts that do not have grading protocols
						setProtocols([])
					} else {
						const groups = await response.json()

						setData(groups)

					}
				} catch (error) {
					console.error("Fetching error:", error)
				} finally {
					setLoading(false)
				}
			}
			fetchGroupGradingProtocol()
		}
	}, [groupID, beltID,showPopup])

	useEffect(() => {
		if (chosenProtocol) {
			const selectedBelt = belts.find(belt => belt.name === chosenProtocol)
			if (selectedBelt) {
				setBeltID(selectedBelt.id)
			}
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
				<Dropdown text={data.code ? data.code + " " + data.name : "Välj ett protokoll"} id="grading-protocols-dropdown">
					<GradingProtocolsRowsMenu protocols={protocols} onSelectRow={onSelectRow} />
				</Dropdown>
				{loading ? <Spinner /> : 
					(data.belt && data.categories) && 
					<GradingProtocolsRows data={data.categories} beltColors={[data.belt]} />
				}
			</Popup>
		</div>
	)
}
