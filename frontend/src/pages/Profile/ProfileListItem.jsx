/**
 * This class is responsible to create the UI for a profile List-item in the list.
 * It's made up by one stripe row with the name and an arrow and redirects the user
 * to the appropriate list. Allows for custom logo to the rightmost of the list item
 *
 *
 * @author Tomtato (Group 6)
 * @since 2024-05-02
 * @version 1.0
 */
import styles from "./ProfileListItem.module.css"
import { Link } from "react-router-dom"
import { Dot } from "react-bootstrap-icons"
import { ChevronRight } from "react-bootstrap-icons"
import { AccountContext } from "../../context"
import { useContext} from "react"


export default function ProfileListItem({ item, Icon }) {
	//Commented due to linter
	//const { userId, token } = useContext(AccountContext)
	const { userId} = useContext(AccountContext)

	return (
		<div className={`${styles["profile-item-row"]}`}>
			<Link to={item.id==-1?("/profile/favouriteWorkouts"): (`/profile/list/${item.id}`)}>
				<div className={"row align-items-center font-weight-bold px-3 py-2"}>
					<div className={"col-2 "}>
						{/* Handles both Icons and JSX elements */}
						{typeof Icon === "string" ? (
							<img className={`${styles["profile-text"]}`} src={Icon} alt="Icon" />
						) : (
							Icon
						)}
					</div>
					<div className={`col-8 ${styles["profile-text"]}`}>
						<div className="text-left">
							{item.name}
							{item.id == -1 ? (
								<p className="mb-0">{item.size} pass</p>
							) : (
								<p className="mb-0">
									{item.author.userId === userId ? (
										<>av mig <Dot /> {item.size} aktiviter</>
									) : (
										<>av {item.author.username} <Dot /> {item.size} aktiviter</>
									)}
								</p>
							)}
						</div>
					</div>
					<div className="col-2 pr-0">
						<ChevronRight size={36} />
					</div>
				</div>
			</Link>
		</div>
	)
}
