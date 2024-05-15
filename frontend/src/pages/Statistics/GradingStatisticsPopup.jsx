import {React, useState} from "react"
import Popup from "../../components/Common/Popup/Popup"
import style from "./GradingStatisticsPopup.module.css"



export default function GradingStatisticsPopup(){
	const [showPopup, setShowPopup] = useState(false)
    
	const togglePopup = () => {
		setShowPopup(!showPopup)
	}
	return (
		<div className={style.gradingStatisticsContainer} id="grading-statistics-container">

			<div className={style.gradingButtonContainer}>
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