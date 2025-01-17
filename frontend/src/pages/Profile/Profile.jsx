import { useContext, useEffect, useState } from "react"
import { useCookies } from "react-cookie"
import { Tab, Tabs } from "react-bootstrap"
import { isAdminUser, setError as setErrorToast, setSuccess as setSuccessToast } from "../../utils"
import ActivityList from "../../components/Activity/ActivityList"
import Button from "../../components/Common/Button/Button"
import SearchBar from "../../components/Common/SearchBar/SearchBar"
import { getWorkouts, getLists } from "../../components/Common/SearchBar/SearchBarUtils"
import { AccountContext } from "../../context"
import style from "./Profile.module.css"
import InputTextFieldBorderLabel from "../../components/Common/InputTextFieldBorderLabel/InputTextFieldBorderLabel"
import { logOut } from "../../utils"
import useMap from "../../hooks/useMap"
import Divider from "../../components/Common/Divider/Divider"
import Spinner from "../../components/Common/Spinner/Spinner"
import ProfileListItem from "../../components/Profile/ProfileListItem"
import { Lock, Eye } from "react-bootstrap-icons"
import RoundButton from "../../components/Common/RoundButton/RoundButton"
import { Plus } from "react-bootstrap-icons"
import { useNavigate } from "react-router"
/**
 * @author Chimera, Team Mango (Group 4), Team Pomegranate(Group 1), Team Durian (Group 3), Team Tomato (6), Team Kiwi (Group 2)
 * @since 2024-05-16
 * @version 3.0
 * @updated 2024-05-23
 *
 * @returns a page for managing the user's account
 */
export default function Profile() {
	const { userId, token } = useContext(AccountContext)
	const navigate = useNavigate()

	const [workouts, setWorkouts] = useState()
	const [searchText, setSearchText] = useState("")
	const [searchListText, setSearchListText] = useState("")

	const [cache, cacheActions] = useMap()
	const [password, setPassword] = useState("")
	const [newPassword, setNewPassword] = useState("")
	const [verifyNewPassword, setVerifyNewPassword] = useState("")
	const [wrongUsernamePassword, setWrongUsernamePassword] = useState()
	const [wrongPassword, setWrongPassword] = useState()
	const [missMatchPassword, setMissMatchPassword] = useState()
	const [loading, setIsLoading] = useState(true)
	const [newUsername, setNewUsername] = useState("")
	const [usernamePassword, setUsernamePassword] = useState("")
	const [passwordButtonState, setPasswordButtonDisabled] = useState(false)
	const [usernameButtonState, setUsernameButtonDisabled] = useState(false)
	const context = useContext(AccountContext)

	const [fetchedLists, setFetchedLists] = useState(false)
	const [lists, setLists] = useState([])
	const [map, mapActions] = useMap()
	const [isFavouriteWorkoutsFetched, setIsFavouriteWorkoutsFetched] = useState(false)
	const [cookies, setCookie] = useCookies(["previousPath"])
	const [amountOfFavouriteWorkouts, setAmountOfFavouriteWorkouts] = useState(0)

	useEffect(() => {
		setCookie("previousPath", "/profile", { path: "/" })
	}, [setCookie, cookies.previousPath])

	const workout = {
		id: -1,
		name: "Favoritpass",
		size: 7,
		author: {
			userId: 1,
			username: "Admin",
		},
		hidden: false,
	}
	const userName = context.username || "Vet ej"

	//Future-proofs so that it will get all of the favourite workouts until 2060
	const getAmountOfFavouriteWorkouts = async () => {
		const args = {
			from: "1980-01-01",
			to: "2060-01-01",
			selectedTags: "",
			id: userId,
			text: "",
			isFavorite: true,
		}
		getWorkouts(args, token, null, null, (response) => {
			if (response.error) {
				setAmountOfFavouriteWorkouts(0)
			} else {
				setAmountOfFavouriteWorkouts(response.results.length)
			}
			setIsFavouriteWorkoutsFetched(true)
		})
	}

	/* Workout management */
	const WorkoutList = ({ list }) => {
		// eslint-disable-next-line no-unused-vars
		const onFavorite = async (_, workout) => {
			// Workaround for updating the list
			// due to how the star button in the activity list works
			setWorkouts((old) => [
				...old.map((w) => {
					if (w.workoutID === workout.workoutID) {
						w.favourite
							? setAmountOfFavouriteWorkouts(amountOfFavouriteWorkouts - 1)
							: setAmountOfFavouriteWorkouts(amountOfFavouriteWorkouts + 1)
						w.favourite = !w.favourite
					}
					return w
				}),
			])
		}
		return (
			<>
				{list && (
					<ActivityList
						id="workout-list"
						activities={list}
						apiPath={"workouts"}
						favoriteCallback={onFavorite}
					/>
				)}
			</>
		)
	}

	useEffect(() => {
		getAmountOfFavouriteWorkouts()
	}, [])
	useEffect(() => {
		if (isFavouriteWorkoutsFetched) {
			workout.size = amountOfFavouriteWorkouts
			setFetchedLists(false)
			setLists([workout])
			fetchingList()
		}
	}, [isFavouriteWorkoutsFetched, amountOfFavouriteWorkouts])

	/**
	 * Fetches lists when the component is mounted or when the
	 * search text are changed.
	 */
	useEffect(() => {
		setFetchedLists(false)
		setLists([workout])
		fetchingList()
	}, [searchListText])

	useEffect(() => {
		getWorkouts(
			{ text: searchText, isFavorite: false, id: userId, selectedTags: "" },
			token,
			cache,
			cacheActions,
			(list) => {
				if (list.error) {
					return setErrorToast("Kunde inte hämta pass!")
				}
				setWorkouts(list.results)
				setIsLoading(false)
			}
		)
	}, [searchText, token, userId, cache, cacheActions])

	useEffect(() => {
		if (password === "" || newPassword === "" || verifyNewPassword === "") {
			setPasswordButtonDisabled(true)
		} else {
			setPasswordButtonDisabled(false)
		}

		if (newUsername === "" || usernamePassword === "") {
			setUsernameButtonDisabled(true)
		} else {
			setUsernameButtonDisabled(false)
		}
	}, [password, newPassword, verifyNewPassword, newUsername, usernamePassword])

	/* Account management */

	const changePassword = async () => {
		setWrongPassword(null)
		setWrongUsernamePassword

		if (newPassword !== verifyNewPassword) {
			return setMissMatchPassword("Lösenorden matchar inte")
		}

		setMissMatchPassword(null)

		const requestOptions = {
			headers: { "Content-Type": "application/json", token },
			method: "PUT",
			body: JSON.stringify({
				newPassword: newPassword,
				verifyNewPassword: verifyNewPassword,
				oldPassword: password,
				id: userId,
			}),
		}
		const response = await fetch("/api/users/password", requestOptions)
		if (!response.ok) {
			return setWrongPassword("Lösenordet stämmer inte")
		}
		setSuccessToast("Lösenordet har ändrats.")
	}

	const changeUsername = async () => {
		setWrongPassword(null)
		setMissMatchPassword(null)
		setWrongUsernamePassword(null)
		const requestOptions = {
			headers: { "Content-Type": "application/json", token },
			method: "PUT",
			body: JSON.stringify({ newUsername: newUsername, password: usernamePassword, id: userId }),
		}
		const response = await fetch("/api/users/name", requestOptions)
		if (response.status === 400) {
			return setWrongUsernamePassword("Lösenordet stämmer inte")
		}
		if (response.status === 406) {
			return setErrorToast("Användarnamnet finns redan")
		}
		if (!response.ok) {
			return setErrorToast("Ett okänt fel inträffade på servern")
		}
		setSuccessToast("Användarnamnet har ändrats.")
	}

	const getIconFromState = (state) => {
		if (state.id == -1) {
			return <img src="/starFill.svg" />
		}
		if (state.hidden === true) {
			return <Lock size={36} />
		} else {
			return <Eye size={36} />
		}
	}

	/**
	 * Fetches the lists from the backend, either from cache or by a new API-call.
	 */
	async function fetchingList() {
		const args = {
			hidden: false,
			isAuthor: isAdminUser(context) ? false : true,
			text: searchListText,
			isShared: false,
		}

		getLists(args, token, map, mapActions, (result) => {
			if (result.error) {
				//Should handle error
				setFetchedLists(true)
				return
			}

			if (result && result.results) {
				const lists = result.results.map((item) => ({
					id: item.id,
					name: item.name,
					size: item.size,
					author: item.author,
					hidden: item.hidden,
					isShared: item.isShared,
				}))

				setLists([workout, ...lists])
				setFetchedLists(true)
			}
		})
	}

	const handleCreateList = () => {
		navigate("/list/create", { state: { returnTo: "/profile" } })
	}

	return (
		<Tabs defaultActiveKey={"MyLists"} className={style.tabs}>
			<Tab eventKey={"MyLists"} title={"Mina listor"} className={style.tab}>
				<SearchBar
					id="searchbar-workouts-1"
					placeholder="Sök efter listor"
					text={searchListText}
					onChange={setSearchListText}
				/>
				{!fetchedLists ? (
					<Spinner />
				) : (
					lists.map((list) => <ProfileListItem key={list.id} item={list} Icon={getIconFromState(list)} />)
				)}
				<RoundButton onClick={handleCreateList}>
					<Plus />
				</RoundButton>
			</Tab>

			<Tab eventKey={"MyWorkouts"} title={"Mina Pass"} className={style.tab}>
				<SearchBar
					id="searchbar-workouts-2"
					placeholder="Sök efter pass"
					text={searchText}
					onChange={setSearchText}
				/>
				{loading ? <Spinner /> : <WorkoutList list={workouts?.filter((w) => w.author === userId)} />}
			</Tab>
			<Tab eventKey={"Settings"} title={"Inställningar"} className={style.tab}>
				<div className={style.divider}>
					<Divider option={"h2_center"} title={"Lösenord"} />
				</div>
				<title>Min sida</title>
				<InputTextFieldBorderLabel
					errorMessage={wrongPassword}
					onChange={(e) => {
						setPassword(e.target.value)
					}}
					id="current-password"
					type="text"
					label="Nuvarande lösenord"
				/>
				<div className="mb-2" />
				<InputTextFieldBorderLabel
					onChange={(e) => {
						setNewPassword(e.target.value)
					}}
					id="new-password"
					type="password"
					label="Nytt lösenord"
				/>
				<div className="mb-2" />
				<InputTextFieldBorderLabel
					errorMessage={missMatchPassword}
					onChange={(e) => {
						setVerifyNewPassword(e.target.value)
					}}
					id="verify-password"
					type="password"
					label="Bekräfta lösenord"
				/>
				<div className="mb-2" />
				<Button
					id={"change-password-button"}
					className="btn btn-primary"
					onClick={changePassword}
					disabled={passwordButtonState}
					width={"100%"}
				>
					Ändra Lösenord
				</Button>
				<div className={style.divider}>
					<Divider option={"h2_center"} title={"Användarnamn"} />
				</div>
				<InputTextFieldBorderLabel
					onChange={(e) => {
						setNewUsername(e.target.value)
					}}
					id="username"
					type="text"
					label="Nytt användarnamn"
				/>
				<div className="mb-2" />
				<InputTextFieldBorderLabel
					errorMessage={wrongUsernamePassword}
					onChange={(e) => {
						setUsernamePassword(e.target.value)
					}}
					id="change-username-password"
					type="password"
					label="Lösenord"
				/>
				<div className="mb-2" />
				<Button
					id={"change-username-button"}
					className="btn btn-primary"
					onClick={changeUsername}
					disabled={usernameButtonState}
					width={"100%"}
				>
					Ändra Användarnamn
				</Button>
				<Divider option={"h2_center"} />
				<div>
					Inloggad som: {userName} <br />
				</div>
				<Divider option={"h2_center"} />
				<div>
					<Button id={"logoutButton"} onClick={logOut} width={"100%"} className="btn btn-primary">
						Logga ut
					</Button>
				</div>
				<br />
			</Tab>
		</Tabs>
	)
}
