
import { useState , useContext, useEffect} from "react"
import RoundButton from "../../components/Common/RoundButton/RoundButton"
import { AccountContext } from "../../context"
import { Plus } from "react-bootstrap-icons"
import styles from "./GradingIndex.module.css"
import InfiniteScrollComponent from "../../components/Common/List/InfiniteScrollComponent"
import BeltButton from "../../components/Common/Button/BeltButton"
import Spinner from "../../components/Common/Spinner/Spinner"
import {setError as setErrorToast, setSuccess as setSuccessToast} from "../../utils"


/**
 * The grading create page.
 * Creates a new grading.
 * 
 * @author Team Pomegranate
 * @version 1.0
 * @since 2024-05-07
 */

export default function GradingIndex() {
	const [beltColors] = useState({
		"Gult": 3,
		"Orange": 5,
		"Grönt": 7,
		"Blått": 9,
		"Brunt": 11
	})
	const [belts, setBelts] = useState([]) 

	const [currentGradings, setCurrentGradings] = useState([])
	const [finishedGradings, setFinishedGradings] = useState([])
	const [loading, setLoading] = useState(true)
	const context = useContext(AccountContext)

	const { token, userId } = context

	useEffect(() => {
    
		(async () => {
      
			try {
				const response = await fetch("/api/examination/all", { headers: { token } })
				if (response.status === 404) {
					return
				}
				if (!response.ok) {
					setLoading(false)
					throw new Error("Kunde inte hämta bälten")
				}
				const json = await response.json()
				setLoading(false)

				json.forEach(item => {

					if(item.creator_id === userId) {
						if (item.step === 3) {
							setFinishedGradings(prevState => [...prevState, item])
						} else {
							setCurrentGradings(prevState => [...prevState, item])
						}
					}
				})

				console.log("Avslutade", JSON.stringify(finishedGradings))
				console.log("pågående", JSON.stringify(currentGradings))
        
			} catch (ex) {
				setErrorToast("Kunde inte hämta tidigare graderingar")
				setLoading(false)
				console.error(ex)
			}
		})()
	}, [token])

	return (
		<center>
			<title>Planering</title>
			<h1>Pågående graderingar</h1>
			<div className={styles["gradingBox"]}>
        
     
			</div>

			<h1>Avslutade graderingar</h1>
			<div className={styles["gradingBox"]}>
                
			</div>

			<RoundButton linkTo={"/grading/create"}>
				<Plus />
			</RoundButton>
		</center>
	)	
}