import React, { useState, useContext, useEffect} from "react"
import { useNavigate } from "react-router-dom"
import { AccountContext } from "../../context"
import UserBoxGrading from "../../components/Grading/UserBoxGrading"
import Button from "../../components/Common/Button/Button"
import PopupSmall from "../../components/Common/Popup/PopupSmall"
import styles from "./GradingBefore.module.css"
import { Download } from "react-bootstrap-icons"
import { useParams } from "react-router-dom"
import { canHandleGradings, isAdminUser } from "../../utils"
import Spinner from "../../components/Common/Spinner/Spinner"

/**
 * Page to show all examinees for a grading after the grading has been completed.
 * 
 * @author Team Pomegranate(ens20lpn), Team Mango
 * @version 1.0
 * @since 2024-05-15
 */
export default function GradingAfter() {
	const [showPopup, setShowPopup] = useState(false)
	const context = useContext(AccountContext)
	const { token} = context
	const { gradingId } = useParams()
	const navigate = useNavigate()
	const [grading, setGrading] = useState([])	
	const[totalAmountOfTechniques, setTotalAmountOfTechniques] = useState("")
	const[fetchedResult, setFetchedResult] = useState([])
	const [beltInfo, setBeltInfo] = useState({
		belt_name: "",
		color: "" 
	})
	const [fetchedBelt, setFetchedBelt] = useState([])
	const [ isGrading, setIsGrading ] = useState(false)
	const [ isBelt, setIsBelt ] = useState(false)
	const [ isExaminee, setIsExaminee ] = useState(false)
	const [ downloadingPdf, setDownloadingPdf] = useState(false)

	let hasNullTechnique = false
	/**
	 * Function to fetch the grading from the backend.
	 * @returns {Promise} The grading data.
	 * @since 2024-05-15
	 */
	const fetchGrading = () => {
		return fetch(`/api/examination/grading/${gradingId}`, {
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
	 * Function to fetch the belts from the backend.
	 * @returns {Promise} The belt data.
	 * @since 2024-05-15
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
	 * Function that fetches all of the results of each examinee.
	 * @returns {Promise} The belt data.
	 * @since 2024-05-15
	 */
	const fetchExamineeResult = () => {
		return fetch(`/api/examination/examresult/grading/${gradingId}`, {
			method: "GET",
			headers: { "token": token }
		}).then(response => {
			if(!response.ok){
				throw new Error("Network response was not ok")
			}
			return response.json()
		})
	}

	/**
	 * Function that fetchs all of the results of each examinee.
	 * @returns {Promise} The belt data.
	 * @since 2024-05-15
	 */
	const fetchPdf = async () => {
		try {
			const response = await fetch(`/api/examination/exportpdf/${gradingId}`, {
				method: "GET",
				headers: { "token": token }
			})
	
			if (!response.ok) {
				throw new Error("Nätverk svar var inte OK, felkod: " + response.status)
			}
	
			const base64String = await response.text()
			const byteCharacters = window.atob(base64String) // Decode base64 string
			const byteNumbers = new Array(byteCharacters.length)
			for (let i = 0; i < byteCharacters.length; i++) {
				byteNumbers[i] = byteCharacters.charCodeAt(i)
			}
			const byteArray = new Uint8Array(byteNumbers)
			const blob = new Blob([byteArray], {type: "application/pdf"}) // Create a blob from the byte array
			return blob
		} catch (error) {
			console.error("Ett fel inträffade vid hämtning av PDF, felkod:" + error)
		}
	}
	
	/**
	 * Function that creates a PDF by the result of the examination and downloads it.
	 * @returns {void}
	 */
	const downloadPdf = async () => {
		setDownloadingPdf(true)
		const pdfBlob = await fetchPdf()
		if (pdfBlob) {
			const url = window.URL.createObjectURL(pdfBlob)
			console.log("URL created:", url)
			const link = document.createElement("a")
			link.href = url
			link.setAttribute("download", grading.title)
			document.body.appendChild(link)
			link.click()
			setTimeout(() => { 
				window.URL.revokeObjectURL(url)
				link.remove()
			}, 100)
			window.URL.revokeObjectURL(url)
			link.remove()
			
		}
		setDownloadingPdf(false)
	}

	/**
	 * Update step for the grading process. 
	 * @param {String} grading_data data on JSON format for a grading
	 * @param {Int} newStepNum New step that should be updated to database
	 * @returns status code
	 */
	function updateStep(newStepNum) {
		const grading_data = grading
		grading_data.step = newStepNum
		setGrading(grading_data)

		return fetch("/api/examination/grading", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"token": token },
			body: JSON.stringify(grading_data),

		})
			.then(response => {
				if (!response.ok) {
					throw new Error("Network response was not ok")
				}
				return response.status

			})
	}

	/**
	 * Function to save and exit a grading, navigates to grading startpage.
	 */
	async function saveAndExitGrading(){
		await updateStep(4)
		navigate("/grading")

	}
    
	/**
	 * Function to navigate back to the examination page.
	 */
	const navigateBack = async () => {
		if (grading.step === 3){
			await updateStep(2)
			navigate(`/grading/${gradingId}/2`)
		} 
		else{
			navigate("/grading")
		}
		
	}
	
	/**
	 * Fetches the grading and belt data when the component mounts.
	 */
	useEffect(() => {
		
		const fetchData = async () => {
			try {
				const [grading_data, belt_data, result_data] = await Promise.all([
					fetchGrading(),
					fetchBelts(),
					fetchExamineeResult()
				])
				setIsGrading(true)
				setGrading(grading_data)

				setIsBelt(true)
				setFetchedBelt(belt_data)

				setIsExaminee(true)
				setTotalAmountOfTechniques(result_data.totalTechniques)
				setFetchedResult(result_data)
			} catch (error) {
				console.error("There was a problem with the fetch operation:", error)
			}
		}
		fetchData()

	}, [])

	useEffect(() => {
		if(isGrading && isBelt && isExaminee){
			const matchingBelt = fetchedBelt.find(belt => belt.id === grading.beltId)
			if (matchingBelt) {
				setBeltInfo({
					belt_name: matchingBelt.name,
					color: "#" + matchingBelt.color
				})
			}
			setIsBelt(false)
			setIsGrading(false)
			setIsExaminee(false)
		}
	}, [grading, beltInfo, fetchedResult, isGrading, isBelt, isExaminee, fetchedBelt])

	if(!isAdminUser(context) && !canHandleGradings(context)){
		window.location.replace("/404")
		return null
	}

	return (
		<div className={styles.container}>
			<div>
				<div className={styles.topContainer}>
					<div className={styles.content}>
						<div style={{ backgroundColor: beltInfo.color, borderRadius: "0.3rem", padding: "0px" }}>
							<h2
								style={{ color : beltInfo.color === "#201E1F" ? "white" : "black" }}
							>{grading.title}</h2>
						</div>
					</div>
					<h1 style={{ fontFamily: "Open Sans", fontSize: "25px", paddingTop: "10px", paddingBottom: "10px" }}>Summering </h1>
				</div>
    
				<div className={styles.scrollableContainer}>
					{fetchedResult.examineeResults && fetchedResult.examineeResults.map((examinee) => {
						const totalTechniques = examinee.failedTechniques + examinee.passedTechniques
						hasNullTechnique = totalTechniques < totalAmountOfTechniques
						return (
							<UserBoxGrading
								key={examinee.examineeId}
								id={examinee.examineeId}
								name={examinee.name}
								passedTechniques={examinee.passedTechniques}
								totalAmountOfTechniques={totalAmountOfTechniques}	
								hasNullTechnique={hasNullTechnique} 		
							/>
						)
					})}
				</div>

    
				<div className={styles.bottomContainer}>
					<div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "10px" }}>
						{
							downloadingPdf ? 
								<div className={styles.spinner}>
									<Spinner></Spinner>
								</div>
								:
								null
						}
						<Button
							style={{
								backgroundColor: "#FFD700",
								borderRadius: "0.1rem",
								padding: "0px",
								height: "50px"
							}}
							width={"60px"}
							onClick={downloadPdf}
						>
							<Download size={30} color="white" />
						</Button>
					</div>
    
					<div className={styles.buttonContainer} style={{ paddingTop: "10px" }}>
						<Button
							width="100%"
							outlined={true}
							onClick={navigateBack}
						>
							<p>Tillbaka</p>
						</Button>

						<PopupSmall id={"test-popup"} title={"Varning"} isOpen={showPopup} setIsOpen={setShowPopup} direction={saveAndExitGrading}>
							<h2>En eller flera deltagare saknar gradering på vissa övningar.</h2>
							<h2>Du kan gå tillbaka och sätta gradering.</h2>
							<h2>Men det går <span style={{ fontWeight: "bold", fontSize: "18px" }}>inte</span> att redigera gradering i efterhand.</h2>
							<br></br>
							<h2> När du är redo, avsluta graderingsprocessen.</h2>
						</PopupSmall>
						
						{grading.step === 4 ? null : (
							hasNullTechnique ? (
								<Button
									width="100%"
									onClick={() => setShowPopup(true)}
								>
									<p>Spara och avsluta</p>
								</Button>
							) : (
								<Button
									width="100%"
									onClick={saveAndExitGrading}
								>
									<p>Spara och avsluta</p>
								</Button>
							)
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
