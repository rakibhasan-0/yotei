import { useState } from "react"
import styles from "./RoleListItem.module.css"
import ToggleButton from "../ToggleButton/ToggleButton"

/**
 * A PermissionListItem that can be used in a list view.
 * It displays the title of a role and a link to the permission page.
 * Props:
 * 		item @type {string}         - Text displaying the title of the role
 * 		id @type {integer}          - The ID for this particular role in database
 * 		index @type {integer}       - The ID for this particular role on current page (Used for coloring)
 * 		toggled @type {boolean}     - The toggle state for the permission
 * 		changeToggled @type {function} - Function to handle the toggle change
 * 
 * Example usage:
 * 		<PermissionListItem
 * 			item={the role name}
 * 			id={The unique ID for a role, gets concatenated onto detailURL}
 * 			index={The index for the role in the list containing fetched roles}
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
		<div className={styles["role-list-container"]} data-testid="PermissionListItem" id={"PermissionListItem-" + id}>
			<div 
				className={styles["role-list-header"]} 
				style={{ backgroundColor: (id % 2 === 0) ? "var(--red-secondary)" : "var(--background)" }}
				onClick={handleCardClick}
			>
				<div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
					<div style={{display: "flex", alignItems: "center"}}>
						<div className={styles["href-link"]} style={{ wordBreak: "break-word", textAlign: "left" }} data-testid="RoleListItem-item">{item}</div>
					</div>
					<div className={styles["flex-shrink-0"]} style={{display: "flex", alignItems: "center"}}>
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
					className={styles["role-list-description"]} 
					style={{ backgroundColor: (id % 2 === 0) ? "var(--red-secondary)" : "var(--background)" }} 
					onClick={handleCardClick}>
					{description}
				</div>
			)}
		</div>
	)
}