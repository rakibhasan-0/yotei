import { useContext, useEffect, useState } from "react"
import { AccountContext } from "../../context"
import SavedActivityList from "../../components/SavedList/SavedListInfo/SavedListComponent"

import styles from "./ListInfo.module.css"
import Tag from "../../components/Common/Tag/Tag"
import Button from "../../components/Common/Button/Button"
import { useNavigate, Link } from "react-router-dom"
import { useLocation, useParams } from "react-router"
import { Pencil, Trash } from "react-bootstrap-icons"
import ErrorState from "../../components/Common/ErrorState/ErrorState"
import Spinner from "../../components/Common/Spinner/Spinner"
import { HTTP_STATUS_CODES, setError, setSuccess, isAdminUser } from "../../utils"

import ConfirmPopup from "../../components/Common/ConfirmPopup/ConfirmPopup"

/**
 * A page for viewing lists. The user can view the information
 * about a lists on this page. Activities linked to the list
 * are displayed. Added user are also displayed.
 *
 * Props:
 *      listId @type {int} - The ID of the list.
 *      id        @type {int/string} - the id of the component
 *
 * @author Team Tomato (6) & Team Mango (Grupp 4) (2024-05-23)
 * @since 2024-05-21
 * Based on WorkoutView.jsx
 * Updated Team Mango 2024-05-22: changed check isAdmin to new check.
 *
 */

export default function ListInfo({ id }) {
	const navigate = useNavigate()
	const context = useContext(AccountContext)
	const [showPopup, setShowPopup] = useState(false)
	const [errorStateMsg, setErrorStateMsg] = useState("")
	const [loading, setLoading] = useState(true)
	const [activityListData, setActivityListData] = useState()
	const { activityListId } = useParams()
	const location = useLocation()

	useEffect(() => {
		const fetchData = async () => {
			const requestOptions = {
				headers: { "Content-type": "application/json", token: context.token },
			}

			const response = await fetch(`/api/activitylists/${activityListId}`, requestOptions).catch(() => {
				setErrorStateMsg("Serverfel: Kunde inte ansluta till servern.")
				setLoading(false)
				return
			})

			if (response.status === HTTP_STATUS_CODES.NOT_FOUND || response.status === HTTP_STATUS_CODES.NO_CONTENT) {
				setErrorStateMsg("Lista med ID '" + activityListId + "' existerar inte. Felkod: " + response.status)
				setLoading(false)
			} else if (response.status === HTTP_STATUS_CODES.FORBIDDEN) {
				setErrorStateMsg(
					"Åtkomst saknas till listan med ID '" + activityListId + "' Felkod: " + response.status
				)
				setLoading(false)
			} else if (response.status === HTTP_STATUS_CODES.BAD_REQUEST) {
				setErrorStateMsg("Bad request '" + activityListId + "' Felkod: " + response.status)
				setLoading(false)
			} else if (response.status === HTTP_STATUS_CODES.UNAUTHORIZED) {
				setErrorStateMsg("Token är inte giltig. Felkod: " + response.status)
				setLoading(false)
			} else if (response.status === 500) {
				setErrorStateMsg("Serverfel Felkod: " + response.status)
				setLoading(false)
			} else {
				const json = await response.json()
				setActivityListData(() => json)
				setLoading(false)
				setErrorStateMsg("")
			}
		}
		fetchData()
	}, [])

	const ListInfoContainer = () => {
		return (
			<>
				<div className="container px-0">
					<div className={styles.info}>
						<div className={`d-flex col ${styles.listDetailColumnItem} p-0`}>
							<title>Lista</title>
							<h1 className="font-weight-bold m-0">{activityListData.name}</h1>
						</div>
						<div className="d-flex justify-content-end align-items-center">
							<div className={styles.clickIcon}>{/*<PrintButton listData={activityListData} />*/}</div>

							{(context.userId == activityListData.author.userId || isAdminUser(context)) && (
								<>
									<Link className="ml-3" state={{ list: activityListData }} to={"/list/edit/"}>
										<Pencil
											size="24px"
											color="var(--red-primary)"
											style={{ cursor: "pointer" }}
											id={"edit_pencil"}
										/>
									</Link>
									<Trash
										className="ml-3 mr-3"
										size="24px"
										color="var(--red-primary)"
										style={{ cursor: "pointer" }}
										onClick={() => setShowPopup(true)}
									/>
								</>
							)}
						</div>

						<div className="d-flex">
							<div className={styles.listDetailColumnItem}>
								<h2 className="font-weight-bold mb-0">Synlighet</h2>
								<p className="mb-0">{activityListData.hidden ? "Privat" : "Publik"}</p>
							</div>
							<div className={styles.listDetailColumnItem} style={{ paddingLeft: "37px" }}>
								<h2 className="font-weight-bold mb-0">Författare</h2>
								{<p className="mb-0">{activityListData.author.username}</p>}
							</div>
						</div>
						<div className="d-flex" id="no-print">
							<div className={styles.listDetailColumnItem}>
								<h2 className="font-weight-bold mb-0">Skapad</h2>
								<p className="mb-0">{activityListData.date}</p>
							</div>
							<div className={styles.listDetailColumnItem} style={{ paddingLeft: "37px" }}>
								<h2 className="font-weight-bold mb-0 text-align-left">Beskrivning</h2>
								<p className={styles.properties}>{activityListData.desc}</p>
							</div>
						</div>
					</div>
				</div>
			</>
		)
	}

	const SharedUsersContainer = () => {
		return (
			<div className="container mt-3">
				<div className="row">
					<h2>Användare</h2>
				</div>
				<div className="row">
					{activityListData.users &&
						activityListData.users.map((user, index) => {
							return (
								<div key={"wu" + index} className="mr-2">
									<Tag tagType={"default"} text={user.username}></Tag>
								</div>
							)
						})}
				</div>
			</div>
		)
	}

	//Check if there's a return url present, otherwise go back to previous page
	const goBack = () => {
		const returnTo = location.state?.returnTo || -1
		navigate(returnTo)
	}

	return loading ? (
		<div className="mt-5">
			{" "}
			<Spinner />{" "}
		</div>
	) : !activityListData ? (
		<ErrorState
			message={errorStateMsg}
			onBack={() => navigate("/profile")}
			onRecover={() => window.location.reload(false)}
		/>
	) : (
		<div id={id} className="container px-0">
			{
				<ConfirmPopup
					popupText={`Är du säker att du vill radera listan "${activityListData.name}"?`}
					id={"confirm-popup"}
					setShowPopup={setShowPopup}
					showPopup={showPopup}
					onClick={async () => deleteList(activityListData.id, context, navigate, setShowPopup)}
				/>
			}
			<ListInfoContainer />

			<h2 className="font-weight-bold mb-0 mt-5 text-left">Aktiviteter</h2>
			<SavedActivityList activities={activityListData.activities} />
			{activityListData.users.length > 0 && <SharedUsersContainer />}
			<div className="d-flex row justify-content-center">
				<div className="d-flex col mb-3 mt-3 justify-content-start">
					<Button onClick={goBack} outlined={true}>
						<p>Tillbaka</p>
					</Button>
				</div>
			</div>
		</div>
	)
}

async function deleteList(listId, context, navigate, setShowPopup) {
	const requestOptions = {
		headers: { "Content-type": "application/json", token: context.token },
		method: "DELETE",
	}
	const response = await fetch("/api/activitylists/remove?id=" + listId, requestOptions).catch(() => {
		setError("Serverfel: Kunde inte ansluta till servern.")
		return
	})
	if (response.status === HTTP_STATUS_CODES.NOT_FOUND) {
		setError("Listan existerar inte längre!")
		return
	} else if (response.status === HTTP_STATUS_CODES.BAD_REQUEST) {
		setError("Kunde inte ta bort lista med id: '" + listId + "'.")
		return
	} else if (response.status != HTTP_STATUS_CODES.OK) {
		setError("Något gick snett! Felkod: " + response.status)
		return
	}
	setSuccess("Lista borttagen!")
	navigate("/profile")
	setShowPopup(false)
}
