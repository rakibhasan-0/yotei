import { useState, useEffect, useContext } from "react"
import { useNavigate} from "react-router-dom"
import BeltButton from "../../components/Common/Button/BeltButton"
import style from "./GradingCreate.module.css"
import Spinner from "../../components/Common/Spinner/Spinner"
import { AccountContext } from "../../context"
import {setError as setErrorToast} from "../../utils"

/**
 * The grading create page.
 * Creates a new grading.
 * 
 * @author Team Pomegranate
 * @version 1.0
 * @since 2024-05-02
 */
export default function GradingCreate() {

	const [beltColors] = useState(["Gult", "Orange", "Grönt", "Blått", "Brunt"])
	const [belts, setBelts] = useState([]) 
	const [loading, setLoading] = useState(true)
	const context = useContext(AccountContext)
	const { token, userId } = context
	const navigate = useNavigate()
	const today = new Date()
	const formattedDateTime = today.toISOString().split('T')[0]


	/**
	 * Navigate to begin grading page, params gradingId and hexcolor for current belt. 
	 * @param {integer} gradingId 
	 * @param {string} color 
	 */
	const handleNavigation = async (gradingId, color) => {
	
		const params = {
			ColorParam: color,
		}
			
		navigate(`/grading/${gradingId}/1`, { state: params })


	}

	/**
	 * Create the grading in databse. 
	 * @param {integer} beltId 
	 * @param {string} color 
	 */
	const createGrading = async (beltId, color) => {
		try {

			const gradingData = {
				creator_id: userId,
				belt_id: beltId,
				step: 1,
				technique_step_num: 0,
        title: "Examination (" + formattedDateTime + ")",
				created_at: formattedDateTime
			}

			const response = await fetch("/api/examination/grading", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"token": token
				},
				body: JSON.stringify(gradingData)
			})

			if (!response.ok) {
				setErrorToast("Det har uppstått ett oväntat problem")
				throw new Error("Serverfel")

			}

			if(response.ok) {
				const responseData = await response.json()
				const gradingId = responseData.grading_id
				handleNavigation(gradingId, color)
			}

		} catch (error) {
			console.error("Misslyckades skapa gradering:", error)
		}

	}

	/**
	 * Get belts id and matching hexcolor for all belts in database. 
	 */
	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch("/api/belts/all", { headers: { "token": token } })
				if (response.status === 404) {
					return
				}
				if (!response.ok) {
					setLoading(false)
					throw new Error("Kunde inte hämta bälten")
				}
				const json = await response.json()
				setLoading(false)

				const filteredColors = json.filter(item => beltColors.includes(item.name))
				const colorMaps = {}
				filteredColors.forEach(element => {
					if(element.child === false) {
						colorMaps[element.name] = {
							id: element.id,
							hex: `#${element.color}`,
						}
					}
				})
				setBelts(colorMaps)

        
			} catch (ex) {
				setErrorToast("Kunde inte hämta bälten")
				setLoading(false)
				console.error(ex)
			}
		}
		fetchData()
	}, [token])

	return (
		<div> 
			<div className = {style.titleStyle}> 
				<h1>Välj graderingsprotokoll</h1>
			</div>
			{loading ? <Spinner /> : ( 
				<div>
					{beltColors.map((color, index) => (
						<BeltButton
							id={color}
							key={color}
							width={"100%"}
							onClick={() => createGrading(belts[color].id, belts[color].hex)}
							color={belts[color].hex}
						
						>
							<h2>{`${5 - index} KYU ${color.toUpperCase()} BÄLTE`} </h2>
						</BeltButton>
					))}
				</div>
			)}
		</div>
	)
}