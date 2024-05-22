import React, { useState, useEffect } from "react"
import DropDown from "../../Common/List/Dropdown"
import styles from "./ListPicker.module.css"
import CheckBox from "../../Common/CheckBox/CheckBox"


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
	const [filter, setFilter] = useState([])



	useEffect(() => {
		onFilterChange(filter)
	}, [filter, onFilterChange])



	const onSelect = (option) => {
		setFilter(prevFilter => {
			if (prevFilter.some(opt => opt.label === option.label)) {
				// If the option is already included, remove it
				return prevFilter.filter(opt => opt.label !== option.label)
			} else {
				// If the option is not included, add it
				return [...prevFilter, option]
			}
		})
	}

	return (
		<div className={styles.listPicker}>
			<DropDown
				text={"Listor"}
				className={styles.filterText}
				id="list-filter-workout" centered={true}
				autoClose={false}
			>
				<div className={styles.filterBorder}>
					{filterOptions.map((option, index) => (
						<label className={`${styles.filterItems} filterItems`} key={index}>
							<CheckBox label={option.label} checked={filter.some(opt => opt.label === option.label)} onClick={() => onSelect(option)} />
						</label>
					))}
				</div>
			</DropDown>
		</div>
	)
}