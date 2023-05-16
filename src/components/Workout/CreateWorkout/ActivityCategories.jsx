import React, {useState, useContext, useEffect} from "react"
import RadioButton from "../../Common/RadioButton/RadioButton"
import { ActivityInfoContext, ActivityInfoDispatchContext } from "./ActivityInfoContext"
import "./ActivityCategory.css"
/**
 * Component to choose category for activity, with possibility to add new categories.
 *
 * Props:
 *     prop1 @id {string}  - Id for the component.
 *
 * Example usage:
 *		<ActivityCategories id = "10"></ActivityCategories>
 *
 * @author Team Minotaur
 * @version 2.0
 * @since 2023-05-16
 */
export default function ActivityCategories({id}) {
	const [inputValue, setInputValue] = useState("")
	const activityInfo = useContext(ActivityInfoContext)
	const dispatch = useContext(ActivityInfoDispatchContext)

	const handleEnter = (event) => {
		if (!activityInfo.categories.some((c)=>c.name===inputValue) && inputValue !== "" && event.key === "Enter") {
			//Set everything to false
			console.log("adding category")
			console.log(activityInfo.categories)
			console.log(inputValue)
			dispatch({type: "ADD_CATEGORY", payload: {name: inputValue}})
			dispatch({type: "CHECK_CATEGORY", payload: {id: -1}})
			setInputValue("")
		}
	}
	useEffect(() => {
		dispatch({type: "ADD_DEFAULT_CATEGORY", })
	}, [])

	return <div>
		<ul id={id} className={"category-list"}>
			{activityInfo.categories.map((category, i) => {
				const id = `activity-${i}`
				return (<li key={id}>
					<div className="category-list-item">
						<p className="category-text">{category.name}</p>
						<div className={"radioBtn-category"}>
							<RadioButton
								id = {"radio-"+i}
								onClick={() => dispatch({type: "CHECK_CATEGORY", payload: {id: i}})}
								toggled={activityInfo.categories[i].checked}
							></RadioButton>
						</div>
					</div>
				</li>)
			})}
			<li>
				<div className="category-list-item">
					<input
						id = {id}
						type="text"
						value={inputValue}
						placeholder="+ Lägg till ny"
						className={"category-input"}
						onKeyDown={handleEnter}
						onChange={(e) => setInputValue(e.target.value)}
					/>
				</div>
			</li>
		</ul>
	</div>
}