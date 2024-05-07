import { useState, useEffect, useContext } from "react"
import { useNavigate} from "react-router-dom"
import BeltButton from "../../components/Common/Button/BeltButton"
import style from "./GradingCreate.module.css"
import Spinner from "../../components/Common/Spinner/Spinner"
import { AccountContext } from "../../context"
import { HTTP_STATUS_CODES, scrollToElementWithId } from "../../utils"
import {setError as setErrorToast, setSuccess as setSuccessToast} from "../../utils"

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
	const formattedDateTime = today.toISOString()

	const handleNavigation = async (beltId) => {
		try {

			const gradingData = {
				creator_id: userId,
				belt_id: beltId,
				step: 1,
				technique_step_num: 0,
				created_at: formattedDateTime
			}

			const response = await fetch("/api/examination/grading", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(gradingData)
			})

			if (!response.ok) {
				setErrorToast("Det har uppstått ett oväntat problem")
				throw new Error("Serverfel")

			}

			const responseData = await response.json()
			const gradingId = responseData.grading_id
			
      navigate(`/grading/${gradingId}/1`);

		} catch (error) {
			console.error("Misslyckades skapa gradering:", error)
		}

	}




	useEffect(() => {
		(async () => {
			try {
				const response = await fetch("/api/belts/all", { headers: { token } })
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
		})()
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
							key={color}
							width={"100%"}
							onClick={() => handleNavigation(belts[color].id)}
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