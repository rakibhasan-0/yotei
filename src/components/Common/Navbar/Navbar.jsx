import { useState, useRef,useContext} from "react"
import Button from "../Button/Button"
import { List as HamburgerIcon, X as CloseIcon } from "react-bootstrap-icons"
import styles from "./Navbar.module.css"
import { useNavigate } from "react-router"
import useOutsideClick from "../../../hooks/useOutsideClick"
import { isAdmin } from "../../../utils"
import { AccountContext } from "../../../context"

/**
 * The navbar for the entire page.
 * 
 * Props:
 * 		testId @type {string}  - An id for its outermost div.
 *
 * Example usage:
 * 		<Navbar testId="test-id"/>
 *
 * @author Team Medusa & Team Cyclops & Team Chimera
 * @version 3.0
 * @since 2023-05-24
 */
function Navbar({ testId }) {

	// Controls whether or not the menu is open. 
	const [open, setOpen] = useState(false)

	const navigate = useNavigate()
	const context = useContext(AccountContext)

	const navigateAndClose = path => {
		navigate(path)
		setOpen(false)
	}

	const navbarRef = useRef(null)
	useOutsideClick(navbarRef, () => setOpen(false))

	function disableScroll() {
		document.body.style.overflow = "hidden"
	}

	function enableScroll() {
		document.body.style.overflow = "scroll"
	}

	return (
		<nav data-testid={testId} className={styles.commonNavbar} ref={navbarRef}>
			<HamburgerIcon role="button" className={styles.commonNavbarIcon} onClick={() => {setOpen(true), disableScroll()}}/>
			<img src="/ubk-logga.jpg" className={styles.budoLogo} />

			<div className={`${styles.commonNavbarSidebar} p-4  ${open ? styles.open : ""}`}>

				<CloseIcon role="button" className={styles.commonNavbarIconClose} onClick={() => {setOpen(false), enableScroll()}} />

				<Button width={"100%"} onClick={() => navigateAndClose("/plan")}>
					<h1 className={styles.commonNavbarButton}>Grupper</h1>
				</Button>

				<Button width={"100%"} onClick={() => navigateAndClose("/workout")}>
					<h1 className={styles.commonNavbarButton}>Pass</h1>
				</Button>

				<Button width={"100%"} onClick={() => navigateAndClose("/exercise")}>
					<h1 className={styles.commonNavbarButton}>Övningar</h1>
				</Button>

				<Button width={"100%"} onClick={() => navigateAndClose("/technique")}>
					<h1 className={styles.commonNavbarButton}>Tekniker</h1>
				</Button>

				{ isAdmin(context) ? 
					<Button width={"100%"} onClick={() => navigateAndClose("/admin")}>
						<h1 className={styles.commonNavbarButton}>Admin</h1>
					</Button>
					:<></>
				}

				<Button width={"100%"} onClick={() => navigateAndClose("/profile")}>
					<h1 className={styles.commonNavbarButton}>Min sida</h1>
				</Button>

			</div>
			<div className={`${styles.boxShadowBackground} ${open ? styles.boxShadowBackgroundOpen : styles.boxShadowBackgroundClosed}`} onClick={() => {setOpen(false), enableScroll()}}/>
		</nav>
	)
}
export default Navbar
