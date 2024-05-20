import React, { useState } from "react"
import DropDown from "../../Common/List/Dropdown"
import styles from "./ListPicker.module.css"


/**
 * FilterRow represents a row in the dropdown menu of the filter component on the page workout.
 * 
 * @returns html div for the filter row.
 * 
 * @author Tomato 
 * @since 2024-05-03
 */


export default function ListPicker({ onFilterChange }) {
	const filterOptions = [
		{ label: "Mina listor" },
		{ label: "Delade med mig" },
		{ label: "Publika listor" }
	]
	const [filter, setFilter] = useState(filterOptions)

	const onSelect = (option) => {
        setFilter(prevFilter => {
            if (prevFilter.includes(option)) {
                // If the option is already included, remove it
                const newFilter = prevFilter.filter(opt => opt !== option);
                onFilterChange(newFilter);
                return newFilter;
            } else {
                // If the option is not included, add it
                const newFilter = [...prevFilter, option];
                onFilterChange(newFilter);
                return newFilter;
            }
        })
    }
	
	return (
		<div className={styles.listPicker}>
			<DropDown
				text={filter.label}
				className={styles.filterText}
				id="list-filter-workout" centered={true}
				autoClose={true}
			>

				<div className={styles.filterBorder}>
					{filterOptions.map((option, index) => (

						<div className={styles.filterItems} id={"listFilterItem"}
							key={index}
							onClick={() => {
								onSelect(option)
							}}>
							<p className={styles.listItemText}>{option.label}</p>
						</div>
					))}
				</div>

			</DropDown>
		</div>
	)
}
