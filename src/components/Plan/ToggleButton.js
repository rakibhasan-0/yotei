import React, {useState} from "react"
import "./PlanNav.css"

/**
 * Navigation bar for plan page.
 * @author Hawaii(Grupp 3) Calzone(Grupp 4)
 */

/**
 * Functional component for the toggle button in the plan's dropdown menu.
 * @param {*} props the input parameter
 * @returns the whole button
 */
const ToggleButton = (props) => {

	const [isActive, setIsActive] = useState(true)

	/**
     * Handles what happens when button is clicked. Calls props function which triggers in DropDownPlan.
     */
	const onToggleClick = (isActive) => {
		setIsActive(!isActive)
		props.toggle(isActive)
	}

	return (
		<>
			<div className="row" onClick={() => onToggleClick(isActive)}>
            
				<div className="text-right col">
					<h5 id="toggleTitle">Välj alla</h5>
				</div>
            
				<div className='text-right' id="toggleButton">{!isActive ?


					<div>
						<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-toggle-on" viewBox="0 0 16 16">
							<path d="M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10H5zm6 9a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/>
						</svg>
					</div>

					:

					<div>
						<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-toggle-off" viewBox="0 0 16 16">
							<path d="M11 4a4 4 0 0 1 0 8H8a4.992 4.992 0 0 0 2-4 4.992 4.992 0 0 0-2-4h3zm-6 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8zM0 8a5 5 0 0 0 5 5h6a5 5 0 0 0 0-10H5a5 5 0 0 0-5 5z"/>
						</svg>
					</div>

				}
				</div>
			</div>
		</>
	)

}

export default ToggleButton