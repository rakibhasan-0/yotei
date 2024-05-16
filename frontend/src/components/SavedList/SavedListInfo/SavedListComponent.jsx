/**
 * A container component for ActivityList items. Each item represents a row in the list.
 *
 * @param activities - A list of activities. 
 * 
 * @author Tomato (Group 6) 
 * @since 2024-05-06
 */
import SavedActivityListItem from "./SavedListItemComponent.jsx"
import styles from "./SavedListComponent.module.css"
//Commented due to linter
//import {useState, useEffect,useContext} from "react"
import {useState, useEffect} from "react"
import Spinner from "../../../components/Common/Spinner/Spinner"
//Commented due to linter
//import { AccountContext } from "../../../context"
//Commented due to linter
//import { ListCreateContext } from "../../Common/List/ListCreateContext"


export default function SavedActivityList({activities,listCreateInfoDispatchProp=null}) {
	//Commented due to linter
	//const context = useContext(AccountContext)
	/*const { listCreateInfo, listCreateInfoDispatch } =
	useContext(ListCreateContext)*/
	//Commented due to linter:
	//const {token, userId} = context
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
				{!isCollapsed && ListData.data.activities.map((activity, index) =>
					<SavedActivityListItem key={activity.id} activity={activity} index={index} listCreateInfoDispatchProp={listCreateInfoDispatchProp}/>)}
			</fieldset>
		</>
}

function setPadding() {
	const paddingY = "pb-2"
	return `container ${styles["list-activity-list"]} ` + paddingY
}