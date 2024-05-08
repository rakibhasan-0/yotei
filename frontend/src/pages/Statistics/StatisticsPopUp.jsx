import React, { useState,useEffect } from "react"
import style from "./StatisticsButton.module.css"
import Popup from "../../components/Common/Popup/Popup"
import StarRatings from "react-star-ratings"
import BeltColorChart from "../../components/Common/BeltColorChart/BeltColorChart"

/**
 * Statistics pop-up component.
 * @input groupActivities - The activities to be displayed in the pop-up.
 * @input dates - The date interval of the sessions
 * @input averageRating - The average rating of the sessions
 * @input numberOfSessions - The number of sessions done in the interval
 * @returns A pop-up with statistics.
 * 
 * @author Team Coconut (Gabriel Morberg)
 * @since 2024-05-08
 * @version 1.0
 */
export default function StatisticsPopUp({groupActivities,dates,averageRating,numberOfSessions}) {
	const startDate = dates.from
	const endDate = dates.to

	const [beltColorsData, setBeltColorsData] = useState({})

	useEffect(() => {
		// Function to calculate the amount of techniques by belt color
		const calculateBeltColorsData = () => {
			const colorsCount = {}
			groupActivities.forEach(activity => {
				activity.beltColors.forEach(beltColor => {
					const color = beltColor.belt_name
					colorsCount[color] = (colorsCount[color] || 0) + activity.count
				})
			})
			setBeltColorsData(colorsCount)
		}
	
		// Call the function to calculate belt colors data when groupActivities change
		calculateBeltColorsData()
	}, [groupActivities])


	const [showPopup, setShowPopup] = useState(false)

	const togglePopup = () => {
		setShowPopup(!showPopup)

	}

	return (
		<div className={style.statisticsButtonContainer}>
			<button onClick={togglePopup}>
				<img src="/Statistics.svg" />
			</button>

			<Popup title={"Statistik"} id="statistics-popup" isOpen={showPopup} setIsOpen={setShowPopup}>
				<p style={{ fontSize: "40px", fontFamily: "Arial, sans-serif" }}>
					{averageRating}/5
				</p>
				<StarRatings rating={averageRating} starRatedColor="#ffcc00" numberOfStars={5} name='rating' starDimension="50px" starSpacing="4px" />
				<p style = {{color: "#b9b0b0"}}>
					Genomsnittligt betyg för {numberOfSessions} tillfällen från {<br />} datum {startDate} till {endDate}
				</p>
				
				<p style = {{fontSize: "40px"}}>
					Bält-tekniker
				</p>
				<BeltColorChart beltColorsData={beltColorsData} /> 
			</Popup>


		</div>

	)
}

