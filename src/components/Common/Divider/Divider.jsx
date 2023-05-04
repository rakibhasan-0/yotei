import "./Divider.css"
/**
 * A component displaying a title and horizontal line
 * 
 * @param id - component id
 * @param option determines the alignment and header for the divider. 
 *        Of either h1_center, h1_left, h2_center or h2_left
 * @param title - text to be displayed
 * @author Griffins (2023-05-03)
 */
export default function Divider ({ id, option, title }) {


	function pickStyle () {
		switch(option) {
		case "h1_center":
			return  <div id = {id} className={"divider_h1_center"}>
				<h1>{title}</h1>
			</div>

		case "h1_left":
			return  <div id = {id} className={"divider_h1_left"}>
				<h1>{title}</h1>
			</div>

		case "h2_center":
			return  <div id = {id} className={"divider_h2_center"}>
				<h2>{title}</h2>
			</div>

		case "h2_left":
			return  <div id = {id} className={"divider_h2_left"}>
				<p>{title}</p>
			</div>

		default:
			console.log("pick a style")
		}
	}

	return (
		pickStyle()
	)
} 
