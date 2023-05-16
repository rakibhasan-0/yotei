import React, { useEffect } from "react"
import { Outlet, Link } from "react-router-dom"
import Navbar from "react-bootstrap/Navbar"
import "./Nav.css"
import Button from "react-bootstrap/Button"
import { useState, useContext } from "react"
import ClickAwayListener from "react-click-away-listener"
import { AccountContext } from "../../context"
import { isAdmin } from "../../utils"

/**
 * Nav bar for app
 *
 * @author Kebabpizza (Grupp 8),  Team Quattro Formaggi (Group 1)
 */
const Nav = () => {
	let oldScrollY = window.scrollY
	const [menuOpen, setMenuOpen] = useState(false)
	const [userName, setUserName] = useState("")
	const context = useContext(AccountContext)
	const { token, userId} = useContext(AccountContext)    
    
	useEffect(() => {
		fetch(`/user/getname/${userId}`, {headers: {token}, method: "GET"})
			.then(resp => resp.json())
			.then(data => setUserName(data.username))
	})


	/**
     * Clamps a value between a min and a max value.
     * @param {Number} num value to clamp
     * @param {Number} min min value
     * @param {Number} max max value
     * @returns A clamped value between min and max value
     */
	const clamp = (num, min, max) => Math.min(Math.max(num, min), max)

	/**
     * Opens the menu and set the menu on the top
     * off the screen.
     */
	const toggleMenu = () => {
		setMenuOpen(!menuOpen)
		if (!menuOpen) {
			document.getElementById("nav-bar").style.top = "0px"
		}
	}

	/**
     * When scrolling down the nav bar will hide if
     * the menu is not open. When scrolling up
     * the nav bar will show again.
     */
	window.onscroll = () => {
		if (menuOpen) return
		const scrollYDirection = oldScrollY - window.scrollY
		oldScrollY = window.scrollY
		const nextPosition = clamp(document.getElementById("nav-bar").offsetTop + scrollYDirection, -document.getElementById("nav-bar").offsetHeight, 0)
		document.getElementById("nav-bar").style.top = `${nextPosition}px`
	}

	return (
		<>
			<nav>
				<div id='nav-space'></div>
				<Navbar id="nav-bar" className='nav-absolute' expand="lg">
					<ClickAwayListener onClickAway={() => setMenuOpen(false)}>
						<div>
							<Button id="menuButton" size="lg" variant="inline" onClick={() => toggleMenu()}>
								<img src="/menu.svg" alt="menu icon"/>
							</Button>
							{menuOpen && (
								<ul className={"menu"}>
									<li className={"menu-item"}>
										<Link onClick={() => setMenuOpen(false)} to="/plan">Grupp</Link>
									</li>
									<li className={"menu-item"}>
										<Link onClick={() => setMenuOpen(false)} to="/workout">Pass</Link>
									</li>
									<li className={"menu-item"}>
										<Link onClick={() => setMenuOpen(false)} to="/exercise">Övningar</Link>
									</li>
									<li className={"menu-item"}>
										<Link onClick={() => setMenuOpen(false)} to="/technique">Tekniker</Link>
									</li>
									{ isAdmin(context) && 
										<li className={"menu-item"}>
											<Link onClick={() => setMenuOpen(false)} to="/admin">Admin</Link>
										</li>
									}
									<li className={"menu-item"}>
										<Link onClick={() => setMenuOpen(false)} to="/about">About</Link>
									</li>
									<li className={"menu-item"}>
										<Link onClick={() => setMenuOpen(false)} to="/profile">Min Sida</Link>
									</li>
								</ul> 
							)}
						</div>
					</ClickAwayListener>
					<div className={"log-info"}>Inloggad som: <a className={"log-info-user"} href={"/profile"}> {userName}</a></div>
					<Link id="plan-link" to="/plan">
						<img id="logo" src="/ubk-logga.jpg" alt="logga" />
					</Link>
				</Navbar>
			</nav>

			<Outlet/>
		</>
	)
}

export default Nav
