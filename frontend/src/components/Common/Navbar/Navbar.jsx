import { useState, useEffect ,useContext} from "react"
import Button from "../Button/Button"
import { List as HamburgerIcon, X as CloseIcon , Hammer as AdminIcon, Person as UserIcon} from "react-bootstrap-icons"
import styles from "./Navbar.module.css"
import { useNavigate } from "react-router"
import { isAdminUser } from "../../../utils"
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
 * Changes version 4.0:
 *     	merged techniques and exercise buttons, 
 * 		this new button routs to activity page.
 * 
 * Update 2024-05-22 Team Mango: changed check for admin page according to new permissions.  
 *
 * @author Team Medusa & Team Cyclops & Team Tomato & Team Coconut & Team Kiwi & Team Mango
 * @version 4.0
 * @since 2024-05-02
 */
function Navbar({ testId }) {

	const [open, setOpen] = useState(false)
	const navigate = useNavigate()
	const context = useContext(AccountContext) 

	const navigateAndClose = (path, data) => {
		setOpen(false)
		navigate(path, data)
	}
	
	useEffect(() => {
		document.body.style.overflowY = open ? "hidden" : "visible"
		document.body.style.touchAction = open ? "none" : "auto"
	}, [open])

	return (
		<nav data-testid={testId} className={styles.commonNavbar}>
			<HamburgerIcon role="button" className={styles.commonNavbarIcon} onClick={() => {setOpen(true)}}/>
			<img src="/ubk-logga.jpg" className={styles.budoLogo} onClick={() => navigateAndClose("/")} />

			<div className={`${styles.commonNavbarSidebar} p-4  ${open ? styles.open : ""}`}>

				<div className={styles.closeAndUserIconsWrapper}>
					<CloseIcon role="button"  className={styles.closeIconWrapper} onClick={() => {setOpen(false)}} />
					<Button  onClick={() => navigateAndClose("/profile")}>
						<UserIcon className={styles.commonNavbarUserIcon} />
					</Button>
				</div>


				<div className={styles.btnWrapper}>
					<Button width={"100%"} onClick={() => navigateAndClose("/plan")}>
						<h1 className={styles.commonNavbarButton}>Planering</h1>
					</Button>

					<Button width={"100%"} onClick={() => navigateAndClose("/workout")}>
						<h1 className={styles.commonNavbarButton}>Pass</h1>
					</Button>

					<Button width={"100%"} onClick={() => navigateAndClose("/activity",  {state: {clearSearchText: true}})}>
						<h1 className={styles.commonNavbarButton}>Tekniker & Övningar</h1>
					</Button>

					<Button width={"100%"} onClick={() => navigateAndClose("/groups",  {state: {clearSearchText: true}})}>
						<h1 className={styles.commonNavbarButton}>Grupper</h1>
					</Button>

					<Button width={"100%"} onClick={() => navigateAndClose("/grading")}>
						<h1 className={styles.commonNavbarButton}>Gradering</h1>
					</Button>
				</div>
				

				{ isAdminUser(context) ? 
					<Button width={"min-content"} onClick={() => navigateAndClose("/admin")}>
						<AdminIcon role="button" className={styles.commonNavbarIconAdmin}  onClick={() => navigateAndClose("/admin")} />
					</Button>
					
					:<></>
				}
			</div>
			<div className={`${styles.boxShadowBackground} ${open ? styles.boxShadowBackgroundOpen : styles.boxShadowBackgroundClosed}`} onClick={() => {setOpen(false)}}/>
		</nav>
	)
}
export default Navbar
