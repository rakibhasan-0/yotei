import { useState, useEffect, useCallback, useContext } from "react"
import { useNavigate, useParams } from "react-router"
import { setError as setErrorToast, setSuccess as setSuccessToast } from "../../../utils"
import BeltPicker from "../../../components/Common/BeltPicker/BeltPicker"
import { Trash } from "react-bootstrap-icons"
import styles from "./EditGroup.module.css"
import Button from "../../../components/Common/Button/Button"
import ErrorState from "../../../components/Common/ErrorState/ErrorState"
import { Spinner } from "react-bootstrap"
import { AccountContext } from "../../../context"
import Popup from "../../../components/Common/Popup/Popup"
import InputTextFieldBorderLabel from "../../../components/Common/InputTextFieldBorderLabel/InputTextFieldBorderLabel"
import ConfirmPopup from "../../../components/Common/ConfirmPopup/ConfirmPopup"
import { unstable_useBlocker as useBlocker } from "react-router"

/**
 * Edit page for Groups.
 *
 * Example usage:
 *     <EditGroup />
 *
 * @author Medusa (Grupp 6), Team Durian (Group 3) (2024-04-24)
 * @version 1.0
 * @since 2023-05-25
 */

function EditGroup() {

	// Navigation
	const navigate = useNavigate()
	const { groupID } = useParams()

	const { token } = useContext(AccountContext)

	// Form state
	const [name, setName] = useState("")
	const [belts, setBelts] = useState([])
	const [userId, setUserId] = useState(null)
	
	const [originalName, setOriginalName] = useState("")
	const [originalBelts, setOriginalBelts] = useState([])


	// Error and loading handling
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(false)
	const [confirmationOpen, setConfirmationOpen] = useState(false)
	const [isBlocking, setIsBlocking] = useState(false)
	const [goBackPopup, setGoBackPopup] = useState(false)

	if (groupID === undefined) setError("blää")

	const blocker = useBlocker(() => {
		if (isBlocking) {
			setGoBackPopup(true)
			return true
		}
		return false
	})

	const fetchGroup = useCallback(async () => {
		setLoading(true)
		setError(false)

		const res = await fetch("/api/plan/all", { headers: { token: token } })

		if (!res.ok) {
			setError(await res.text())
			setLoading(false)
			return
		}
		const groups = await res.json()
		const group = groups.find(group => group.id == groupID)

		setName(group.name)
		setBelts(group.belts)
		setUserId(group.userId)
		setOriginalName(group.name)
		setOriginalBelts(group.belts)

		setError(false)
		setLoading(false)
	}, [groupID])

	// On first render, fetch the group.
	useEffect(() => { fetchGroup() }, [fetchGroup])

	const handleBeltChanged = (checked, belt) => {
		setBelts(prev => {
			if (!checked) {
				return prev.filter(b => b.id !== belt.id)
			}
			else {
				return [...prev, belt]
			}
		})
	}

	useEffect(() => {
		setIsBlocking(name != originalName || belts != originalBelts)
	},[name, belts, originalName,originalBelts])

	const handleSubmit = async () => {
		setIsBlocking(false)
		const res = await fetch("/api/plan/update/",
			{
				method: "PUT",
				body: JSON.stringify({ id: groupID, name, belts, userId }),
				headers:
				{
					token,
					"Content-Type": "application/json"
				}
			})

		if (!res.ok) {
			setErrorToast(await res.text())
			return
		}
		setSuccessToast("Ändringar sparade.")
		navigate(-1)
	}

	const handleDelete = async () => {
		setIsBlocking(false)
		const res = await fetch("/api/plan/remove?id=" + groupID,
			{
				method: "DELETE",
				headers:
				{
					token,
					"Content-Type": "application/json"
				}
			})

		if (!res.ok) {
			setErrorToast(await res.text())
			return
		}
		setSuccessToast("Ändringar sparade.")
		navigate("/groups")
	}

	if (loading) return <Spinner />

	if (error) return (
		<ErrorState
			message={error}
			onBack={() => navigate("/plan")}
			onRecover={fetchGroup}
		/>
	)

	return (
		<div className={styles.container}>
			<title>Redigera grupp</title>
			<h1 className="mb-4">Redigera grupp</h1>
			<Trash
				size="32px"
				color="var(--red-primary)"
				className={styles.trashcan}
				onClick={() => setConfirmationOpen(true)}
			/>

			<InputTextFieldBorderLabel
				label="Namn"
				text={name}
				onChange={e => setName(e.target.value)}
			/>

			<BeltPicker
				states={belts}
				onToggle={handleBeltChanged}
			/>

			<div className={styles.buttonContainer}>
				<Button
					width="100%"
					outlined={true}
					onClick={() => navigate(-1)}
				>
					<p>Tillbaka</p>
				</Button>

				<Button
					width="100%"
					onClick={handleSubmit}
				>
					<p>Spara</p>
				</Button>
			</div>

			<Popup
				isOpen={confirmationOpen}
				setIsOpen={setConfirmationOpen}
				style={{ height: "310px", width: "90vw", maxWidth: "400px", paddingTop: "4rem" }}
			>
				<h1>Är du säker på att du vill ta bort denna grupp?</h1>
				<p>Samtliga tillfällen kopplade till denna grupp kommer tas bort. Denna åtgärd går inte att ångra.</p>

				<div className={styles.buttonContainer}>
					<Button
						width="100%"
						outlined={true}
						onClick={() => setConfirmationOpen(false)}
					>
						<p>Avbryt</p>
					</Button>

					<Button
						width="100%"
						onClick={handleDelete}
					>
						<p>Ta bort grupp</p>
					</Button>
				</div>
			</Popup>
			<ConfirmPopup
				showPopup={goBackPopup}
				setShowPopup={setGoBackPopup}
				popupText={"Är du säker på att du vill lämna sidan? Dina ändringar kommer inte att sparas."}
				confirmText="Lämna"
				backText="Avbryt"
				onClick={async () => {
					blocker.proceed()
				}}
			/>
		</div>
	)
}
export default EditGroup