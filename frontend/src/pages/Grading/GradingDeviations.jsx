/* eslint-disable indent */
import { useState, useEffect, useContext } from "react"
import Button from "../../components/Common/Button/Button"
import styles from "./GradingDeviations.module.css"
import Divider from "../../components/Common/Divider/Divider"
import testData from "./yellowProtocolTemp.json"
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
		const [data, setData] = useState([])
		const { userId } = useParams() //The user id of the current examinee
		const [name, setName] = useState("") //The name of the current examinee
		const [, setGradingId] = useState(-1)
		const [, setBeltId] = useState(-1)
		const { gradingId } = useParams()
        const [showingAll, setShowingAll] = useState(false)

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
                for(let i = 0; i < json.length; i++) { //Replace when the API is changed to allow for fetching individual examinees
                    if(json[i] !== null) {
                        var exId = json[i]["examinee_id"]
                        if(exId == userId) {
                            setGradingId(json[i]["grading_id"])
                            setName(json[i]["name"])
                            console.log("Set id to " + json[i]["grading_id"])
                            const response2 = await fetch("/api/examination/grading/" + json[i]["grading_id"], requestOptions).catch(() => {
                                setError("Serverfel: Kunde inte ansluta till servern.")
                                return
                            })
                            if(response2.status != HTTP_STATUS_CODES.OK){
                                setError("Kunde inte hämta gradering. Felkod: " + response2.status)
                            } else {
                                const json = await response2.json()
                                console.log(json)
                                setBeltId(json["belt_id"])
                            }
                        }
                    }
                }
			}
        }
        
        //Initialize data
        setData(testData.categories)
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
    function isDeviating() {
        return false //PLACEHOLDER
    }


    /**
     * Gets a holder which holds a container for each technique in the grading protocol. The container also has the comment 
     *      and pass status for each technique
     * @param {Array} exercises 
     * @returns A container displaying all exercises and information about the examinees performance of them
     */
    function getActivityContainer(exercises) {

        return exercises !== null && (
            <div className="container">
                <div className="row">
                    <ul>
                        {exercises.map((category) => (
                            
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

	return (
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
                {getActivityContainer(data)}
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
            </div>
        </div>
	)
}