/**
 * A component to represent a user in the page for summering.
 * 
 *   Props:
 *    id
 *    id    @type {String}   An id for the component
 *    id    @type {String}   A name for the user
 *	<UserBoxGrading
 *	key={examinee.examinee_id}
 *	id={examinee.examinee_id}
 *	name={examinee.name} />
 *	))}
 * @author Pomegranate
 * @since 2024-05-09
 * @version 1.0 
 */
import React from "react"
import { Link } from "react-router-dom"
import { ChevronDown } from "react-bootstrap-icons"
import styles from "../../pages/Grading/GradingAfterComp.module.css"
const UserBoxGrading = ({ id, name }) => {
	const truncateName = (name) => {
		return name.length > 16 ? name.substring(0, 16) + "..." : name;
	  };

	return (
		<div>
			<div className={styles["technique-card"]} id={id}>
				<div className={styles["technique-info-container"]}>
					<div className={styles["technique-name-container"]}>
						<h5 className={styles["technique-name"]}>{truncateName(name)}</h5>
					</div>
					{/* if the technique object has count attribute then we will not render ChevronDown sign */}
					<div className={styles["technique-arrow-container"]}>
						{/*<span>/52</span> {/* Points are now to the left of the icon */}
						<Link to={`/grading/${id}/4`}>

							<ChevronDown />
						</Link>
					</div>
                
				</div>
			</div>
		</div>
	)
}

export default UserBoxGrading
