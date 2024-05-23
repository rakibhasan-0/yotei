import styles from "./RoleListItem.module.css"
/**
 * An RoleListItem that can be used in an list view.
 * It displays the title of an role.
 * 
 * Props:
 *    	item @type {string} - Text displaying the title of the role
 *         index @type {integer} - The ID for this particular role on current page (Used for coloring)
 * 
 * Example usage:
 *         <RoleListItem
 *            item={the role name}
 *           index={The index for the role in the list containing fetched roles}>
 * 
 *        </RoleListItem>
 * 
 * @author Team Mango (Group 4)
 * @since 2024-05-22
 * @version 1.0
*/
export default function RoleListItem({ item, index }) {

	return (
		<div className={styles["role-list-container"]} data-testid="RoleListItem" id={"RoleListItem-" + item}>
			<div className={styles["role-list-header"]} style={{ backgroundColor: (index % 2 === 0) ? "var(--red-secondary)" : "var(--background)" }}>
				<div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
					<div style={{display: "flex", alignItems: "center"}}>
						<div className={styles["href-link"]} style={{ wordBreak: "break-word", textAlign: "left" }} data-testid="RoleListItem-item">{item}</div>
					</div>
						
				</div>
			</div>
		</div>
	)
}