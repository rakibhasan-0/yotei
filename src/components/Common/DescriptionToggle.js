/**
 * This class creates a toggle for descriptions.
 *
 * @author Hot-pepper (Group 7)
 */
import React from "react"

const DescriptionToggle = ({ isActive }) => {
	return (
		<div className='text-right' id="no-print">
			{isActive ? (
				<i className="bi-chevron-up m-2 h4"></i>
			) : (
				<i className="bi-chevron-down m-2 h4"></i>
			)}
		</div>
	)
}

export default DescriptionToggle