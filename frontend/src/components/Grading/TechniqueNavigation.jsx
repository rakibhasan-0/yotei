import { useState } from "react"
import Button from "../../components/Common/Button/Button"
import {Link} from "react-router-dom"
import Popup from "../../components/Common/Popup/Popup"
import styles from "./TechniqueNavigation.module.css"

/**
 * A button that should be used to navigate techniques during the grading.
 * 
 *   Props:
 *    id
 *    id    @type {String}   An id for the button
 * 
 * Example Usage:
 * <TechniqueNavigation 
 *     id="pass-button">
 * </TechniqueNavigation>
 * 
 * @author Apelsin
 * @since 2024-05-06
 * @version 1.0 
 */

/* Should take props that are related to what route the summary/techniques button should lead to.*/
function TechniqueNavigation({ id }) {
    const [showPopup, setShowPopup] = useState(false)
    {/* Should instead be sent as a prop to the component since the techniques have been fetched in the parent component. */}
    const headers = ["Teknik1", "Teknik2", "Teknik3", "Teknik4", "Teknik5", "Teknik6", "Teknik7", "Teknik8", "Teknik9"]; // Example array of headers


    return(
        <div>
            <Button id={id} children={<p>Tekniker</p>} onClick={() => setShowPopup(true)}></Button>
            <Popup 
                id={"navigation-popup"} 
                title={"Navigering"} 
                isOpen={showPopup} 
                setIsOpen={setShowPopup}
                children={
                    <div className={styles.popupContent}>
                        {/* Should link to the respective technique grading page. */}
                        {headers.map((techniqueName, index) => (
                            <Button key={index} width={"25rem"}><p>{techniqueName}</p></Button>
                        ))}
                        {/* Should link to the "after" part of the grading as well as save the changes to the database. */}
                        <Link to="/groups" className={styles.summaryLink}>
                            <Button id={"summering-button"} onClick={() => setShowPopup(false)}><p>Fortsätt till summering</p></Button>
                        </Link>
                    </div>
                }> 
            </Popup>
        </div>
    )
}

export default TechniqueNavigation

