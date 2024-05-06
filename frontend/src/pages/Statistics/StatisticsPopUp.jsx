import React, { useState } from "react"
import style from "./StatisticsButton.module.css"
import Popup from "../../components/Common/Popup/Popup"
import StarRatings from "react-star-ratings"
import BeltColorChart from "../../components/Common/BeltColorChart/BeltColorChart"
/**
 * 
 * prop with data will be passed here so that data will be processed and will be shown in the popup
 * however there is some concerning with position of the css in that case.
 * 
 */
export default function StatisticsPopUp(averageRating, numberOfSessions,startDate,endDate) {
	numberOfSessions = 5 //mock data
	averageRating = 2.1 //mock data
	startDate = "2021-01-01" //mock data
	endDate = "2021-01-02" //mock data
	
	const beltColorsData = {
		"White": 10,
		"Yellow": 8,
		"Orange": 6,
		"Green": 12,
		"Blue": 15,
		"Purple": 5,
		"Brown": 3,
		"Black": 2,
	}


	const [showPopup, setShowPopup] = useState(false)

	const togglePopup = () => {
		setShowPopup(!showPopup)
	}

	return (
		<div className={style.statisticsButtonContainer}>
			<button onClick={togglePopup}>
				<img src="/Statistics.svg" />
			</button>

			<Popup title={"Statistics"} id="statistics-popup" isOpen={showPopup} setIsOpen={setShowPopup}>
				<p style={{ fontSize: "40px", fontFamily: "Arial, sans-serif" }}>
					{averageRating}/5
				</p>
				<StarRatings rating={averageRating} starRatedColor="#ffa500" numberOfStars={5} name='rating' starDimension="50px" starSpacing="4px" />
				<p style = {{color: "#808080"}}>
					Genomsnittligt betyg för {numberOfSessions} tillfällen från {<br />} datum {startDate} till {endDate}
				</p>
				<BeltColorChart beltColorsData={beltColorsData} /> 
			</Popup>


		</div>

	)
}

