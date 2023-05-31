import DropDown from "../Common/List/Dropdown"
import { useState, useEffect, useContext } from "react"
import { AccountContext } from "../../context"
import BeltIcon from "../Common/BeltIcon/BeltIcon"
import CheckBox from "../Common/CheckBox/CheckBox"
import styles from "./GroupPicker.module.css"
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
const GroupRow = ({group, states, onToggle}) => {

	const name = group[0].name
	const id = group[0].id
	const belts = sortBelts()
	const [groupState, setGroupState] = useState(false)

	useEffect(() => {
		setGroupState(states?.some(g => g.id === id))
	}, [])

	function sortBelts () {
		let sorted = group[0].belts.slice().sort(( belt1, belt2 ) => {
			return belt1.id - belt2.id
		})

		return sorted
		
	}

    
	// TODO: Fixa error-hanteringen
	return (
		<div className={styles.gp23_groupRow}>
			<div className={styles.gp23_groupRow_belt_color}>
				{belts && Object.values(belts).map((belt, index) => (
					<BeltIcon key={index} id={`belt-${index}`} belt={belt}/>     
				))}
                
			</div>
			<p className={styles.gp23_GroupRow_text} id = {`groupRow-id-${id}`}>{name}</p>
			<div className={styles.gp23_GroupRow_check_box}>
				<CheckBox id={`group-${name}-text`} onClick={toggleGroup} checked={groupState}/>
			</div>    
		</div>
	)

	function toggleGroup(state) {
		setGroupState(state)
		onToggle(state, group[0])
	}
}

/**
 * A group picker component, allowing to pick wanted number of groups.
 * Parent handles logic.
 * 
 * If testFetchMethod is used, group picker will instead try to display 
 * what testFetchMethod returns. To fetch from the database dont 
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
 * @author Griffin (Group 2)
 * @since 2023-05-17
 * @version 1.0
 * @param id An id for group picker
 * @param testFetchMethod is used to test functionallity of GroupPicker
 * @param onToggle A toggle function when a group is selected.
 * @returns A new group picker component.
 */

export default function GroupPicker({ id, states, testFetchMethod, onToggle}) {
	const [groups, setGroups] = useState(0)
	const [droppedState, setDroppedState] = useState(false)
	const { token } = useContext(AccountContext)

	useEffect(() => {
		if (testFetchMethod !== null && testFetchMethod !== undefined) {
			//used for testing.
			const fetch = testFetchMethod()
			setGroups(parseJson(fetch))
		}
		else {
			fetch("/api/plan/all", {
				headers: { token }
			}).then(async data => {
				const json = await data.json()
				const g = {}
				for (const group of json) {
					if (!g[group.name]) {
						g[group.name] = []
					}
					g[group.name].push(group)
				}
				setGroups(g)
			}).catch(ex => {
				alert("Kunde inte hämta grupper")
				console.error(ex)
			})
		}
	}, [token])

	function parseJson (jsonObject) {
		const g = {}
		for (const group of jsonObject) {
			if (!g[group.name]) {
				g[group.name] = []
			}
			g[group.name].push(group)
		}
		return g
	}

	function checkID (id) {
		if (id === null || id === undefined) {
			console.error("Invalid ID")
			return false
		}
		return true
	}
    
	return(
        
		checkID(id) ?
			<div onClick = {() => setDroppedState(!droppedState)} id = {id} className={styles.gp23_group_picker} >
                
				<DropDown text={"Grupper"} id= {"gp-drop-down" + id} centered={true} autoClose={false}>
					{ 
						<div>
							<input type="checkbox" style={{display: "none"}}/> {/* Do not touch this checkbox, is needed */}
							{groups && Object.values(groups).map((group, index) => (
								<GroupRow key={index} states={states} group={group} onToggle={onToggle} />
							))}
                            
						</div>
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
