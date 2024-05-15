import styles from "./RoleListItem.module.css"
import ToggleButton from "../ToggleButton/ToggleButton"
/**
 * An PermissionListItem that can be used in an list view.
 * It displays the title of an role and a link to the permission page.
 * 
 * Props:
 *     	item @type {string} 		- Text displaying the title of the role
 * 		detailURL @type {string} 	- The base URL for roles
 * 		id @type {integer} 			- The ID for this particular role in database
 * 		index @type {integer} 		- The ID for this particular role on current page (Used for coloring)
 * 
 * Example usage:
 * 		<PermissionListItem
 * 			item={the role name}
 * 			id={The unique ID for an role, gets concatenated onto detailURL}
 * 			detailURL={the base URL for roles}
 * 			index={The index for the role in the list containing fetched roles}>
 * 
 * 		</PermissionListItem>
 * 
 * @author Team Mango (Group 4)
 * @since 2023-05-08
 * @version 1.0
 */
export default function PermissionListItem({ item, id, index, toggled, changeToggled }) {

	return (
		<div className={styles["role-list-container"]} data-testid="PermissionListItem" id={"PermissionListItem-" + id}>
			<div className={styles["role-list-header"]} style={{ backgroundColor: (index % 2 === 0) ? "var(--red-secondary)" : "var(--background)" }}>
				<div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
					<div style={{display: "flex", alignItems: "center"}}>
						<div className={styles["href-link"]} style={{ wordBreak: "break-word", textAlign: "left" }} data-testid="RoleListItem-item">{item}</div>
					</div>
					<div className={styles["flex-shrink-0"]} style={{display: "flex", alignItems: "center"}}>
						<ToggleButton 
							istoggled={toggled}
							id={item + "-toggleButton"}
							onClick={() => changeToggled(!toggled)}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}
