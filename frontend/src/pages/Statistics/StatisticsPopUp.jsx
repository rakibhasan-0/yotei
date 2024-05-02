import React, { useState } from 'react'
import style from './StatisticsButton.module.css'
import Popup from '../../components/Common/Popup/Popup'

/**
 * 
 * prop with data will be passed here so that data will be processed and will be shown in the popup
 * however there is some concerning with position of the css in that case.
 * 
 */
function StatisticsPopUp() {
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
				<p>Statistics Will be shown here </p>
			</Popup>
		</div>
	)
}

export default StatisticsPopUp;
