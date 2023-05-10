import "./Divider.css"

/**
 * A component displaying a title and horizontal line
 * 
 * @param id - component id
 * @param option determines the alignment and header for the divider. 
 *        Of either h1_center, h1_left, h2_center, h2_left or h2_middle
 * @param title - text to be displayed
 * @author Griffins (2023-05-03)
 * @author Chimera (2023-05-05)
 */
export default function Divider ({ id, option, title }) {
	switch(option) {
	case "h1_center":
		return  <div id = {id} className={"divider divider_center"}>
			<h1>{title}</h1>
		</div>
	case "h1_left":
		return  <div id = {id} className={"divider divider_left"}>
			<h1>{title}</h1>
		</div>
	case "h2_center":
		return  <div id = {id} className={"divider divider_center"}>
			<h2>{title}</h2>
		</div>

	case "h2_left":
		return  <div id = {id} className={"divider divider_left"}>
			<h2>{title}</h2>
		</div>
	case "h2_middle":
		return	<div id = {id} className={"divider divider_middle"}>
			<h2>{title}</h2>
		</div> 
	}
} 
