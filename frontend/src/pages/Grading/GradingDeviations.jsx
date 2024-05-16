/* eslint-disable indent */
import { useState, useEffect, useContext } from "react"
import Button from "../../components/Common/Button/Button"
import styles from "./GradingDeviations.module.css"
import Divider from "../../components/Common/Divider/Divider"
import Container from "./GradingDeviationContainer"
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
		const { userId } = useParams()
		const [name, setName] = useState("")
		const [gradingId, setGradingId] = useState(-1)
		const [beltId, setBeltId] = useState(-1)

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
                        let exId = json[i]["examinee_id"]
                        if(exId == userId) {
                            
                            setGradingId(json[i]["grading_id"])
                            setName(json[i]["name"])
                            const response2 = await fetch("/api/examination/grading/" + json[i]["grading_id"], requestOptions).catch(() => {
                                setError("Serverfel: Kunde inte ansluta till servern.")
                                return
                            })
                            if(response2.status != HTTP_STATUS_CODES.OK){
                                setError("Kunde inte hämta gradering. Felkod: " + response2.status)
                            } else {
                                const json2 = await response2.json()
                                setBeltId(json2["belt_id"])
                                const response3 = await fetch("/api/examination/examinationprotocol/all", requestOptions).catch(() => {
                                    setError("Serverfel: Kunde inte ansluta till servern.")
                                    return
                                })
                        
                                if(response3.status != HTTP_STATUS_CODES.OK){
                                    setError("Kunde inte hämta graderingsprotokollen. Felkod: " + response3.status)
                                    return
                                }
                                const json3 = await response3.json()
                        
                                for(let i = 0; i < json3.length; i++) {
                                    if(json2["belt_id"] === json3[i]["beltId"]) {
                                        let examinationProtocol = JSON.parse(json3[i]["examinationProtocol"])
                                        let categories = examinationProtocol.categories
                                        setTechniqueCategories(categories)
                                        return
                                    }
                                }
                            }
                        }
                    }
                }
			}
        }


        //setData(testData.categories)
        fetchData()

		}, [])
    function hasPassed() {
        return true //PLACEHOLDER
    }

    function getActivityContainer() {

        return techniqueCategories !== null && (
            <div className="container">
                <div className="row">
                    <ul>
                        {techniqueCategories.map((category) => (
                            
                            <div className = {styles["sc23-outline"]} id={category} key={category}>
                                <Divider id = 'divider-example' option= 'h2_left' title = {category.category_name} key={category.category_name}/>
                                {category.techniques.map((technique, index) => (

                                    <Container id = {index} name = {technique.text} passed={hasPassed(technique.text)} key={index} ></Container>
                                ))}
                            </div>
                        ))}
                    </ul>
                </div>
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

                <div className = {styles["sc23-session-header-clickable"]} role="button" onClick={() => setToggled(!toggled)}>
                </div>
            {getActivityContainer()}
            </div>
        </div>
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
	)
}