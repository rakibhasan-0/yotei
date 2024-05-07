/**
 * A container component for ActivityList items. Each item represents a row in the list.
 *
 * @param activities - A list of activities. 
 * 
 * @author Tomato (Group 6) 
 * @since 2024-05-06
 */
import WorkoutActivityListItem from "./SavedListItemComponent.jsx"
import styles from "./SavedListComponent.module.css"
import {useState, useEffect} from "react"
import Spinner from "../../../components/Common/Spinner/Spinner"

export default function WorkoutActivityList({activities}) {
	const [ListData, setListData] = useState(null)
	const [Loading, setLoading] = useState(true)

	useEffect(() => {
		console.log("SetListData:")
		console.log(activities)
		setListData(() => activities)
		setLoading(false)
	},[])
	
	const [isCollapsed, setIsCollapsed] = useState(false)
	
	const rotatedIcon = {
		transform: "rotate(180deg)",
		fontSize: "16px",
		cursor: "pointer"
	}
	if(Loading){
		return <Spinner/>
	}

	return (
		<fieldset className={setPadding() + " my-3 "} >
			<legend style={{textAlign: "left"}}>
				<div className="d-flex align-items-center justify-content-center" onClick={() => setIsCollapsed(!isCollapsed)}>
					<i style={isCollapsed? {fontSize: "16px"} : rotatedIcon} 
						className={"bi bi-chevron-down"}/>
				</div>
			</legend>
			{!isCollapsed && ListData.list.map((activity, index) =>
				<WorkoutActivityListItem key={activity.id} activity={activity} index={index}/>)}
		</fieldset>
	)
}

function sortActivities(activities) {
	const  sortedActivites = activities.sort((a, b) => a.order - b.order)
	return sortedActivites
}

function setPadding() {
	const paddingY = "pb-2"
	return `container ${styles["workout-activity-list"]} ` + paddingY
}