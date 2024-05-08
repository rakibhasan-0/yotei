
import { useState , useContext, useEffect} from "react"
import RoundButton from "../../components/Common/RoundButton/RoundButton"
import { useNavigate} from "react-router-dom"
import { AccountContext } from "../../context"
import { Plus } from "react-bootstrap-icons"
import styles from "./GradingIndex.module.css"
import containerStyles from "./GradingBefore.module.css"

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
	const [belts, setBelts] = useState([]) 
	const [beltColors] = useState(["Gult", "Orange", "Grönt", "Blått", "Brunt"])
	const [currentGradings, setCurrentGradings] = useState([])
	const [finishedGradings, setFinishedGradings] = useState([])
	const [loading, setLoading] = useState(true)
	const context = useContext(AccountContext)
	const navigate = useNavigate()


	const { token, userId } = context

	const handleNavigationCurrentGradings = async (gradingId, gradingStep) => {
		navigate(`/grading/${gradingId}/${gradingStep}`)
	}

	const handleNavigationFinishedGradings = async (gradingId, gradingStep) => {
		navigate(`/grading/${gradingId}/${gradingStep}`)
	}

	useEffect(() => {
    
		(async () => {
      
			try {
				const beltResponse = await fetch("/api/belts/all", { headers: { token } })
				if (beltResponse.status === 404) {
					return
				}
				if (!beltResponse.ok) {
					setLoading(false)
					throw new Error("Kunde inte hämta bälten")
				}
				const beltJson = await beltResponse.json()
				setLoading(false)

				const filteredColors = beltJson.filter(item => beltColors.includes(item.name))
				const colorMaps = {}
				filteredColors.forEach(element => {
					if(element.child === false) {
						colorMaps[element.id] = {
							name: element.name,
							hex: `#${element.color}`,
						}
					}
				})
				setBelts(colorMaps)
				console.log("färger", belts)

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
						const isCreatorInFinished = finishedGradings.some(grading => grading.creator_id === userId)
						const isCreatorInCurrent = currentGradings.some(grading => grading.creator_id === userId)

						if (!isCreatorInFinished && !isCreatorInCurrent) {
							if (item.step === 3) {
								setFinishedGradings(prevState => [...prevState, item])
							} else {
								setCurrentGradings(prevState => [...prevState, item])
							}
						}
					}
				})

				console.log("Avslutade", JSON.stringify(finishedGradings))
				console.log("pågående", currentGradings)
        
			} catch (ex) {
				setErrorToast("Kunde inte hämta tidigare graderingar")
				setLoading(false)
				console.error(ex)
			}
		})()
	}, [token])

	return (
		<center>
			<h1>Pågående graderingar</h1>
			<div className={containerStyles.scrollableContainer}>
				{loading ? <Spinner /> : ( 
					<div>
						{currentGradings.map((grading, index) => (
							<BeltButton
								key={index}
								width={"100%"}
								onClick={() => handleNavigationCurrentGradings(grading.grading_id, grading.step)}
								color={belts[grading.belt_id]?.hex}
							>
								<h2>{`${belts[grading.belt_id]?.name} bälte`} </h2>
							</BeltButton>
						))}

					</div>
				)}
			</div>

			<h1>Avslutade graderingar</h1>
			<div className={containerStyles.scrollableContainer}>
				{loading ? <Spinner /> : ( 
					<div>
						{finishedGradings.map((grading, index) => (
							<BeltButton
								key={index}
								width={"100%"}
								onClick={() => handleNavigationFinishedGradings(grading.grading_id, grading.step)}
								color={belts[grading.belt_id]?.hex}
							>
								<h2>{`${belts[grading.belt_id]?.name} bälte`} </h2>
							</BeltButton>
						))}

					</div>
				)}
                
			</div>

			<RoundButton linkTo={"/grading/create"}>
				<Plus />
			</RoundButton>
		</center>
	)	
}