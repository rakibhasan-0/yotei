/* eslint-disable indent */
import { useState, useEffect, useContext } from "react"
import Button from "../../components/Common/Button/Button"
import styles from "./GradingDeviations.module.css"
import Divider from "../../components/Common/Divider/Divider"
import Container from "./GradingDeviationContainer"
import CheckBox from "../../components/Common/CheckBox/CheckBox"
import { useNavigate, useParams } from "react-router-dom"
import {HTTP_STATUS_CODES, setError} from "../../utils"
import { AccountContext } from "../../context"


/**
 * The grading deviation page.
 * Imports grading data and displays if the user passed or not 
 * and shows comments if there are any.
 * 
 * @author Team Pomegranate
 * @version 1.0
 * @since 2024-05-07
 */


export default function GradingDeviations() {
		const [toggled, setToggled] = useState(false)
		const [techniqueCategories, setTechniqueCategories] = useState([])
		const [gradingId, setGradingId] = useState(-1)
		const [beltId, setBeltId] = useState(-1)
		const { userId } = useParams() //The user id of the current examinee
		const [name, setName] = useState("") //The name of the current examinee
        const [showingAll, setShowingAll] = useState(false)
        const [personalComments, setPersonalComments] = useState([])
        const [pairCOmments, setPairComments] = useState([])
        const [groupComments, setGroupComments] = useState([])

    const context = useContext(AccountContext)

    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async() => {
            const requestOptions = {
                headers: {"Content-type": "application/json", token: context.token}
			}
            
            const response = await fetch("/api/examination/examinee/all", requestOptions).catch(() => {
                setError("Serverfel: Kunde inte ansluta till servern.")
				return
			})
            
            if(response.status != HTTP_STATUS_CODES.OK){
                setError("Kunde inte hämta examinee's. Felkod: " + response.status)
			} else {
                const json = await response.json()
                console.log(json)
                for(let i = 0; i < json.length; i++) { //Replace when the API is changed to allow for fetching individual examinees
                    if(json[i] !== null) {
                        if(json[i]["examineeId"] == userId) {
                            
                            setGradingId(json[i]["gradingId"])
                            setName(json[i]["name"])
                            const response2 = await fetch("/api/examination/grading/" + json[i]["gradingId"], requestOptions).catch(() => {
                                setError("Serverfel: Kunde inte ansluta till servern.")
                                return
                            })
                            if(response2.status != HTTP_STATUS_CODES.OK){
                                setError("Kunde inte hämta gradering. Felkod: " + response2.status)
                            } else {
                                const json2 = await response2.json()
                                setBeltId(json2["beltId"])
                                fetchProtocol(json2["beltId"])
                            }
                        }
                    }
                }
			}
        }

        const fetchProtocol = async(beltId) => {
            const requestOptions = {
                headers: {"Content-type": "application/json", token: context.token}
			}
            const response = await fetch("/api/examination/examinationprotocol/all", requestOptions).catch(() => {
                setError("Serverfel: Kunde inte ansluta till servern.")
                return
            })
    
            if(response.status != HTTP_STATUS_CODES.OK){
                setError("Kunde inte hämta graderingsprotokollen. Felkod: " + response.status)
                return
            }
            const json = await response.json()

            //Loop to find the right protocol based on the current gradings belt
            for(let i = 0; i < json.length; i++) {
                if(beltId=== json[i]["beltId"]) { //Found the correct protocol, set the data
                    let examinationProtocol = JSON.parse(json[i]["examinationProtocol"])
                    let categories = examinationProtocol.categories
                    setTechniqueCategories(categories)
                    return
                }
            }
        }

        const fetchComments = async() => {

        }

        fetchData()
		}, [])

    /**
     * Checks if the examinee has passed a specific technique
     * @param {Technique} technique 
     * @returns Boolean value
     */
    function hasPassed() {
        // har tagit bort technique eftersom det inte går igenom lintern
        return true //PLACEHOLDER
    }


    /**
     * Checks if the examinee is deviating in some way on a specific technique, either if they have not passed or 
     *  if they have a comment
     * @returns Boolean value stating whether the examinee is deviating on the technique or not
     */
    function isDeviating() {
        if(!hasPassed()) {
            return true
        }
        if(getPersonalComment() != "") {
            return true
        }
        if(getPairComment() != "") {
            return true
        }
        if(getGroupComment() != "") {
            return true
        }
        return false
    }

    /**
     * Gets the personal comment of a given technique
     * @returns The personal comment of a given technique
     */
    function getPersonalComment() {
        return "" //PLACEHOLDER
    }

    /**
     * Gets the pair comment of a given technique
     * @returns The pair comment of a given technique
     */
    function getPairComment() {
        return "" //PLACEHOLDER
    }

    /**
     * Gets the group comment of a given technique
     * @returns The group comment of a given technique
     */
    function getGroupComment() {
        return "";
    }

    /**
     * Gets a holder which holds a container for each technique in the grading protocol. The container also has the comment 
     *      and pass status for each technique
     * @returns A container displaying all exercises and information about the examinees performance of them
     */
    function getActivityContainer() {
        return techniqueCategories !== null && (
            <div className="container">
                <div className="row">
                    <ul>
                        {techniqueCategories.map((category) => (
                            
                            <div className = {styles["sc23-outline"]} id={category} key={category}>
                                <Divider id = 'divider-example' option= 'h2_left' title = {category.category_name} key={category.category_name}/>
                                {category.techniques.map((technique, index) => (
                                    (isDeviating(technique) || showingAll) ?
                                        <Container id = {index} name = {technique.text} passed={hasPassed(technique)} key={index} ></Container>
                                        : null
                                ))}
                            </div>
                        ))}
                    </ul>
                </div>
            </div>
        )
    }

    /**
     * Gets a back button for the page
     * @returns A back button component which navigates back to the grading overview of all examinees 
     */
    function getBackButton() {
        return (
            <div className={styles.buttonContainer}>
                <Button
                    width="100%"
                    outlined={true}
                    onClick={() => {
                        navigate("/grading/" + gradingId + "/3")
                    }}
                >
                    <p>Tillbaka</p>
                </Button>
            </div>
        )
    }

	return (
        <div>
				<div className={styles.scrollableContainer}>
						<div>
								<div className={styles.topContainer}>
										<h1 style={{ fontFamily: "Open Sans", fontSize: "25px", paddingTop: "10px", paddingBottom: "5px" }}>{name}</h1>
										<h4 style={{ fontFamily: "Open Sans", fontSize: "15px", paddingTop: "0px", paddingBottom: "10px" }}>Kommentarer</h4>
								</div>
                <div className="d-flex justify-content-center">
                    <CheckBox
                        className = {styles["showAllCheckbox"]}
                        checked={false}
                        label = "Visa alla"
                        onClick={(checked) => {setShowingAll(checked)}}
                        enabled
                        id="checkbox-element"
                    />
                </div>
                <div className = {styles["sc23-session-header-clickable"]} role="button" onClick={() => setToggled(!toggled)}>
                </div>
            {getActivityContainer()}
            </div>
        </div>
        {getBackButton()}
        </div>
	)
}