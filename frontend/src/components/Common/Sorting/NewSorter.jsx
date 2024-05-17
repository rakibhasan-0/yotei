import React, { useState } from "react"
import style from "./NewSorter.module.css"
import "../BeltPicker/BeltPicker.module.css"
import { ChevronDown, ChevronRight } from "react-bootstrap-icons"

/**
 * A component for sorting items based on selected options.
 *
 * @component
 * @param {string} id - The unique identifier for the sorter.
 * @param {boolean} selected - Indicates if the sorter is selected.
 * @param {Function} onSortChange - The callback function to handle sort changes.
 * @param {Array} options - The array of sorting options.
 * @returns {JSX.Element} The NewSorter component.
 * 
 * @author Tomato (Grupp 6)
 * @since 2024-03-16 
 */
export default function NewSorter({ id, selected, onSortChange, options }) {
	const [isOpen, setIsOpen] = useState(false)

	/**
     * Toggles the dropdown menu.
     */
	const toggleDropdown = () => setIsOpen(!isOpen)

	/**
     * Handles the sort change event.
     * @param {Object} option - The selected sort option.
     */
	const handleSortChange = (option) => {
		onSortChange(option)
		toggleDropdown()
	}

	return (
		<div id={id} className={style.sortMenuText} style={{ display: "flex", flexDirection: "row", margin: "0" }}>
			<p onClick={toggleDropdown} style={{ fontWeight: "bold" }}>
                Sortera efter
				{isOpen ? <ChevronDown size={18} style={{ marginLeft: "5px" }} /> : <ChevronRight size={18} style={{ marginLeft: "5px" }} />}
			</p>
			{isOpen && (
				<div style={{ position: "absolute" }}>
					{options.map((option) => (
						<p
							key={option.value}
							onClick={() => handleSortChange(option)}
							className={`
								${selected.label === option.label ? style.selected : ""}
							`}
						>
							{option.label}
						</p>
					))}
				</div>
			)}
		</div>
	)
}