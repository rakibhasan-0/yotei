
import styles from "./TagUsagePopup.module.css"
/**
 * Taginput is a component to use for choosing tags and displaying chosen tags. 
 * 
 * Props:
 *     id @type {string} - Sets the id of the taginput. 
 * 	   addedTags @type {List of tags} - The list of choosen tags.
 *     setAddedTags @type {useState} - Sets the list of chosen tags.
 * 	   isNested @type {boolean} - True if nested
 * 	   itemName @type {String} - Name of item
 *
 * Example usage:
 *  
 *	const [addedTags, setAddedTags] = useState([])
 *		return (
 *			<div>
 *				<TagInput id ="tagChooser" addedTags={addedTags} setAddedTags={setAddedTags}/>
 *			</div>
 *		)
 *
 * @author Team Fig?(Group 4)
 * @version 1.0
 * @since 2024-05-17
 * @updated 2024-05-29 Kiwi, Updated props comment
 */

export default function TagUsagePopup (usage) {
	usage = usage.usage
	return <div className={styles["usage-text"]}>
        Taggen används på:
		<br/>

		{usage.exercises > 0 ? <> <span className={styles["usage-number"]}>{usage.exercises}</span> övning{usage.exercises > 1 ? "ar" : ""}
			<br/> </> : null}
		{usage.techniques > 0 ? <><span className={styles["usage-number"]}>{usage.techniques}</span> teknik{usage.techniques > 1 ? "er" : ""}
			<br/>  </> : null}
		{usage.workouts > 0 ? <><span className={styles["usage-number"]}>{usage.workouts}</span> pass
			<br/>	</> : null}
	</div>
}
