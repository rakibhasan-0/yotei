import { useState, useEffect, useContext } from "react"
import { useNavigate} from "react-router-dom"
import BeltButton from "../../components/Common/Button/BeltButton"
import style from "./GradingCreate.module.css"
import Spinner from "../../components/Common/Spinner/Spinner"
import { AccountContext } from "../../context"
import {canHandleGradings, isAdminUser, setError as setErrorToast} from "../../utils"

/**
 * The grading create page.
 * Creates a new grading.
 * 
 * @author Team Pomegranate, Team Mango, Team Apelsin
 * @version 1.0
 * @since 2024-05-02
 */
export default function GradingCreate() {

	const [beltColors, setBeltColors] = useState([]) 
    const [protocolNames, setProtocolNames] = useState([])
	const [loading, setLoading] = useState(true)
	const context = useContext(AccountContext)
	const { token, userId } = context
	const navigate = useNavigate()
	const today = new Date()
	const formattedDateTime = today.toISOString().slice(0, 10)


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
				creatorId: userId,
				beltId: beltId,
				step: 1,
				techniqueStepNum: 0,
				title: "default",
				createdAt: formattedDateTime
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
				const gradingId = responseData.gradingId
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
				const response = await fetch("/api/examination/examinationprotocol/all", { headers: { "token": token } })
				if (response.status === 404) {
					return
				}
				if (!response.ok) {
					setLoading(false)
					throw new Error("Kunde inte hämta bälten")
				}
				const data = await response.json()
				setLoading(false)
                const colorMaps = data.map(element => ({
                    id: element.beltId,
                    hex: `#${element.beltColor}`
                }))
				setBeltColors(colorMaps)

                const protocolMap = data.map(element => {
                    let code = null
                    let color = null
                    try {
                        const parsedProtocol = JSON.parse(element.examinationProtocol)
                        if(parsedProtocol.examination_protocol) {
                            code = parsedProtocol.examination_protocol.code
                            color = parsedProtocol.examination_protocol.color
                        }
                    } catch (error) {
                        console.error("Failed to parse examinationProtocol for element with beltId", element.beltId, error)
                    }
                    return {
                        id: element.beltId,
                        code: code,
                        color: color
                    }
                })
                setProtocolNames(protocolMap)
        
			} catch (ex) {
				setErrorToast("Kunde inte hämta bälten")
				setLoading(false)
				console.error(ex)
			}
		}
		fetchData()
	}, [token])

	if(!isAdminUser(context) && !canHandleGradings(context)){
		window.location.replace("/404")
		return null
	}

	return (
		<div> 
			<div className = {style.titleStyle}> 
				<h1>Välj graderingsprotokoll</h1>
			</div>
			{loading ? <Spinner /> : ( 
				<div>
					{beltColors.map((belt, index) => (
						<BeltButton
							id={belt.id}
							key={belt.id}
							width={"100%"}
							onClick={() => createGrading(belt.id, belt.hex)}
							color={belt.hex}
						
						>
							<h2>{`${protocolNames[index].code} ${protocolNames[index].color}`} </h2>
						</BeltButton>
					))}
				</div>
			)}
		</div>
	)
}