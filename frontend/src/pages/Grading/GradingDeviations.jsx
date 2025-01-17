/* eslint-disable indent */
import { useState, useEffect, useContext } from "react"
import Button from "../../components/Common/Button/Button"
import styles from "./GradingDeviations.module.css"
import Divider from "../../components/Common/Divider/Divider"
import Container from "./GradingDeviationContainer"
import CheckBox from "../../components/Common/CheckBox/CheckBox"
import { Download } from "react-bootstrap-icons"
import { useNavigate, useParams } from "react-router-dom"
import { HTTP_STATUS_CODES, canHandleGradings, isAdminUser, setError } from "../../utils"
import { AccountContext } from "../../context"
import Spinner from "../../components/Common/Spinner/Spinner"



/**
 * The grading deviation page.
 * Imports grading data and displays if the user passed or not 
 * and shows comments if there are any.
 * 
 * @author Team Pomegranate, Team Mango
 * @version 1.0
 * @since 2024-05-07
 */


export default function GradingDeviations() {
	const [toggled, setToggled] = useState(false)
	const [techniqueCategories, setTechniqueCategories] = useState([])
	const [gradingId, setGradingId] = useState(-1)
	const { userId } = useParams() //The user id of the current examinee
	const [name, setName] = useState("") //The name of the current examinee
	const [showingDeviationsOnly, setShowingDeviationsOnly] = useState(true)
	const [resultList, setResultList] = useState([])
	const [personalComments, setPersonalComments] = useState([])
	const [pairComments, setPairComments] = useState([])
	const [groupComments, setGroupComments] = useState([])
	const [ downloadingPdf, setDownloadingPdf] = useState(false)

	const context = useContext(AccountContext)

	const navigate = useNavigate()

	useEffect(() => {
		/**
		 * Fetches all data required for this page
		 */
		const fetchData = async () => {
			const requestOptions = {
				headers: { "Content-type": "application/json", token: context.token }
			}

			const response = await fetch("/api/examination/examinee/" + userId, requestOptions).catch(() => {
				setError("Serverfel: Kunde inte ansluta till servern.")
				return
			})

			if (response.status != HTTP_STATUS_CODES.OK) {
				setError("Kunde inte hämta examinee. Felkod: " + response.status)
			} else {
				const json = await response.json()
				setGradingId(json["gradingId"])
				setName(json["name"])
				fetchResult(json["gradingId"])
				fetchGrading(json["gradingId"])
				fetchPersonalComments()
				fetchGroupComments(json["gradingId"])
				fetchPairComments(json["gradingId"])
			}
		}

		/**
		 * Fetches a grading entry based on the grading ID
		 * @param {int} gradingId the grading ID of which to fetch a grading from 
		 */
		const fetchGrading = async (gradingId) => {
			const requestOptions = {
				headers: { "Content-type": "application/json", token: context.token }
			}

			const response = await fetch("/api/examination/grading/" + gradingId, requestOptions).catch(() => {
				setError("Serverfel: Kunde inte ansluta till servern.")
				return
			})

			if (response.status != HTTP_STATUS_CODES.OK) {
				setError("Kunde inte hämta gradering. Felkod: " + response.status)
			} else {
				const json = await response.json()
				fetchProtocol(json["beltId"])
			}
		}

		/**
		 * Fetches the correct grading protocol based on the belt ID
		 * @param {int} beltId The belt ID of this grading 
		 * @returns The entire grading protocol for the specified belt ID
		 */
		const fetchProtocol = async (beltId) => {
			const requestOptions = {
				headers: { "Content-type": "application/json", token: context.token }
			}
			const response = await fetch("/api/examination/examinationprotocol/all", requestOptions).catch(() => {
				setError("Serverfel: Kunde inte ansluta till servern.")
				return
			})

			if (response.status != HTTP_STATUS_CODES.OK) {
				setError("Kunde inte hämta graderingsprotokollen. Felkod: " + response.status)
				return
			}
			const json = await response.json()

			//Loop to find the right protocol based on the current gradings belt
			for (let i = 0; i < json.length; i++) {
				if (beltId === json[i]["beltId"]) { //Found the correct protocol, set the data
					let examinationProtocol = JSON.parse(json[i]["examinationProtocol"])
					let categories = examinationProtocol.categories
					setTechniqueCategories(categories)
					return
				}
			}
		}

		/**
		 * Fetches an examinees grading results
		 * @param {int} gradingId the id of the current grading 
		 * @returns Sets the result list array with boolean values
		 */
		const fetchResult = async (gradingId) => {
			const requestOptions = {
				headers: { "Content-type": "application/json", token: context.token }
			}
			const response = await fetch("/api/examination/examresult/" + gradingId + "/" + userId, requestOptions).catch(() => {
				setError("Serverfel: Kunde inte ansluta till servern.")
				return
			})
			if (response.status != HTTP_STATUS_CODES.OK) {
				setError("Kunde inte hämta graderingsresultat. Felkod: " + response.status)
				return
			}
			const json = await response.json()
			setResultList(json)
		}

		/**
		 * Fetches an examinees personal grading comments
		 * @returns Sets the personal comment array
		 */
		const fetchPersonalComments = async () => {
			const requestOptions = {
				headers: { "Content-type": "application/json", token: context.token }
			}
			const response = await fetch("/api/examination/comment/examinee/all/" + userId, requestOptions).catch(() => {
				setError("Serverfel: Kunde inte ansluta till servern.")
				return
			})
			if (response.status != HTTP_STATUS_CODES.OK) {
				setError("Kunde inte hämta personliga kommentarer. Felkod: " + response.status)
				return
			}
			const json = await response.json()
			setPersonalComments(json)
		}

		/**
		 * Fetches an examinees pair comments
		 * @param {int} gradingId the id of the current grading 
		 * @returns Sets the pair comment array
		 */
		const fetchPairComments = async (gradingId) => {
			const requestOptions = {
				headers: { "Content-type": "application/json", token: context.token }
			}
			const response = await fetch("/api/examination/pair/grading/" + gradingId, requestOptions).catch(() => {
				setError("Serverfel: Kunde inte ansluta till servern.")
				return
			})
			if (response.status != HTTP_STATUS_CODES.OK) {
				setError("Kunde inte hämta graderingens par. Felkod: " + response.status)
				return
			}
			const json = await response.json()
			for (let i = 0; i < json.length; i++) {
				const examinee1 = json[i]["examinee_1"]
				const examinee2 = json[i]["examinee_2"]

				if ((examinee1 && examinee1.id == userId) || (examinee2 && examinee2.id == userId)) {
					const response2 = await fetch("/api/examination/comment/pair/all/" + json[i]["pair_id"], requestOptions)
					
					if (response2.status != HTTP_STATUS_CODES.OK) {
						setError("Kunde inte hämta par-kommentarer. Felkod: " + response2.status)
						return
					}
					const json2 = await response2.json()
					setPairComments(json2)
				}
			}
		}

		/**
		 * Fetches the entire groups comments
		 * @param {int} gradingId the id of the current grading 
		 * @returns Sets the group comment array
		 */
		const fetchGroupComments = async (gradingId) => {
			const requestOptions = {
				headers: { "Content-type": "application/json", token: context.token }
			}
			const response = await fetch("/api/examination/comment/group/all/" + gradingId, requestOptions).catch(() => {
				setError("Serverfel: Kunde inte ansluta till servern.")
				return
			})
			if (response.status != HTTP_STATUS_CODES.OK) {
				setError("Kunde inte hämta gruppens kommentarer. Felkod: " + response.status)
				return
			}
			const json = await response.json()
			setGroupComments(json)
		}

		fetchData()
	}, [])

	if (!isAdminUser(context) && !canHandleGradings(context)) {
		window.location.replace("/404")
		return null
	}

	function hasStatus(techniqueName) {
		for (let i = 0; i < resultList.length; i++) {
			if (resultList[i] != null) {
				if (resultList[i]["techniqueName"] == techniqueName) {
					return true
				}
			}
		}
		return false
	}

	/**
	 * Checks if the examinee has passed a specific technique
	 * @param {Technique} technique 
	 * @returns Boolean value statomg whether the examinee has passed the technique or not
	 */
	function hasPassed(techniqueName) {
		for (let i = 0; i < resultList.length; i++) {
			if (resultList[i] != null) {
				if (resultList[i]["techniqueName"] == techniqueName) {
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
		if (!hasPassed(techniqueName)) {
			return true
		}
		if (getPersonalComment(techniqueName) != "") {
			return true
		}
		if (getPairComment(techniqueName) != "") {
			return true
		}
		if (getGroupComment(techniqueName) != "") {
			return true
		}
		return false
	}

	/**
	 * Gets the personal comment of a given technique
	 * @returns The personal comment of a given technique
	 */
	function getPersonalComment(techniqueName) {
		for (let i = 0; i < personalComments.length; i++) {
			if (personalComments[i].techniqueName == techniqueName) {
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
		for (let i = 0; i < pairComments.length; i++) {
			if (pairComments[i].techniqueName == techniqueName) {
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
		for (let i = 0; i < groupComments.length; i++) {
			if (groupComments[i].techniqueName == techniqueName) {
				return groupComments[i].comment
			}
		}
		return ""
	}

	/**
	 * Downloads a pdf of the current examinee's performance
	 * @returns {void}
	 */
	async function downloadPdf() {
		setDownloadingPdf(true)
		const pdfBlob = await fetchPdf()
		if (pdfBlob) {
			const url = window.URL.createObjectURL(pdfBlob)
			const link = document.createElement("a")
			link.href = url
			link.setAttribute("download", "Gradering_" + name + ".pdf")
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
	 * Function that fetches all of the results of an examinee.
	 * @returns {Promise} The belt data.
	 * @since 2024-05-15
	 */
	const fetchPdf = async () => {
		try {
			const response = await fetch(`/api/examination/exportExamineePDF/${userId}`, {
				method: "GET",
				headers: { "token": context.token }
			})
	
			if (!response.ok) {
				setError("Nätverk svar var inte OK, felkod: " + response.status)
				return
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
			setError("Ett fel inträffade vid hämtning av PDF, felkod:"  + error)
			return null
		}
	}

	/**
	 * Get a checkbox which toggles between showing all techniques and only deviating ones
	 * @returns A checkbox
	 */
	function getToggleCheckBox() {
		return (
			<div className="d-flex justify-content-center">
				<CheckBox
					className={styles["showAllCheckbox"]}
					checked={true}
					label="Visa endast avvikelser"
					onClick={(checked) => { setShowingDeviationsOnly(checked) }}
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
						{techniqueCategories.map((category, index_div, index_id) => (
							<div className={styles["sc23-outline"]} id={category} key={index_div}>
								<Divider id='divider-example' option='h2_left' title={category.category_name} key={index_id} />
								{category.techniques.map((technique, index) => (
									(isDeviating(technique.text) || !showingDeviationsOnly) ?
										<Container id={index} name={technique.text} passed={hasStatus(technique.text) ? hasPassed(technique.text) : undefined} key={index}
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
			<div className={styles.bottomRowContainer}>
				<Button
					style={{
						backgroundColor: "#FFD700",
						borderRadius: "0.1rem",
						padding: "0px",
						height: "50px"
					}}
					width={"60px"}
					onClick={downloadPdf}>
					<Download size={30} color="white" />
				</Button>
				<div className={styles.spinner}>
					{
						downloadingPdf ? 
							<Spinner/>
						:
							null
					}
				</div>
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
		<div className={styles.container}>
			<div className={styles.scrollableContainer}>

					<div className={styles.topContainer}>
						<h1 style={{ fontFamily: "Open Sans", fontSize: "25px", paddingTop: "5x", paddingBottom: "0px" }}>{name}</h1>
						<h4 style={{ fontFamily: "Open Sans", fontSize: "15px", paddingTop: "0px", paddingBottom: "5x" }}>Kommentarer</h4>
					</div>
					{getToggleCheckBox()}
					<div className={styles["sc23-session-header-clickable"]} role="button" onClick={() => setToggled(!toggled)}>
					</div>
					{getActivityContainer()}

			</div>
			{getBackButton()}
		</div>
	)
}