import DropDown from "../Common/List/Dropdown"
import { useState, useEffect, useContext } from "react"
import { AccountContext } from "../../context"
import BeltIcon from "../Common/BeltIcon/BeltIcon"
import CheckBox from "../Common/CheckBox/CheckBox"
import styles from "./GroupPicker.module.css"
import {setError as setErrorToast} from "../../utils"

/**
 * GroupRow represents a row in the dropdown menu 
 * of the filter component on the page 'Grupper' (Plan).
 * It contains one checkbox, the name of the group, and the 
 * colors of the belts that are connected to the group.
 * 
 * @param group Object that represents the group data. Name, id, and belts.
 * @param onToggle Function that runs when checkbox is clicked and 
 *                 and toggles it.
 * 
 * @returns The html for th new group row.
 * 
 */
const GroupRow = ({group, onToggle}) => {

	const name = group.name
	const id = group.id
	const belts = sortBelts()

	function sortBelts () {
		let sorted = group.belts.slice().sort(( belt1, belt2 ) => {
			return belt1.id - belt2.id
		})

		return sorted
	}

	function handleCheckGroup(newState) {
		onToggle(newState, group.id)
	}
    
	return (
		<div className={styles.gp23_groupRow} onClick={(e) => !group.selected && e.preventDefault()}>
			<div className={styles.gp23_groupRow_belt_color}>
				{belts && belts.map((belt, index) => (
					<BeltIcon key={belt.id} id={`belt-${index}`} belt={belt}/>     
				))}
			</div>
			<p className={styles.gp23_GroupRow_text} id = {`groupRow-id-${id}`}>{name}</p>
			<div className={styles.gp23_GroupRow_check_box}>
				<CheckBox id={`group-${name}-text`} onClick={handleCheckGroup} checked={group.selected}/>
			</div>    
		</div>
	)
}

/**
 * A group picker component, allowing to pick wanted number of groups.
 * Parent handles logic.
 * 
 * If testFetchMethod is used, group picker will instead try to display 
 * what testFetchMethod returns. To fetch from the database don't 
 * declare testFetchMethod when creating GroupPicker.
 * 
 * Example of using testFetchMehtod.
 * <GroupPicker id={42} testFetchMethod={() => 'do this instead'} onToggle={onToggle}/> 
 *   
 * Example of fetching from database.
 * <GroupPicker id={42} onToggle={onToggle}/> 
 * 
 * Example of a .json response 
 * {
        "id": 1,
        "name": "Grönt bälte träning",
        "userId": 1,
        "belts": [
        {
            "id": 7,
            "name": "Grönt",
            "color": "00BE08",
            "child": false
        }
        ]
    } 
 * 
 * Example of a .json response 
 * {
        "id": 1,
        "name": "Grönt bälte träning",
        "userId": 1,
        "belts": [
        {
            "id": 7,
            "name": "Grönt",
            "color": "00BE08",
            "child": false
        }
        ]
    } 
 * 
 * 
 * @author Griffin (Group 2), Team Mango (Group 4) (2024-05-17) 
 * @since 2023-05-17
 * @version 1.0
 * @param id An id for group picker
 * @param states A variable corresponding to chosenGroups in FilterPlan.jsx.
 * @param testFetchMethod is used to test functionallity of GroupPicker
 * @param onToggle A toggle function when a group is selected.
 * @param onlyMyGroups A boolean variable for if the new filtering checkbox is active or not.
 * @param callbackFunctionCheckbox Is called when the checkbox is pressed to set the groups.
 * @returns A new group picker component.
 * Updates: 2024-05-10: Added a checkbox and filtering of groups that a user has created.
 *  	    2024-05-17: Fixed the filtering and refactored code slightly.
 */
export default function GroupPicker({ id, states, testFetchMethod, onToggle, onlyMyGroups, callbackFunctionCheckbox}) {
	const [ groups, setGroups ] = useState()
	const { token } = useContext(AccountContext)

	const user = useContext(AccountContext) //Needed to get the userId to get only this user's groups.

	async function fetchPlans() {
		if (testFetchMethod !== null && testFetchMethod !== undefined) {
			//used for testing.
			const fetch = testFetchMethod()
			setGroups(fetch)
			return
		}
		
		//No test method used.
		await fetch("/api/plan/all", {
			method: "GET",
			headers: { token }
		}).then(async data => {
			const json = await data.json()

			if (onlyMyGroups) {
				//Only this user's groups should be shown, so we filter first.
				setGroups(json.filter(group => group.userId === user.userId).map(group => {
					//This is called once for each group every time you toggle a group checkbox. (You get one checkbox for each group.)
					return {...group, selected: states && states.includes(group.id)}
				}))
			}
			else {
				//All groups are used.
				setGroups(json.map(group => { //Old code.
					return {...group, selected: states && states.includes(group.id)}
				}))
			}
		}).catch(() => {
			setErrorToast("Kunde inte hämta grupper") //TODO this error handling here seems problematic.
			//Potential solutions: Return 200 or 204 in the backend when there are no groups (instead of 404), or change just the code here.
		})
	}

	useEffect(() => {
		fetchPlans()
		if (callbackFunctionCheckbox) { //If the callback function is set (not true for tests).
			callbackFunctionCheckbox(groups) //Set the groups variable in PlanIndex.jsx.
		}
	}, [states, onlyMyGroups]) //Should be updated when the checkbox for onlyMyGroups is updated.

	function checkID (id) {
		if (id === null || id === undefined) {
			console.error("Invalid ID")
			return false
		}
		return true
	}

	function handleToggle(checked, group) {
		const updatedGroups = groups.map((g) => {
			if(g.id === group.id) {
				return {...g, selected: checked}
			}
			return g
		})
		setGroups(updatedGroups)
		onToggle(checked, group)
	}

	return(
		checkID(id) ?
			<div id = {id} className={styles.gp23_group_picker} >
				<DropDown text={"Grupper"} id= {"gp-drop-down" + id} centered={true} autoClose={false}>
					{
						groups && groups.map((group) => (
							<GroupRow key={group.id} selected={group.selected} group={group} onToggle={handleToggle} />
						))
					}
				</DropDown>
			</div>
			:
			<div id = "error-load-group-picker" className={styles.gp23_failed_to_load}>
				{/* TODO: Lägg in en "riktig errorhantering" */}
				<p>Kunde inte hämta grupper.</p>
			</div>
	)

}
