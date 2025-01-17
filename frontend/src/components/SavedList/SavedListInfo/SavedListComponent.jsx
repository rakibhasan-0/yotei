import SavedActivityListItem from "./SavedListItemComponent.jsx"
import styles from "./SavedListComponent.module.css"
import { useState } from "react"

/**
 * A container component for ActivityList items. Each item represents a row in the list.
 * Props:
 * 		activities @type {Array} - A list of activities.
 *
 * @author Tomato (Group 6)
 * @since 2024-05-21 Kiwi, Updated Uniform props comment
 * @updated 2024-05-29
 */
export default function SavedActivityList({ activities, listCreateInfoDispatchProp = null }) {
	const [isCollapsed, setIsCollapsed] = useState(false)

	const rotatedIcon = {
		transform: "rotate(180deg)",
		fontSize: "16px",
		cursor: "pointer",
	}
	return (
		<>
			<fieldset className={setPadding() + " my-3 "}>
				<legend style={{ textAlign: "left" }}>
					<div
						className="d-flex align-items-center justify-content-center"
						onClick={() => setIsCollapsed(!isCollapsed)}
					>
						<i style={isCollapsed ? { fontSize: "16px" } : rotatedIcon} className={"bi bi-chevron-down"} />
					</div>
				</legend>
				{!isCollapsed &&
					activities.map((activity, index) => (
						<SavedActivityListItem
							index={index}
							key={index}
							activity={activity}
							listCreateInfoDispatchProp={listCreateInfoDispatchProp}
						/>
					))}
			</fieldset>
		</>
	)
}

function setPadding() {
	const paddingY = "pb-2"
	return `container ${styles["list-activity-list"]} ` + paddingY
}
