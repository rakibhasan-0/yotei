import {React, useState} from "react"
import Popup from "../../components/Common/Popup/Popup"
import style from "./GradingStatisticsPopup.module.css"

/**
 * 
 * The work is in progress. The component will show the statistics for the grading. 
 * Currently by clicking on the button, a popup will appear.
 */

export default function GradingStatisticsPopup({id}){

	// State for showing the popup
	const [showPopup, setShowPopup] = useState(false)
    
	const togglePopup = () => {
		setShowPopup(!showPopup)
	}
	return (
		<div className={style.gradingStatisticsContainer} id={id}>

			<div className={style.gradingButtonContainer}>
				{/* the button for the grading statistics */}
				<button onClick={togglePopup} id ="popup-button">
					<img src="/GradingStatistics.svg" />
				</button>
			</div>

			<Popup
				title={"Statistik för graderingar"}
				setIsOpen={setShowPopup}
				isOpen={showPopup}
				id="grading-statistics-popup"
			>

				<p>Här kommer att visas data</p>
			</Popup>
		</div>
	)
}