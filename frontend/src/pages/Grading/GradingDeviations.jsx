/* eslint-disable indent */
import { useState, useEffect, useContext } from "react"
//import { Link, useLocation, useNavigate} from "react-router-dom"
import Button from "../../components/Common/Button/Button"
import styles from "./GradingDeviations.module.css"
import Divider from "../../components/Common/Divider/Divider"
import testData from "./yellowProtocolTemp.json";
import Container from "./GradingDeviationContainer"
import { useParams } from "react-router-dom"
import {HTTP_STATUS_CODES, setError, setSuccess} from "../../utils"
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
    const [toggled, setToggled] = useState(false);
    const [data, setData] = useState([]);
    const { userId } = useParams()

    const [errorStateMsg, setErrorStateMsg] = useState("")

    const context = useContext(AccountContext)

	const {token} = context

    useEffect(() => {
        setData(testData.categories);
        const fetchData = async() => {
            const requestOptions = {
				headers: {"Content-type": "application/json", token: context.token}
			}

            const response = await fetch(`/api/examination/examinee/all`, requestOptions).catch(() => {
				setErrorStateMsg("Serverfel: Kunde inte ansluta till servern.")
				return
			})

            if(response.status != HTTP_STATUS_CODES.OK){
				setErrorStateMsg("Kunde inte hämta examinee's. Felkod: " + response.status)
			} else {
				const json = await response.json()
				console.log(json)
			}
        }
        fetchData()
    }, []);

    function getActivityContainer(exercises) {

        return exercises !== null && (
            <div className="container">
                <div className="row">
                    <ul>
                        {exercises.map((category, index) => (
                            
                            <div className = {styles["sc23-outline"]}>
                                <Divider id = 'divider-example' option= 'h2_left' title = {category.category_name}/>
                                {category.techniques.map((technique, index) => (
                                    <Container id = {index} name = {technique.text} passed={false} ></Container>
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
                    <h1 style={{ fontFamily: "Open Sans", fontSize: "25px", paddingTop: "10px", paddingBottom: "5px" }}>Linus</h1>
                    <h4 style={{ fontFamily: "Open Sans", fontSize: "15px", paddingTop: "0px", paddingBottom: "10px" }}>Kommentarer</h4>
                </div>

                <div className = {styles["sc23-session-header-clickable"]} role="button" onClick={() => setToggled(!toggled)}>
                </div>
                {getActivityContainer(data)}
                <div className={styles.buttonContainer}>
                    <Button
                        width="100%"
                        outlined={true}
                        onClick={() => {
                            navigate("/grading/create/3/3")
                        }}
                    >
                        <p>Tillbaka</p>
                    </Button>
                </div>
            </div>
        </div>
	)
}