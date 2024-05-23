import { Link, useNavigate } from "react-router-dom"
import style from "./ListItem.module.css"

/**
 * This component is used to display the content of a list that is 
 * inside of a drop down menu.
 * @param {Object} item 	The activity such as techniques and exercises.
 * @param {JSX} checkBox 	If a checkbox is wanted, send it as a prop.
 * @param {String} id 		The id of the activity that is in the list.
 * @param {integer} index	The index of the item in the list.
 * @param {boolean} popUp	Determines whether the list item should redirect or open a popup on click
 *
 * @author	Team Tomato
 * @since	2024-05-20
 */

export default function ListItem({ item, checkBox, id, index, popUp}) {
	const navigate = useNavigate()
	const [isOpen, setIsOpen] = useState(false)

	// Determine background color based on index
	const bgColor = index % 2 === 0 ? "#F8EBEC" : "#FFFFFF"

	// Determines what happens on clicking on the name of different activities in a list.
	const handleOnClick = () => {
		if(!popUp){
			if(item.type === "technique") {
				navigate("/technique/"+ item.path)
			}
			if(item.type === "exercise") {
				navigate("/exercise/exercise_page/" + item.path)
			}
		}	else{
			setIsOpen(true)

		}
	}

	
	return (
		<div style={{ backgroundColor: bgColor }}>
			<PopupMini></PopupMini>
			
			{item.type === "technique" ? (
				
				<div 
					id={"technique-list-item-" + id}>
					<div className={style.innerDiv}>

						<div className={style.checkboxDiv}> 
							{checkBox} 
						</div>

						<div className={style.nameTag}> 
							<Link onClick={handleOnClick}>
								<p className={style.nameLink}>{item.name}</p> 
							</Link>
						</div>
					</div>
				</div>
				
			) : null}

			{item.type === "exercise" ? (
				<div  id={id}>
					<div className={style.innerDiv}>

						{checkBox}
						<div className={style.nameTag}>
							<Link onClick={handleOnClick}>
								<p className={style.nameLink}>{item.name}</p>
							</Link>
						</div>
						<div className={style.durationTag}> 
							<p>{item.duration} min</p>
						</div>
					</div>
					
				</div>
			) : null}
		</div>
	)
}
