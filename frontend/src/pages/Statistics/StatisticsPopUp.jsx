import React, { useState,useEffect } from "react"
import style from "./StatisticsButton.module.css"
import Popup from "../../components/Common/Popup/Popup"
import StarRatings from "react-star-ratings"
import BeltColorChart from "../../components/Common/BeltColorChart/BeltColorChart"
/**
 * 
 * prop with data will be passed here so that data will be processed and will be shown in the popup
 * however there is some concerning with position of the css in that case.
 * 
 * The work is on progress for the statistics page.
 * 
 */
export default function StatisticsPopUp({data,filteredActivities,dates,averageRating,numberOfSessions}) {
	const startDate = dates.from
	const endDate = dates.to
	console.log(averageRating)
	console.log(filteredActivities)

	const [beltColorsData, setBeltColorsData] = useState({});

	useEffect(() => {
		// Function to calculate the amount of techniques by belt color
		const calculateBeltColorsData = () => {
		  const colorsCount = {};
		  filteredActivities.forEach(activity => {
			activity.beltColors.forEach(beltColor => {
			  const color = beltColor.belt_name;
			  colorsCount[color] = (colorsCount[color] || 0) + activity.count;
			});
		  });
		  setBeltColorsData(colorsCount);
		};
	
		// Call the function to calculate belt colors data when filteredActivities change
		calculateBeltColorsData();
	  }, [filteredActivities]);


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

