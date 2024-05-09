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
import {useState, useEffect,useContext} from "react"
import Spinner from "../../../components/Common/Spinner/Spinner"
import { AccountContext } from "../../../context"


export default function WorkoutActivityList({activities,edit}) {
	const context = useContext(AccountContext)
	const {token, userId} = context
	const [ListData, setListData] = useState(null)
	const [Loading, setLoading] = useState(true)

	useEffect(() => {
		console.log("SetListData:")
		console.log(activities)
		setListData( activities)
		//setLoading(false)
		
	}, [])
	useEffect(() => {
		console.log("ListDataDone")
		console.log(ListData)
		if(ListData!=null){
			setLoading(false)
		}
		
	}, [ListData])
	
	const [isCollapsed, setIsCollapsed] = useState(false)
	
	const rotatedIcon = {
		transform: "rotate(180deg)",
		fontSize: "16px",
		cursor: "pointer"
	}
	return (Loading==true) ?
		<><Spinner/></>
	:
	<>
		<fieldset className={setPadding() + " my-3 "} >
			<legend style={{textAlign: "left"}}>
				<div className="d-flex align-items-center justify-content-center" onClick={() => setIsCollapsed(!isCollapsed)}>
					<i style={isCollapsed? {fontSize: "16px"} : rotatedIcon} 
						className={"bi bi-chevron-down"}/>


				</div>
			</legend>
			
			{console.log("Testy:)")}
			{console.log(ListData)}
			{!isCollapsed && ListData.data.activities.map((activity, index) =>
				<WorkoutActivityListItem key={activity.id} activity={activity} index={index} edit={edit}/>)}
				{console.log("Testy done:)")}

		</fieldset>
	</>
}

function setPadding() {
	const paddingY = "pb-2"
	return `container ${styles["workout-activity-list"]} ` + paddingY
}