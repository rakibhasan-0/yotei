/**
 * This class is responsible to create the UI for an item in the list.
 * It's made up by one stripe row with the name and an arrow to make the description and time
 * for the item fold out beneath.
 *
 * @author Melinda Vestberg (dv20mvg), Gustaf Söderlund(et14gsd), Cesar Pawlik (dv20cpk) (Hawaii)
 * @param activity The exercise or technique
 * @param apiPath The path to the function (either 'exercises' or 'techniques')
 */
import React, { useState } from "react"
import FetchActivityDesc from "../Activity/FetchActivityDesc"
import DescriptionToggle from "./DescriptionToggle"

const ListItem = ({activity , apiPath, detailURL, index}) => {
	const [isActive, setIsActive] = useState(false)
	let bgColor = "#ffdfe3"


	const createStripes = () => {
		if (index % 2 === 0) {
			bgColor = "#ffdfe3"
		}
		else {
			bgColor = "#ffffff"
		}
	}

	return (
		<div>
			{createStripes()}

			<div className="row py-2 " key={activity.id}
				style={{
					backgroundColor: bgColor
				}}>

				<div className="col text-left ">
					<a href={detailURL + activity.id}><h5 className="  href-link" style={{wordBreak:"break-word"}}>{activity.name}</h5></a>
				</div>

				<div>
					{apiPath === "exercises" && <div className= "col listItemTime text-right pt-2 ">{activity.duration} min</div>}
				</div>

				<div className="toggleIcon" onClick={() => setIsActive(!isActive)}>
					<DescriptionToggle isActive={isActive}/>
				</div>
			</div>

			<div>
				{isActive &&
                <div className="row pb-3" style={{ backgroundColor: bgColor }}><FetchActivityDesc activity = {activity} apiPath={apiPath}/>
                </div>
				}

			</div>
		</div>
	)
}

export default ListItem
