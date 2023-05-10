import { useState } from "react"
import DisplayCreatedWorkouts from "../../components/Workout/DisplayCreatedWorkouts.js"
import DisplayFavoriteWorkouts from "../../components/Workout/DisplayFavoriteWorkouts.js"
import MyAccount from "../../components/Profile/MyAccount.js"
import "./Profile.css"

/**
 * Used to show user specific information.
 * Sorts and displays different pages as a component of a tab. 
 * 
 * @author Team Hot Pepper (Group 7) 2022-05-13
 */
export default function Profile() {
	const [toggleState, setToggleState] = useState(1)

	/*Sets the active tab.*/
	const toggleTab = (index) => {
		setToggleState(index)
	}

	/*If tab is active, toggles className to active.*/
	const getActiveClass = (index, className) =>
		toggleState === index ? className : ""

	/*Handles active tab and content.*/ 
	return (        
		<div className="card bg-light center mt-10" id="profile-tab-container">
			<ul className="tab-bar d-inline-flex">
				<li className={`page-tab${getActiveClass(1,"-active")}`} onClick={() => toggleTab(1)}>
					<p>Mitt konto</p>
				</li>
				<li className={`page-tab${getActiveClass(2,"-active")}`} onClick={() => (toggleTab(2))}>
					<p>Favoritpass</p>
				</li>
				<li className={`page-tab${getActiveClass(3,"-active")}`} onClick={() => toggleTab(3)}>
					<p>Mina pass</p>
				</li>
				<li className={`page-tab${getActiveClass(4,"-active")}`} onClick={() => toggleTab(4)}>
					<p>Inställningar</p>
				</li>
			</ul>
			<div className="page-content-container card bg-white">
				<div id="tab1"  className={`content${getActiveClass(1,"-active")}`}>
					<MyAccount/>
				</div>
				<div id="tab2"  className={`content${getActiveClass(2,"-active")}`}>
					<DisplayFavoriteWorkouts/>
				</div>
				<div id="tab3" className={`content${getActiveClass(3,"-active")}`}>
					<DisplayCreatedWorkouts/>
				</div>
				<div id="tab4" className={`content${getActiveClass(4,"-active")}`}>
					<h2>Inställningar</h2>
				</div>
			</div>
		</div>
	)
}    