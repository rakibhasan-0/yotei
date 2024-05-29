import React, { useEffect, useState, useContext } from "react"
import Popup from "../../components/Common/Popup/Popup"
import style from "./GradingStatisticsPopup.module.css"
import Dropdown from "../../components/Common/List/Dropdown"
import GradingProtocolsRowsMenu from "../../components/Grading/GradingProtocolsRowsMenu"
import GradingProtocolsRows from "../../components/Grading/GradingProtocolsRows"
import Spinner from "../../components/Common/Spinner/Spinner"
import { AccountContext } from "../../context"

/**
 * Grading statistics popup component. Displays what techniques are required for each belt,
 * and which techniques have been practiced by the group.
 * 
 * @param {String} id - The id of the component, for testing purposes
 * @param {String} groupID - The id of the group
 * @param {Array} belts - The belts of the group
 * 
 * @since 2024-05-20
 * @author Team Coconut
 */
export default function GradingStatisticsPopup({ id, groupID, belts, datesFrom, datesTo}) {

	const [showPopup, setShowPopup] = useState(false)
	const [protocols, setProtocols] = useState([])
	const [chosenProtocol, setChosenProtocol] = useState("")
	const [beltID, setBeltID] = useState(null)
	const [loading, setLoading] = useState(false)
	const [newBelts, setNewBelts] = useState([])
	const [data, setData] = useState([])
	const { token } = useContext(AccountContext)

	useEffect(() => {
		if (belts.length > 0) {
			getNextBelts()
			setChosenProtocol(belts[0].name)
		}
	}, [belts])

	// Fetches and sets groups protocols and data.
	useEffect(() => {
		if (groupID && beltID !== null) {
			const fetchGroupGradingProtocol = async () => {

				const requestOptions = {
					headers: {"Content-type": "application/json", token: token}
				}

				try {
					setLoading(true)
					const response = await fetch(`/api/statistics/${groupID}/grading_protocol?beltId=${beltID}&startdate=${datesFrom}&enddate=${datesTo}`, requestOptions)

					if (!response.ok) {
						throw new Error("Failed to fetch group data")
					}

					if (response.status === 204) {
						// For belts that do not have grading protocols.
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
	}, [beltID])
	
	// Finds and sets the selected belts ids for the chosen protocol.
	useEffect(() => {
		if (chosenProtocol) {
			const index = protocols.findIndex(p => p === chosenProtocol)
			const selectedBelt = newBelts[index]
			if (selectedBelt) {
				setBeltID(selectedBelt.id)
			}
		}
	}, [chosenProtocol])

	/**
	 * Completes the url for the api call to retrieve the next belt.
	 * 
	 * @param baseUrl The base URL to which the numbers will be appended
	 * @param numbers The numbers added to the base URL
	 */
	function addNumbersToUrl(baseUrl, numbers, key = "beltId") {
		const params = new URLSearchParams()
		numbers.forEach(num => params.append(key, num))
		return `${baseUrl}?${params.toString()}`
	}

	// Toggles popups visibility.
	const togglePopup = () => {
		setShowPopup(!showPopup)
	}

	// Sets chosen protocol.
	const onSelectRow = (protocol) => {
		setChosenProtocol(protocol)
	}

	// Fetches the next belts for the group.
	const getNextBelts = async () => {
		
		// Runs the fetch request to get the next belts for the group.
		const requestOptions = {
			headers: {"Content-type": "application/json", token: token}
		}

		try {
			setLoading(true)
			const url = addNumbersToUrl("/api/statistics/next_belt", belts.map(belt => belt.id))
			const response = await fetch(url, requestOptions)
			if (response.status === 200) {
				const json = await response.json()
				setNewBelts(json)
				setProtocols(json.map(belt => belt.name))
			} else if (response.status === 204) {
				setProtocols([])
			} else {
				throw new Error("Failed to fetch group data")
			}
			
		} catch (error) {
			console.error("Fetching error:", error)
		} finally {
			setLoading(false)
		}
	}

	// Sets the belt ID to the first belt in the newBelts array.
	useEffect(() => {
		if (newBelts[0]) {
			setBeltID(newBelts[0].id)
		}
		
	},[newBelts])

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
					<div style={{ border: `3px dashed #${[data.belt.belt_color]}`, padding: "4px", borderRadius: "10px" }}>
						<GradingProtocolsRows data={data.categories} />
					</div>
				}
				
			</Popup>
		</div>
	)
}
