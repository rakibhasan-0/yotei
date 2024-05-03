import { useState, useEffect ,useContext} from "react"
import Button from "../Button/Button"
import { List as HamburgerIcon, X as CloseIcon } from "react-bootstrap-icons"
import styles from "./Navbar.module.css"
import { useNavigate } from "react-router"
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
 * @author Team Medusa & Team Cyclops & Team Tomato & Team Coconut
 * @version 3.0
 * @since 2024-04-24
 */
function Navbar({ testId }) {

	const [open, setOpen] = useState(false)
  const [isExaminationEnabled] = useState(false) // FEATURE TOGGLE
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

				<CloseIcon role="button" className={styles.commonNavbarIconClose} onClick={() => {setOpen(false)}} />

				<Button width={"100%"} onClick={() => navigateAndClose("/plan")}>
					<h1 className={styles.commonNavbarButton}>Planering</h1>
				</Button>

				<Button width={"100%"} onClick={() => navigateAndClose("/groups")}>
					<h1 className={styles.commonNavbarButton}>Grupper</h1>
				</Button>

				<Button width={"100%"} onClick={() => navigateAndClose("/workout")}>
					<h1 className={styles.commonNavbarButton}>Pass</h1>
				</Button>

				<Button width={"100%"} onClick={() => navigateAndClose("/exercise")}>
					<h1 className={styles.commonNavbarButton}>Övningar</h1>
				</Button>

				<Button width={"100%"} onClick={() => navigateAndClose("/technique",  {state: {clearSearchText: true}})}>
					<h1 className={styles.commonNavbarButton}>Tekniker</h1>
				</Button>

        {isExaminationEnabled ? (
          <Button width={"100%"} onClick={() => {}}>
					  <h1 className={styles.commonNavbarButton}>Gradering</h1>
				  </Button>
        ) : (
          null
        )}

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
			<div className={`${styles.boxShadowBackground} ${open ? styles.boxShadowBackgroundOpen : styles.boxShadowBackgroundClosed}`} onClick={() => {setOpen(false)}}/>
		</nav>
	)
}
export default Navbar
