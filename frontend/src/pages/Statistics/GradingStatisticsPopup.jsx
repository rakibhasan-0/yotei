import React, { useState } from "react"
import Popup from "../../components/Common/Popup/Popup"
import style from "./GradingStatisticsPopup.module.css"
import Dropdown from "../../components/Common/List/Dropdown" // Updated import
import GradingProtocolsRowsMenu from "../../components/Grading/GradingProtocolsRowsMenu"
import GradingProtocolsRows from "../../components/Grading/GradingProtocolsRows"

const mockGradingProtocols = [
	"5 KYU GULT BÄLTE",
	"4 KYU ORANGE BÄLTE",
]

export default function GradingStatisticsPopup({ id, gradingProtocols = mockGradingProtocols }) {
	// State for showing the popup
	const [showPopup, setShowPopup] = useState(false)
	const [chosenProtocol, setchosenProtocol] = useState(gradingProtocols[0])

	const togglePopup = () => {
		setShowPopup(!showPopup)
	}

	const onSelectRow = (protocol) => {
		setchosenProtocol(protocol)
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
					<GradingProtocolsRowsMenu protocols={gradingProtocols} onSelectRow = {onSelectRow} />
				</Dropdown>

				<GradingProtocolsRows data={[]} >

				</GradingProtocolsRows>

				<p>Här kommer att visas data</p>
			</Popup>
		</div>
	)
}
