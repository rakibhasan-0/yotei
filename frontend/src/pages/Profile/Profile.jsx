import { useContext, useEffect, useState } from "react"
import { Tab, Tabs } from "react-bootstrap"
import {setError as setErrorToast, setSuccess as setSuccessToast} from "../../utils"
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


/**
 * @author Chimera, Team Mango (Group 4), Team Durian (Group 3) (2024-04-23)
 * @since 2024-04-22
 * @version 2.0
 * @returns a page for managing the user's account
 */
export default function Profile() {
	const { userId, token } = useContext(AccountContext)

	const [ workouts, setWorkouts ] = useState()
	const [ searchText, setSearchText ] = useState("")

	const [ cache, cacheActions ] = useMap()
	const [password, setPassword] = useState("")
	const [newPassword, setNewPassword] = useState("")
	const [verifyNewPassword, setVerifyNewPassword] = useState("")
	const [wrongPassword, setWrongPassword] = useState()
	const [missMatchPassword, setMissMatchPassword] = useState()
	const [loading, setIsLoading] = useState(true)
	const [newUsername, setNewUsername] = useState("")
	const [UsernamePassword, setUsernamePassword] = useState("")
	const [verifyUsernamePassword, setVerifyUsernamePassword] = useState("")

	/* Workout management */

	const WorkoutList = ({list}) => {
		// eslint-disable-next-line no-unused-vars
		const onFavorite = async (_, workout) => {
			// Workaround for updating the list
			// due to how the star button in the activity list works
			setWorkouts(old => 
				[...old.map(w => {
					if (w.workoutID === workout.workoutID) {
						w.favourite = !w.favourite
					}
					return w
				})]
			)
		}
		return (
			<>
				{list && <ActivityList id="workout-list" activities={list} apiPath={"workouts"} favoriteCallback={onFavorite} />}
			</>
		)
	}

	useEffect(() => {
		getWorkouts({ text: searchText, isFavorite: false, id: userId, selectedTags: ""}, token, cache, cacheActions, list => {
			if (list.error) {
				return setErrorToast("Kunde inte hämta pass!")
			}
			setWorkouts(list.results)
			setIsLoading(false)
		})
	}, [searchText, token, userId, cache, cacheActions])

	/* Account management */

	const changePassword = async () => {
		if (newPassword !== verifyNewPassword) {
			return setMissMatchPassword("Lösenorden matchar inte")
		}
		setMissMatchPassword(undefined)
		setWrongPassword(undefined)

		const requestOptions = {
			headers: {"Content-Type": "application/json", token},
			method: "PUT",
			body: JSON.stringify({newPassword: newPassword, verifyNewPassword: verifyNewPassword, oldPassword: password, id: userId})
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
			headers: {"Content-Type": "application/json", token},
			method: "PUT",
			body: JSON.stringify({newUsername: newUsername, password: UsernamePassword, id: userId})
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

	return (
		<Tabs defaultActiveKey={"FavoriteWorkouts"} className={style.tabs}>
			
			<Tab eventKey={"FavoriteWorkouts"} title={"Favoritpass"} className={style.tab}>
				<SearchBar 
					id="searchbar-workouts-1" 
					placeholder="Sök efter pass" 
					text={searchText} 
					onChange={setSearchText}
				/>
				{loading ? <Spinner /> : <WorkoutList list={workouts?.filter(w => w.favourite)} />}
			</Tab>
			<Tab eventKey={"MyWorkouts"} title={"Mina Pass"} className={style.tab}>
				<SearchBar 
					id="searchbar-workouts-2" 
					placeholder="Sök efter pass" 
					text={searchText} 
					onChange={setSearchText}
				/>
				{loading ? <Spinner /> :<WorkoutList list={workouts?.filter(w => w.author === userId)} />}
			</Tab>
			<Tab eventKey={"Settings"} title={"Inställningar"} className={style.tab}>
				<div className={style.divider}><Divider option={"h2_center"} title={"Lösenord"} /></div>
				<title>Min sida</title>
				<InputTextFieldBorderLabel errorMessage={wrongPassword} onChange={e => {setPassword(e.target.value)}} id="current-password" type="password" label="Nuvarande lösenord" />
				<div className='mb-2' />
				<InputTextFieldBorderLabel onChange={e => {setNewPassword(e.target.value)}} id="new-password" type="password" label="Nytt lösenord" />
				<div className='mb-2' />
				<InputTextFieldBorderLabel errorMessage={missMatchPassword} onChange={e => {setVerifyNewPassword(e.target.value)}} id="verify-password" type="password" label="Bekräfta lösenord" />
				<div className='mb-2' />
				<div className={style.floatRight}>
					<Button className="btn btn-primary" onClick={changePassword}>Ändra</Button>
				</div>
				<div className={style.divider}><Divider option={"h2_center"} title={"Användarnamn"} /></div>
				<InputTextFieldBorderLabel onChange={e => {setNewUsername(e.target.value)}} id="username" type="text" label="Nytt användarnamn" />
				<div className='mb-2' />
				<InputTextFieldBorderLabel onChange={e => {setUsernamePassword(e.target.value)}} errorMessage={verifyUsernamePassword} id="change-username-password" type="password" label="Lösenord" />
				<div className='mb-2' />
				<div className={style.floatRight}>
					<Button className="btn btn-primary" onClick={changeUsername}>Ändra</Button>
				</div>
				<Divider option={"h2_center"}/>
				<div>
					<Button onClick={logOut} width={"100%"} className="btn btn-primary">Logga ut</Button>
				</div>
				<br/>
			</Tab>
		</Tabs>
	)
}
