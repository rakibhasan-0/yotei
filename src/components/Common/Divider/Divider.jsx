import style from "./Divider.module.css"

/**
 * A component displaying a title and horizontal line
 * 
 * Props:
 * 		id     @type {String} component id
 * 		option @type {String} determines the alignment and header for the divider. 
 *       					  Either h1_center, h1_left, h2_center, h2_left, h2_middle or p_left
 * 		title  @type {String} text to be displayed on the divider
 * 
 * Example usage:
 * 
 * <Divider id = 'divider-example' option= 'h1_center' title = 'example divider'/>
* 
 * @author Griffins
 * @since 2023-05-03
 * @version 1.1
 * @updated 2023-05-05 Chimera
 * @updated 2023-05-23 Minotaur 
 * @updated 2023-05-24 Phoenix
 * @updated 2023-05-30 Chimera, updated documentation
 */
export default function Divider ({ id, option, title }) {
	switch(option) {
	case "h1_center":
		return  <div id = {id} className={`${style.divider} ${style.dividerCenter}`}>
			<h1>{title}</h1>
		</div>
	case "h1_left":
		return  <div id = {id} className={`${style.divider} ${style.dividerLeft}`}>
			<h1>{title}</h1>
		</div>
	case "h2_center":
		return  <div id = {id} className={`${style.divider} ${style.dividerCenter}`}>
			<h2>{title}</h2>
		</div>
	case "h2_left":
		return  <div id = {id} className={`${style.divider} ${style.dividerLeft}`}>
			<h2>{title}</h2>
		</div>
	case "h2_middle":
		return	<div id = {id} className={`${style.divider} ${style.dividerMiddle}`}>
			<h2>{title}</h2>
		</div> 

	case "p_left":
		return  <div id = {id} className={"divider divider_left p_tagg"}>
			<p className="p_tagg">{title}</p>
		</div>
	}
} 
