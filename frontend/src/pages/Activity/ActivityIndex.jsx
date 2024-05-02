import { Modal } from "react-bootstrap"
import Tab from "react-bootstrap/Tab"
import Tabs from "react-bootstrap/Tabs"
import ExerciseIndex from "./Exercise/ExerciseIndex"
import TechniqueIndex from "./Technique/TechniqueIndex/TechniqueIndex"
import styles from "./ActivityIndex.module.css"
import { useEffect, useState} from "react"

const exerciseURI = "https://jsonplaceholder.typicode.com/users"


/**
 * The Activity index page.
 * Uses the exercise index and technique index pages and displays them as tabs.
 * 
 * @author Team Kiwi
 * @version 1.0
 * @since 2024-05-02
 */
export default function ActivityIndex(){
    // Sets technique as default tab otherwise active tab from session storage 
    const [key, setKey] = useState(sessionStorage.getItem("active-tab") || "technique")

    useEffect(()=>{
        sessionStorage.setItem("active-tab", key)
    }, [key]) 

    return (
        <Modal.Body style={{ padding: "0" }}>
            <Tabs activeKey={key} onSelect={(tab) => setKey(tab)} className={styles.tabs}>
                <Tab eventKey="technique" title="Tekniker" tabClassName={`nav-link ${styles.tab}`}>
                    <TechniqueIndex />
                </Tab>
                <Tab  eventKey="exercise" title="Övningar" tabClassName={`nav-link ${styles.tab}`}>
                <ExerciseIndex uri={exerciseURI} />
                </Tab>
            </Tabs>
        </Modal.Body>
    )
} 
