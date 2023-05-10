import { useState } from "react"

import Button from "../Button/Button"

import { List as HamburgerIcon, X as CloseIcon } from "react-bootstrap-icons"

import "./Navbar.css"
import { useNavigate } from "react-router"
/**
 * The navbar for the entire page.
 * 
 * Props:
 * 		testId @type {string}  - An id for its outermost div.
 *
 * Example usage:
 * 		<Navbar testId="test-id"/>
 *
 * @author Team Medusa
 * @version 1.0
 * @since 2023-05-02
 */
function Navbar({ testId }) {

	// Controls whether or not the menu is open. 
	const [open, setOpen] = useState(false)

	const navigate = useNavigate()

	const navigateAndClose = path => {
		navigate(path)
		setOpen(false)
	}

	return (
		<nav data-testid={testId} className={"common-navbar"}>
			<HamburgerIcon role="button" className="common-navbar-icon" size="48px" onClick={() => setOpen(true)}/>
			<img src="/ubk-logga.jpg" className="budo-logo"/>

			<div className={`common-navbar-sidebar p-4 ${open ? "open" : ""}`}>

				<CloseIcon role="button" className="common-navbar-icon" size="48px" onClick={() => setOpen(false)}/>

				<Button width={"100%"} onClick={() => navigateAndClose("/plan")}>
					<h1 style={{fontWeight: 500, fontSize: "32px"}}>Grupper</h1>
				</Button>

				<Button width={"100%"} onClick={() => navigateAndClose("/workout")}>
					<h1 style={{fontWeight: 500, fontSize: "32px"}}>Pass</h1>
				</Button>

				<Button width={"100%"} onClick={() => navigateAndClose("/exercise")}>
					<h1 style={{fontWeight: 500, fontSize: "32px"}}>Övningar</h1>
				</Button>

				<Button width={"100%"} onClick={() => navigateAndClose("/technique")}>
					<h1 style={{fontWeight: 500, fontSize: "32px"}}>Tekniker</h1>
				</Button>

				<Button width={"100%"} onClick={() => navigateAndClose("/admin")}>
					<h1 style={{fontWeight: 500, fontSize: "32px"}}>Admin</h1>
				</Button>

				<Button width={"100%"} onClick={() => navigateAndClose("/profile")}>
					<h1 style={{fontWeight: 500, fontSize: "32px"}}>Min sida</h1>
				</Button>

			</div>
		</nav>
	)

}
export default Navbar
