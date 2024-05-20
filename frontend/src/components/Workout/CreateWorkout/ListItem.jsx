import TechniqueCard from "../../Common/Technique/TechniqueCard/TechniqueCard"
import ExerciseListItem from "../../Common/ExerciseCard/ExerciseListItem"

/**
 * This component is used to display the content of a list that is 
 * inside of a drop down menu.
 * 
 * @param {Object} item 	The activity such as techniques and exercises.
 * @param {JSX} checkBox 	If a checkbox is wanted, send it as a prop.
 * @param {String} id 		The id of the activity that is in the list.
 *
 * @author	Team Tomato
 * @since	2024-05-20
 */
export default function ListItem({item, checkBox, id}) {

	//TODO: Kanske ett namnbyte på komponenten? ListItem är något vagt?
	

	return(
		<div>
			
			{item.type === "technique" ? (
				<TechniqueCard
					id={"technique-list-item-" + id}
					checkBox={checkBox}
					technique={item}
				/>
			) : null
			}

			{
				item.type === "exercise" ? (
					<ExerciseListItem
						id={id}
						text={item.duration + " min"}
						detailURL={"/exercise/exercise_page/"}
						checkBox={checkBox}
						item={item.name}
						index={item.id}
						path={item.path}
					/>
				) : null
			}
		</div>
	)
}