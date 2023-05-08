import React, {useState} from "react"
import RadioButton from "../../Common/RadioButton/RadioButton"
import "./ActivityCategory.css"
/**
 * Component to choose category for activity, with possibility to add new categories.
 *
 * Props:
 *     prop1 @id {string}  - Id for the component.
 *     prop2 @categories {list with objects name and marked}  - List with objects for the name and marked status for each category.
 *     prop3 @setCategories {setter for categories} - Setters for categories.
 *
 * Example usage:
 *		const [james, setJames] = useState([{name: "gegegegegege", marked: false}, {name: "daddy", marked: false}])
 *		<ActivityCategories id = "10" categories={james} setCategories={setJames}></ActivityCategories>
 *
 * @author Team Minotaur
 * @version 1.0
 * @since 2023-05-08
 */
export default function ActivityCategories({id, categories, setCategories}) {
	const [inputValue, setInputValue] = useState("")

	const handleEnter = (event) => {
		if (!categories.some((c)=>c.name===inputValue) && inputValue !== "" && event.key === "Enter") {
			//Set everything to false
			changeMarked(-1)
			setCategories([...categories, {name: event.target.value, marked: true}])
			setInputValue("")
		}
	}
	//Set all to false except for the index given to true.
	function changeMarked(index) {
		let tempArr = [...categories]
		for (let j = 0; j < categories.length; j++) {
			tempArr[j].marked = (j === index)
		}
		setCategories(tempArr)
	}

	return <div>
		<ul id={id} className={"category-list"}>
			{categories.map((category, i) => {
				const id = `activity-${i}`
				return (<li key={id}>
					<div className="category-list-item">
						<p className="category-text">{category.name}</p>
						<div className={"radioBtn-category"}>
							<RadioButton
								id = {"radio-"+i}
								onClick={() => changeMarked(i)}
								toggled={categories[i].marked}></RadioButton>
						</div>
					</div>
				</li>)
			})}
			<li>
				<input
					id = {id}
					type="text"
					value={inputValue}
					placeholder="+ Lägg till ny"
					className={"category-input"}
					onKeyDown={handleEnter}
					onChange={(e) => setInputValue(e.target.value)}
				/>
			</li>
		</ul>
	</div>
}