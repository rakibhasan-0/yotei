/**
 * This class creates a toggle for descriptions.
 *
 * @author Hot-pepper (Group 7)
 */
import React from "react"

const DescriptionToggle = ({ isActive }) => {
	return (
		<div className='text-right' id="no-print">
			<i className={isActive ? "bi-chevron-up h4" : "bi-chevron-down h4"} style={{transition: "0.2s"}}/>
		</div>
	)
}

export default DescriptionToggle