import { useContext, useEffect, useState } from "react"
import { Tab, Tabs } from "react-bootstrap"
import { toast } from "react-toastify"
import ActivityList from "../../components/Activity/ActivityList"
import Button from "../../components/Common/Button/Button"
import FilterBox from "../../components/Common/Filter/FilterBox/FilterBox"
import SearchBar from "../../components/Common/SearchBar/SearchBar"
import { getWorkouts } from "../../components/Common/SearchBar/SearchBarUtils"
import { AccountContext } from "../../context"
import useMap from "../../hooks/useMap"
import style from "./Profile.module.css"
import InputTextFieldBorderLabel from "../../components/Common/InputTextFieldBorderLabel/InputTextFieldBorderLabel"
import { logOut } from "/src/utils"

export default function Profile() {
	const { userId, token } = useContext(AccountContext)
	const [ workouts, setWorkouts ] = useState()
	const [ favoriteWorkouts, setFavoriteWorkouts ] = useState()

	const [ searchText, setSearchText ] = useState("")
	const [ tags, setTags ] = useState([])
	const [ suggestedTags, setSuggestedTags ] = useState([])
	const [ cache, cacheActions ] = useMap()

	const [password, setPassword] = useState("")
	const [newPassword, setNewPassword] = useState("")
	const [verifyNewPassword, setVerifyNewPassword] = useState("")
	const [wrongPassword, setWrongPassword] = useState()
	const [missMatchPassword, setMissMatchPassword] = useState()

	const [newUsername, setNewUsername] = useState("")
	const [UsernamePassword, setUsernamePassword] = useState("")
	const [verifyUsernamePassword, setVerifyUsernamePassword] = useState("")

	useEffect(() => fetchWorkouts(false), [undefined, undefined, true, searchText, token, userId, cache, cacheActions, tags])
	useEffect(() => fetchWorkouts(true), [undefined, undefined, true, searchText, token, userId, cache, cacheActions, tags])

	return (
		<div className="container">
			<div className="row justify-content-center">
				<div className="col-md-8">
					<Tabs defaultActiveKey={"FavoriteWorkouts"} className={style.tabs}>
						<Tab eventKey={"FavoriteWorkouts"} title={"Favoritpass"} className={style.tab}>
							<SearchBar 
								id="searchbar-workouts" 
								placeholder="Sök" 
								text={searchText} 
								onChange={setSearchText}
								addedTags={tags}
								setAddedTags={setTags}
								suggestedTags={suggestedTags}
								setSuggestedTags={setSuggestedTags}
							/>
							{workouts && <ActivityList id="workout-list" activities={favoriteWorkouts} apiPath={"workouts"} favoriteCallback={toggleIsFavorite} />}
						</Tab>
						<Tab eventKey={"MyWorkouts"} title={"Mina Pass"} className={style.tab}>
							<SearchBar 
								id="searchbar-workouts" 
								placeholder="Sök" 
								text={searchText} 
								onChange={setSearchText}
								addedTags={tags}
								setAddedTags={setTags}
								suggestedTags={suggestedTags}
								setSuggestedTags={setSuggestedTags}
							/>
							{workouts && <ActivityList id="workout-list" activities={workouts} apiPath={"workouts"} favoriteCallback={toggleIsFavorite} />}
						</Tab>
						<Tab eventKey={"Settings"} title={"Inställningar"} className={style.tab}>
							<FilterBox title="Lösenord" id={"PasswordBox"} status={true} >
								<InputTextFieldBorderLabel errorMessage={wrongPassword} onChange={e => {setPassword(e.target.value)}} id="password" type="password" label="Nuvarande lösenord" />
								<InputTextFieldBorderLabel onChange={e => {setNewPassword(e.target.value)}} id="new-password" type="password" label="Nytt lösenord" />
								<InputTextFieldBorderLabel errorMessage={missMatchPassword} onChange={e => {setVerifyNewPassword(e.target.value)}} id="verify-password" type="password" label="Bekräfta lösenord" />
								<div className={style.floatRight}>
									<Button className="btn btn-primary" onClick={changePassword}>Ändra</Button>
								</div>
							</FilterBox>
							<FilterBox title="Användarnamn" id={"UsernameBox"} status={true} >
								<InputTextFieldBorderLabel onChange={e => {setNewUsername(e.target.value)}} id="username" type="text" label="Nytt användarnamn" />
								<InputTextFieldBorderLabel onChange={e => {setUsernamePassword(e.target.value)}} errorMessage={verifyUsernamePassword} id="Password" type="password" label="Lösenord" />
								<div className={style.floatRight}>
									<Button className="btn btn-primary" onClick={changeUsername}>Ändra</Button>
								</div>
							</FilterBox>
							<div>
								<Button onClick={logOut} width={"100%"} className="btn btn-primary">Logga ut</Button>
							</div>
						</Tab>
					</Tabs>
				</div>
			</div>
		</div>
	)

	function toggleIsFavorite(workout) {
		workout.favourite = !workout.favourite
		fetchWorkouts(true)
	}

	function setError(msg){
		if (toast.isActive("search-error")) return
		toast.error(msg, {
			position: "top-center",
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true, 
			draggable: false,
			progress: undefined,
			theme: "colored",
			toastId: "search-error",
		})
	}

	function fetchWorkouts(isFavorite) {
		let args = {
			from: undefined,
			to: undefined,
			text: searchText,
			selectedTags: tags,
			id: userId,
			isFavorite
		}

		getWorkouts(args, token, cache, cacheActions, (response) => {
			if(response.error) {
				setError("Serverfel: Kunde inte ansluta till servern!")
			} else {
				if (isFavorite) {
					setFavoriteWorkouts(response.results)
				} else {
					setWorkouts(response.results)
				}
				setSuggestedTags(response.tagCompletion)
			}
		})
	}

	async function changePassword() {
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
		const response = await fetch("/user/updatepassword", requestOptions)
		verifyPasswordChange(response)
	}

	function verifyPasswordChange(response) {
		if (!response.ok) {
			return setWrongPassword("Lösenordet stämmer inte")
		}
		toast.success("Lösenordet har ändrats.")
	}

	async function changeUsername() {
		setVerifyUsernamePassword(undefined)

		const requestOptions = {
			headers: {"Content-Type": "application/json", token},
			method: "PUT",
			body: JSON.stringify({newUsername: newUsername, password: UsernamePassword, id: userId})
		}
		const response = await fetch("/user/updatename", requestOptions)
		verifyUsername(response)
	}

	function verifyUsername(response) {
		if (!response.ok) {
			return setVerifyUsernamePassword("Lösenordet stämmer inte")
		}
		toast.success("Användarnamnet har ändrats.")
	}
}