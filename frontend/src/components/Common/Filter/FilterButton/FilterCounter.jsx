import style from "./FilterCounter.module.css"

/**
 * This is the component that shows how many filters that are active when the filterbutton
 * is filtering. The number showing indicates how many filters are active.
 * 
 * Props:
 *		numFilters	@type {integer}   	- The number of active filters.
 *
 * Example usage: 
 * 
 *	{numFilters !== 0 && 
 *	<FilterCounter
 *		numFilters = {5}/>}
 *	<Button
 *		id={"showing-five-active-fitlers"}
 *		onClick={showFilter}
 *		outlined={false}
 * 		isToggled={buttonToggle}
 *		width='40px'>
 *		<Sliders/>	
 *	</Button>
 *
 *
 * @author Tomato (Group 6)
 * @version 1.0
 * @since 2024-04-22
 */
export default function FilterCounter({numFilters}) {
	
	return(
		<div className={style.outerCircle}>
			<div className={style.innerCircle}>
				<p className=	{numFilters <= 9 ? style.textLessThanNine : style.textMoreThanNine}>
					{numFilters <= 9 ? numFilters : "9+"}</p>
			</div>
		</div>
	)
}

