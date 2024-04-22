import Button from './../../Button/Button.jsx'
import { Sliders } from "react-bootstrap-icons"
import FilterCounter from './FilterCounter.jsx'


/**
 * A type of button used when filtering. It shows a number that indicates the number
 * of active filters. 
 * 
 *   props:
 * 		showFilter	 @type {Function} - A function that is activated when the button is pressed.
 * 		buttonToggle @type {Boolean}  - Is true when the button is pressed.
 * 		numFilters   @type {integer}  - The number of filters activated.
 * 
 * Example usage: 
 * 
 *	{numFilters !== 0 && 
 *	<FilterCounter
 *		numFilters = {2}/>}
 *	<Button
 *		id={"showing-two-active-fitlers"}
 *		onClick={showFilter}
 *		outlined={false}
 * 		isToggled={buttonToggle}
 *		width='40px'>
 *		<Sliders/>	
 *	</Button>
 *
 * @author Tomato (Group 6)
 * @version 1.0
 * @since 2024-04-22
 */
export default function FilterButton({showFilter, buttonToggle, numFilters}) {

	return(
		<div>
			{numFilters !== 0 && 
			<FilterCounter
				numFilters = {numFilters}/>}
			<Button
				id={"filter-button"}
				onClick={showFilter}
				outlined={false}
				isToggled={buttonToggle}
				width='40px'>
				<Sliders/>	
			</Button>
		</div>
	);
}
