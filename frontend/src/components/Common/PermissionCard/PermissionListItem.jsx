import { useState } from "react"
import { ChevronDown } from "react-bootstrap-icons"
import styles from "./PermissionListItem.module.css"
import ToggleButton from "../ToggleButton/ToggleButton"

/**
 * A PermissionListItem that can be used in a list view.
 * It displays the title of a permission and a toggle button.
 * Props:
 * 		item @type {string}         - Text displaying the title of the permission
 * 		id @type {integer}          - The ID for this particular permission in database
 * 		index @type {integer}       - The ID for this particular permission on current page (Used for coloring)
 * 		toggled @type {boolean}     - The toggle state for the permission
 * 		changeToggled @type {function} - Function to handle the toggle change
 * 
 * Example usage:
 * 		<PermissionListItem
 * 			item={the permission name}
 * 			id={The unique ID for a permission}
 * 			description={the permission description}
 * 			index={The index for the permission in the list containing fetched permissions}
 * 			toggled={true/false}
 * 			changeToggled={function to change toggle state}
 * 		/>
 * @since 2024-05-08
 * @version 1.0
 */
 
export default function PermissionListItem({ item, id, description, toggled, changeToggled }) {
	const [expanded, setExpanded] = useState(false)

	const handleCardClick = () => {
		setExpanded(!expanded)
	}

	return (
		<div className={styles["permission-list-container"]} data-testid="PermissionListItem" id={"PermissionListItem-" + id}>
			<div 
				className={styles["permission-list-header"]} 
				style={{ backgroundColor: (id % 2 === 0) ? "var(--red-secondary)" : "var(--background)" }}
				onClick={handleCardClick}
			>
				<div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
					<div style={{display: "flex", alignItems: "center"}}>
						<div className={styles["href-link"]} style={{ wordBreak: "break-word", textAlign: "left" }} data-testid="PermissionListItem-item" dangerouslySetInnerHTML={{ __html: item.replace(/egna/g, "<b>egna</b>").replace(/alla/g, "<b>alla</b>") }}></div>
					</div>
					<div className={styles["flex-shrink-0"]} style={{display: "flex", alignItems: "center"}}>
						<ChevronDown 
							size={24} 
							style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", marginRight: "1rem"}}
						/>
						<ToggleButton 
							isButtonToggled={toggled}
							id={item + "-toggleButton"}
							onClick={(e) => {
								e.stopPropagation() // Prevent click event from propagating to the parent div
								changeToggled(!toggled)
							}}
						/>
					</div>
				</div>
			</div>
			{expanded && (
				<div 
					className={styles["permission-list-description"]} 
					style={{ backgroundColor: (id % 2 === 0) ? "var(--red-secondary)" : "var(--background)" }} 
					onClick={handleCardClick}>
					{description}
				</div>
			)}
		</div>
	)
}