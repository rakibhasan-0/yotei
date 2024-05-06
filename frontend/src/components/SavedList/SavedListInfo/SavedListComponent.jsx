/**
 * A container component for ActivityList items. Each item represents a row in the list.
 *
 * @param categoryName - The name of the category 
 * @param activities - A list of activities. 
 * @param id - Component id
 * 
 * @author G5 Cyclops (2023-05-04)
 */
import WorkoutActivityListItem from "./SavedListItemComponent.jsx"
import styles from "./SavedListComponent.module.css"
import {useState, useEffect} from "react"
import Spinner from "../../../components/Common/Spinner/Spinner"

export default function WorkoutActivityList({categoryName, activities, id}) {
	const [ListData, setListData] = useState(null)
	const [Loading, setLoading] = useState(true)

	useEffect(() => {
		const MockList = {
			"list_id": 1,
			"list_name": "TestList",
			"state": "Private",
			"amountOfWorkouts": 3,
			"author": "Oliver",
			"author_id": 1,
			"description": "Behövs ens detta",
			"created_date": "2024-04-13",
			"changed_date": "2024-05-03",
			"list_users": ["1", "Hugo","Willy"],
			"list": [
				{"id": 1, "type": "technique", "duration":5, "technique": {"name": "Kniv i magen! Mycket ont","description": "Beskv1"}},
				{"id": 2, "type": "exercise", "duration":10,"exercise":{"name": "Kniv i foten! Mycket ont","description": "Beskv2"}},
				{"id": 3, "type": "technique", "duration":15, "technique": {"name": "Knip i magen! Mycket ont","description": "Beskv3"}}
			]
			//Locked
			//Public
		}
		setListData(() => MockList)
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

	return (											//Här var det tidigare category name
		<fieldset className={setPadding(ListData.list, "Aktiviteter") + " my-3 "} id={id}>
			<legend style={{textAlign: "left"}}>
				<div className="d-flex align-items-center justify-content-center" onClick={() => setIsCollapsed(!isCollapsed)}>
					<i style={isCollapsed? {fontSize: "16px"} : rotatedIcon} 
						className={categoryName != null ? "ml-2 bi bi-chevron-down" : "bi bi-chevron-down"}/>
				</div>
			</legend>
			{!isCollapsed && ListData.list.map((activity, index) =>
				<WorkoutActivityListItem key={activity.id} activity={activity} index={index}/>)}
			{categoryName === null && <div style={{margin:"20px"}}></div>}
		</fieldset>
	)
}

function sortActivities(activities) {
	const  sortedActivites = activities.sort((a, b) => a.order - b.order)
	return sortedActivites
}

function setPadding(length, categoryName) {
	const paddingY = !categoryName ? "py-0" : "pb-3"
	return `container ${styles["workout-activity-list"]} ` + paddingY
}