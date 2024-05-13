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
			const beltColors = {}
			groupActivities.forEach(activity => {
				
				if(activity.type == "technique") {
					activity.beltColors.forEach(beltColor => {
						const identifier = beltColor.belt_name + (beltColor.is_child ? "_c" : "")
						if (beltColors[identifier]) {
							beltColors[identifier]["count"] += activity.count
						} else {
							beltColors[identifier] = {"count":activity.count,
								"color":beltColor.belt_color,
								"isChild":beltColor.is_child}
						}
					})
				}
			})

			const entries = Object.entries(beltColors)
			entries.sort((a, b) => b[1].count - a[1].count)
			const sortedBeltColors = Object.fromEntries(entries)
			setBeltColorsData(sortedBeltColors)
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

			<Popup
			title={"Sammanställning av tillfällen"}
			id="statistics-popup"
			isOpen={showPopup}
			setIsOpen={setShowPopup}
			>
				<div className={style.statisticsPopupContainer}>
					<StarRatings
						rating={averageRating}
						starRatedColor="#ffcc00"
						numberOfStars={5}
						name="rating"
						starDimension="50px"
						starSpacing="4px"
					/>
					<p style={{ color: "#b9b0b0" }}>
						Genomsnittligt betyg {averageRating}/5 för {numberOfSessions}{" "}
						tillfällen från {<br />} datum {startDate} till {endDate}
					</p>
					<p style={{ fontSize: "25px" }}>Bält-tekniker</p>
					<div style={{ overflowY: "scroll" }}>
						<BeltColorChart beltColorsData={beltColorsData} />
					</div>
				</div>
			</Popup>
		</div>
	);
}

