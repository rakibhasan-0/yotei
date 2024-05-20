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
		const { userId } = useParams() //The user id of the current examinee
		const [name, setName] = useState("") //The name of the current examinee
        const [showingAll, setShowingAll] = useState(false)
        const [resultList, setResultList] = useState([])
        const [personalComments, setPersonalComments] = useState([])
        const [pairComments, setPairComments] = useState([])
        const [groupComments, setGroupComments] = useState([])

    const context = useContext(AccountContext)

    const navigate = useNavigate()

    useEffect(() => {
        //Fetches all data required
        const fetchData = async() => {
            const requestOptions = {
                headers: {"Content-type": "application/json", token: context.token}
			}
            
            const response = await fetch("/api/examination/examinee/" + userId, requestOptions).catch(() => {
                setError("Serverfel: Kunde inte ansluta till servern.")
				return
			})
            
            if(response.status != HTTP_STATUS_CODES.OK){
                setError("Kunde inte hämta examinee. Felkod: " + response.status)
			} else {
                const json = await response.json()   
                setGradingId(json["gradingId"])
                setName(json["name"])
                fetchGrading(json["gradingId"])
                fetchGroupComments(json["gradingId"])
                fetchPairComments(json["gradingId"])
            }
        }

        //Fetches the grading object based on an id
        const fetchGrading = async(gradingId) => {
            const requestOptions = {
                headers: {"Content-type": "application/json", token: context.token}
			}

            const response = await fetch("/api/examination/grading/" + gradingId, requestOptions).catch(() => {
                setError("Serverfel: Kunde inte ansluta till servern.")
                return
            })

            if(response.status != HTTP_STATUS_CODES.OK){
                setError("Kunde inte hämta gradering. Felkod: " + response.status)
            } else {
                const json = await response.json()
                fetchProtocol(json["beltId"])
            }
        }

        //Fetches the correct grading protocol based on a belt id
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
                if(beltId === json[i]["beltId"]) { //Found the correct protocol, set the data
                    let examinationProtocol = JSON.parse(json[i]["examinationProtocol"])
                    let categories = examinationProtocol.categories
                    setTechniqueCategories(categories)
                    return
                }
            }
        }

        //Fetches an examinees grading result
        const fetchResult = async() => {
            const requestOptions = {
                headers: {"Content-type": "application/json", token: context.token}
			}
            const response = await fetch("/api/examination/examresult/" + userId, requestOptions).catch(() => {
                setError("Serverfel: Kunde inte ansluta till servern.")
                return
            })
            if(response.status != HTTP_STATUS_CODES.OK){
                setError("Kunde inte hämta graderingsresultat. Felkod: " + response.status)
                return
            }
            const json = await response.json()
            setResultList(json)
        }

        //Fetches an examinees personal grading comments
        const fetchPersonalComments = async() => {
            const requestOptions = {
                headers: {"Content-type": "application/json", token: context.token}
			}
            const response = await fetch("/api/examination/comment/examinee/all/" + userId, requestOptions).catch(() => {
                setError("Serverfel: Kunde inte ansluta till servern.")
                return
            })
            if(response.status != HTTP_STATUS_CODES.OK){
                setError("Kunde inte hämta personliga kommentarer. Felkod: " + response.status)
                return
            }
            const json = await response.json()
            console.log(json)
            setPersonalComments(json)
        }

        const fetchPairComments = async(gradingId) => {
            const requestOptions = {
                headers: {"Content-type": "application/json", token: context.token}
			}
            const response = await fetch("/api/examination/pair/grading/" + gradingId, requestOptions).catch(() => {
                setError("Serverfel: Kunde inte ansluta till servern.")
                return
            })
            if(response.status != HTTP_STATUS_CODES.OK){
                setError("Kunde inte hämta gruppens kommentarer. Felkod: " + response.status)
                return
            }
            const json = await response.json()
            for(let i = 0; i < json.length; i++) {
                if(json[i]["examinee_1"].id == userId || json[i]["examinee_2"].id == userId) {
                    console.log(json[i])
                    const response2 = await fetch("/api/examination/comment/pair/all/" + json[i]["pair_id"], requestOptions).catch(() => {
                        setError("Serverfel: Kunde inte ansluta till servern.")
                        return
                    })
                    if(response2.status != HTTP_STATUS_CODES.OK){
                        setError("Kunde inte hämta par-kommentarer. Felkod: " + response2.status)
                        return
                    }
                    const json2 = await response2.json()
                    console.log(json2)
                    setPairComments(json2)
                }
            }
            console.log(json)
        }

        //Fetches the entire groups grading comments
        const fetchGroupComments = async(gradingId) => {
            const requestOptions = {
                headers: {"Content-type": "application/json", token: context.token}
			}
            const response = await fetch("/api/examination/comment/group/all/" + gradingId, requestOptions).catch(() => {
                setError("Serverfel: Kunde inte ansluta till servern.")
                return
            })
            if(response.status != HTTP_STATUS_CODES.OK){
                setError("Kunde inte hämta gruppens kommentarer. Felkod: " + response.status)
                return
            }
            const json = await response.json()
            console.log(json)
            setGroupComments(json)
        }

        fetchData()
        fetchResult()
        fetchPersonalComments()
		}, [])

    /**
     * Checks if the examinee has passed a specific technique
     * @param {Technique} technique 
     * @returns Boolean value statomg whether the examinee has passed the technique or not
     */
    function hasPassed(techniqueName) {
        for(let i = 0; i < resultList.length; i++) {
            if(resultList[i] != null) {
                if(resultList[i]["technique_name"] == techniqueName) {
                    return resultList[i]["pass"]
                }
            }
        }
        return false
    }


    /**
     * Checks if the examinee is deviating in some way on a specific technique, either if they have not passed or 
     *  if they have a comment
     * @returns Boolean value stating whether the examinee is deviating on the technique or not
     */
    function isDeviating(techniqueName) {
        if(!hasPassed(techniqueName)) {
            return true
        }
        if(getPersonalComment(techniqueName) != "") {
            return true
        }
        if(getPairComment(techniqueName) != "") {
            return true
        }
        if(getGroupComment(techniqueName) != "") {
            return true
        }
        return false
    }

    /**
     * Gets the personal comment of a given technique
     * @returns The personal comment of a given technique
     */
    function getPersonalComment(techniqueName) {
        for(let i = 0; i < personalComments.length; i++) {
            if(personalComments[i].techniqueName == techniqueName) {
                return personalComments[i].comment
            }
        }
        return ""
    }

    /**
     * Gets the pair comment of a given technique
     * @returns The pair comment of a given technique
     */
    function getPairComment(techniqueName) {
        for(let i = 0; i < pairComments.length; i++) {
            if(pairComments[i].techniqueName == techniqueName) {
                return pairComments[i].comment
            }
        }
        return ""
    }

    /**
     * Gets the group comment of a given technique
     * @returns The group comment of a given technique
     */
    function getGroupComment(techniqueName) {
        for(let i = 0; i < groupComments.length; i++) {
            if(groupComments[i].techniqueName == techniqueName) {
                return groupComments[i].comment
            }
        }
        return ""
    }

    /**
     * Get a checkbox which toggles between showing all techniques and only deviating ones
     * @returns A checkbox
     */
    function getToggleCheckBox() {
        return (
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
        )
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
                                    (isDeviating(technique.text) || showingAll) ?
                                        <Container id = {index} name = {technique.text} passed={hasPassed(technique.text)} key={index} 
                                        comment={getPersonalComment(technique.text)} pairComment={getPairComment(technique.text)} generalComment={getGroupComment(technique.text)}></Container>
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
                {getToggleCheckBox()}
                <div className = {styles["sc23-session-header-clickable"]} role="button" onClick={() => setToggled(!toggled)}>
                </div>
            {getActivityContainer()}
            </div>
        </div>
        {getBackButton()}
        </div>
	)
}