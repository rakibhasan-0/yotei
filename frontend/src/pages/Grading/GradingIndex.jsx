
import { useState , useContext, useEffect} from "react"
import RoundButton from "../../components/Common/RoundButton/RoundButton"
import { useNavigate} from "react-router-dom"
import { AccountContext } from "../../context"
import { Plus } from "react-bootstrap-icons"
import styles from "./GradingIndex.module.css"
import BeltButton from "../../components/Common/Button/BeltButton"
import Spinner from "../../components/Common/Spinner/Spinner"
import { Trash} from "react-bootstrap-icons"
import PopupSmall from "../../components/Common/Popup/PopupSmall"



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
	const [isCreateListDone, setIsCreateListDone] = useState(false)
	const context = useContext(AccountContext)
	const navigate = useNavigate()
	const [showPopup, setShowPopup] = useState(false)


	const { token, userId } = context

	/**
	 * Navigate to next page, params such as gradingId, gradingStep and hexcolor for belt.
	 * @param {integer} gradingId 
	 * @param {integer} gradingStep 
	 * @param {string} color 
	 */
	const handleNavigation = async (gradingId, gradingStep, color) => {
		const params = {
			ColorParam: color,
		}
		navigate(`/grading/${gradingId}/${gradingStep}`, { state: params })
	}

	/**
	 * Navigate to create gradingprotocol. 
	 */
	function navigateTo() {
		navigate("/grading/create")
	}

	const handleIconClick = () => {
		setShowPopup(true)	 
	}

	function handleTrashClick(gradingId) {
		console.log(gradingId)

		if(showPopup) {

			fetch(`/api/examination/grading/${gradingId}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					"token": token 
				}
			})
				.then(response => {
					if (currentGradings.some(grading => grading.gradingId === gradingId)) {
						setCurrentGradings(prevCurrentGradings =>
							prevCurrentGradings.filter(grading => grading.gradingId !== gradingId)
						)

					}
					
					if (finishedGradings.some(grading => grading.gradingId === gradingId)) {
						setFinishedGradings(prevFinishedGradings =>
							prevFinishedGradings.filter(grading => grading.gradingId !== gradingId)
						)
					}

					if (!response.ok) {
						throw new Error("Network response was not ok")
					}

				})
				.catch(error => {
					console.error("Det uppstod ett problem med DELETE-förfrågan:", error)
				})

		}
	}


	/**
	 * GET belts from database. 
	 * @returns all belts stored in the database. 
	 */
	const fetchBelts = () => {
		return fetch("/api/belts/all", {
			method: "GET",
			headers: { "token": token }
		})
			.then(response => {
				if (!response.ok) {
					throw new Error("Network response was not ok")
				}
				return response.json()
			})
	}

	/**
	 * GET all examinations in database. 
	 * @returns all examinations stored in database.
	 */
	const fetchGradings = () => {
		return fetch(`/api/examination/grading/creator/${userId}`, {
			method: "GET",
			headers: { "token": token }
		})
			.then(response => {
				if(response.status === 404) {
					return []
				}
				return response.json()
			})
	}

	/**
   *  Distribution current gradings and finished gradings for userid.  
   * @param {json} gradings_data 
   */
	function createLists(gradings_data) {
		gradings_data.map(async (item) => {
			const isCreatorInFinished = finishedGradings.some(grading => grading.creatorId === userId)
			const isCreatorInCurrent = currentGradings.some(grading => grading.creatorId === userId)
	

			if (!isCreatorInFinished && !isCreatorInCurrent) {
				if (item.step === 3) {
					setFinishedGradings(prevState => [...prevState, item])
				} else {
					setCurrentGradings(prevState => [...prevState, item])
				}
			}
			
		})
		setIsCreateListDone(true)
	}

	/**
   * Checks if the user has no earlier gradings started or finished. 
   * Otherwise sort it by dates.
   */
	useEffect(() => {

		if(isCreateListDone) {
			if(currentGradings.length === 0 && finishedGradings.length === 0) {
				navigateTo()
			}

			setIsCreateListDone(false)
			const sortedCurrentGradings = [...currentGradings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
			setCurrentGradings(sortedCurrentGradings)
			const sortedFinishedGradings = [...finishedGradings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
			setFinishedGradings(sortedFinishedGradings)

		}
    
	}, [isCreateListDone])



	/**
	 * Handle belt colors and name. 
	 * 
	 */
	useEffect(() => {

		const fetchData = async () => {
			try {
				setFinishedGradings([])
				setCurrentGradings([])
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
				createLists(gradings_data)


			} catch (error) {
				console.error("There was a problem with the fetch operation:", error)
			}
		}
		fetchData()
		

	}, [])

	return (
		<center>
			<h1>Pågående graderingar</h1>
			<div className={styles.container}>
				<div className={styles.scrollableContainer}>
					{loading ? <Spinner /> : ( 
						<div>
							{currentGradings.map((grading, index) => (
								<BeltButton
									key={index}
									width={"100%"}
									onClick={() => handleNavigation(grading.gradingId, grading.step, belts[grading.beltId]?.hex)}
									color={belts[grading.beltId]?.hex}
								>
								
									<div style={{ display: "flex", alignItems: "center", width: "100%", position: "relative" }}>
										<h2 style={{ margin: 0, position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
											{grading.title}
										</h2>

										
										<button 
											onClick={(e) => {
												e.stopPropagation() 
												handleIconClick()
											}} 
											style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer" }}
										>
											<Trash />
										</button>

										<PopupSmall id={"test-popup"} title={"Varning"} isOpen={showPopup} setIsOpen={setShowPopup} direction={handleTrashClick(grading.gradingId)} >
											<h2>Är du säker på att alla deltagare är tillagda? </h2>
											<h2>Du kan <span style={{ fontWeight: "bold", fontSize: "18px" }}>inte</span> redigera skapade individer i efterhand</h2>
											<br></br>
											<h2> Isåfall fortsätt till graderingsprocessen</h2>
										</PopupSmall>
										

									</div>


	

								</BeltButton>
							))}

						</div>
					)}
				</div>
			</div>
			<h1 className={styles.finishedGradings}>Avslutade graderingar</h1>

			<div className={styles.container}>
				<div className={styles.scrollableContainer}>
					{loading ? <Spinner /> : ( 
						<div>
							{finishedGradings.map((grading, index) => (
								<BeltButton
									key={index}
									width={"100%"}
									onClick={() => handleNavigation(grading.gradingId, grading.step, belts[grading.beltId]?.hex)}
									color={belts[grading.beltId]?.hex}
								>
									<div style={{ display: "flex", alignItems: "center", width: "100%", position: "relative" }}>
										<h2 style={{ margin: 0, position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
											{grading.title}
										</h2>
										<button 
											onClick={(e) => {
												e.stopPropagation() 
												handleTrashClick(grading.gradingId)
											}} 
											style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer" }}
										>
											<Trash />
										</button>
									</div>

								</BeltButton>
							))}
						</div>
					)}
				</div>          
			</div>


			<RoundButton onClick={navigateTo}>
				<Plus />
			</RoundButton>
		</center>
	)	
}