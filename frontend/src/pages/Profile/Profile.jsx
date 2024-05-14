import { useContext, useEffect, useState } from "react"
import { Tab, Tabs } from "react-bootstrap"
import { setError as setErrorToast, setSuccess as setSuccessToast } from "../../utils"
import ActivityList from "../../components/Activity/ActivityList"
import Button from "../../components/Common/Button/Button"
import SearchBar from "../../components/Common/SearchBar/SearchBar"
import { getWorkouts } from "../../components/Common/SearchBar/SearchBarUtils"
import { AccountContext } from "../../context"
import style from "./Profile.module.css"
import InputTextFieldBorderLabel from "../../components/Common/InputTextFieldBorderLabel/InputTextFieldBorderLabel"
import { logOut } from "/src/utils"
import useMap from "../../hooks/useMap"
import Divider from "../../components/Common/Divider/Divider"
import Spinner from "../../components/Common/Spinner/Spinner"
import ProfileListItem from "./ProfileListItem"
import { Lock, Unlock, Eye } from "react-bootstrap-icons"
import starFill from "../../../assets/images/starFill.svg"

/**
 * @author Chimera, Team Mango (Group 4), Team Pomegranate(Group 1), Team Durian (Group 3) (2024-04-23)
 * @since 2024-04-23
 * @version 3.0
 * @returns a page for managing the user's account
 */
export default function Profile() {
	const { userId, token } = useContext(AccountContext)

	const [workouts, setWorkouts] = useState()
	const [searchText, setSearchText] = useState("")

	const [cache, cacheActions] = useMap()
	const [password, setPassword] = useState("")
	const [newPassword, setNewPassword] = useState("")
	const [verifyNewPassword, setVerifyNewPassword] = useState("")
	const [wrongPassword, setWrongPassword] = useState()
	const [missMatchPassword, setMissMatchPassword] = useState()
	const [loading, setIsLoading] = useState(true)
	const [newUsername, setNewUsername] = useState("")
	const [UsernamePassword, setUsernamePassword] = useState("")
	const [verifyUsernamePassword, setVerifyUsernamePassword] = useState("")

	const lists = [
		{
			id: -1,
			name: "Favoritpass",
			size: 7,
			author:{
				userId: 1,
				username: "Admin",
			},
			hidden: false,
		},
		{
			id: 1,
			name: "TestList",
			size: 3,
			author:{
				userId: 2,
				username: "Editor",
			},
			hidden: true,
		},
		{
			id: 2,
			name: "Lees lista",
			size: 2,
			author:{
				userId: 1,
				username: "Admin",
			},
			hidden: true,
		},
	]

	/* Workout management */

	const WorkoutList = ({ list }) => {
		// eslint-disable-next-line no-unused-vars
		const onFavorite = async (_, workout) => {
			// Workaround for updating the list
			// due to how the star button in the activity list works
			setWorkouts((old) => [
				...old.map((w) => {
					if (w.workoutID === workout.workoutID) {
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

	/* Account management */

	const changePassword = async () => {
		if (newPassword !== verifyNewPassword) {
			return setMissMatchPassword("Lösenorden matchar inte")
		}
		setMissMatchPassword(undefined)
		setWrongPassword(undefined)

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
		setVerifyUsernamePassword(undefined)

		const requestOptions = {
			headers: { "Content-Type": "application/json", token },
			method: "PUT",
			body: JSON.stringify({ newUsername: newUsername, password: UsernamePassword, id: userId }),
		}
		const response = await fetch("/api/users/name", requestOptions)
		if (response.status === 400) {
			return setVerifyUsernamePassword("Lösenordet stämmer inte")
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
		console.log("authorId:"+state.author.userId+"\nuserId:"+userId)
		if(state.id==-1){
			console.log("Favourite!")
			//Här borde jag fixa en route till favoritsidans grej :)
			return <img src={starFill} />
		}
		if(state.hidden===true && state.author.userId==userId){
			console.log("Locked")
			return <Lock size={36} />
		}
		if(state.hidden===true && state.author.userId!=userId){
			console.log("Shared")
			return <Unlock size={36} />
		}
		if(state.hidden===false && state.author.userId==userId){
			console.log("Public")
			return <Eye size={36} />
		}
		console.log("Ospecat fall, borde ej kunna nå listor som publika men inte delade med oss!")
		return <Lock />
	}

	return (
		<Tabs defaultActiveKey={"FavoriteWorkouts"} className={style.tabs}>
			<Tab eventKey={"FavoriteWorkouts"} title={"Mina listor"} className={style.tab}>
				<SearchBar
					id="searchbar-workouts-1"
					placeholder="Sök efter pass"
					text={searchText}
					onChange={setSearchText}
				/>
				{loading ? (
					<Spinner />
				) : (
					lists.map((list) => (
						<ProfileListItem key={list.id} item={list} Icon={getIconFromState(list)} />
					))
				)}
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
					type="password"
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
				<div className={style.floatRight}>
					<Button className="btn btn-primary" onClick={changePassword}>
						Ändra
					</Button>
				</div>
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
					onChange={(e) => {
						setUsernamePassword(e.target.value)
					}}
					errorMessage={verifyUsernamePassword}
					id="change-username-password"
					type="password"
					label="Lösenord"
				/>
				<div className="mb-2" />
				<div className={style.floatRight}>
					<Button className="btn btn-primary" onClick={changeUsername}>
						Ändra
					</Button>
				</div>
				<Divider option={"h2_center"} />
				<div>
					<Button onClick={logOut} width={"100%"} className="btn btn-primary">
						Logga ut
					</Button>
				</div>
				<br />
			</Tab>
		</Tabs>
	)
}
