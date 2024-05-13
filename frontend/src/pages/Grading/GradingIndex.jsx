
import { useState , useContext, useEffect} from "react"
import RoundButton from "../../components/Common/RoundButton/RoundButton"
import { useNavigate} from "react-router-dom"
import { AccountContext } from "../../context"
import { Plus } from "react-bootstrap-icons"
import styles from "./GradingIndex.module.css"
import containerStyles from "./GradingBefore.module.css"
import BeltButton from "../../components/Common/Button/BeltButton"
import Spinner from "../../components/Common/Spinner/Spinner"


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

	const handleNavigation = async (gradingId, gradingStep) => {
		navigate(`/grading/${gradingId}/${gradingStep}`)
	}

	const fetchBelts = () => {
		return fetch("/api/belts/all", {
			method: "GET",
			headers: { token }
		})
			.then(response => {
				if (!response.ok) {
					throw new Error("Network response was not ok")
				}
				return response.json()
			})
	}

	const fetchGradings = () => {
		return fetch("/api/examination/all", {
			method: "GET",
			headers: { token }
		})
			.then(response => {
				if (!response.ok) {
					throw new Error("Network response was not ok")
				}
				return response.json()
			})
	}

	useEffect(async () => {

		const fetchData = async () => {
			try {
				const [belt_data, gradings_data] = await Promise.all([
					fetchBelts(),
					fetchGradings()
				])
				const filteredColors = belt_data.filter(item => beltColors.includes(item.name))
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
				setLoading(false)

				gradings_data.forEach(item => {

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

        

			} catch (error) {
				console.error("There was a problem with the fetch operation:", error)
			}
		}

		fetchData()

	}, [])

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
								onClick={() => handleNavigation(grading.grading_id, grading.step)}
								color={belts[grading.belt_id]?.hex}
							>
								<h2>{`${belts[grading.belt_id]?.name} bälte`} </h2>
							</BeltButton>
						))}

					</div>
				)}
			</div>

			<h1 className={styles.finishedGradings}>Avslutade graderingar</h1>

			<div className={containerStyles.scrollableContainer}>
				{loading ? <Spinner /> : ( 
					<div>
						{finishedGradings.map((grading, index) => (
							<BeltButton
								key={index}
								width={"100%"}
								onClick={() => handleNavigation(grading.grading_id, grading.step)}
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