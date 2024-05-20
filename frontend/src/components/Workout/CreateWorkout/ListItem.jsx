import style from "./ListItem.module.css"
/**
 * This component is used to display the content of a list that is 
 * inside of a drop down menu.
 * 
 * @param {Object} item 	The activity such as techniques and exercises.
 * @param {JSX} checkBox 	If a checkbox is wanted, send it as a prop.
 * @param {String} id 		The id of the activity that is in the list.
 * 	INDEXXXXXXXNXNXNXNXNXNXNXNNXNXN
 *
 * @author	Team Tomato
 * @since	2024-05-20
 */
export default function ListItem({ item, checkBox, id, index}) {

	// Determine background color based on index
	const bgColor = index % 2 === 0 ? "#F8EBEC" : "#FFFFFF"

	return (
		<div style={{ backgroundColor: bgColor }}>
			
			{item.type === "technique" ? (
				
				<div 
					id={"technique-list-item-" + id}>
					<div className={style.innerDiv}>
						<div className={style.checkboxDiv}> {checkBox} </div>
						<div className={style.nameTag}> <p>{item.name}</p> </div>

					</div>
				</div>
				
			) : null}

			{item.type === "exercise" ? (
				<div  id={id}>
					<div className={style.innerDiv}>

						{checkBox}
						<div className={style.nameTag}> <p>{item.name}</p> </div>
						<div className={style.durationTag}> <p>{item.duration} min</p> </div>
					</div>
					{/* <a href={"/exercise/exercise_page/" + id}>More Details</a> */}
				</div>
			) : null}
		</div>
	)
}