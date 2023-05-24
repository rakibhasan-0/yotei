import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Cookies, CookiesProvider } from "react-cookie"
import ExerciseCreate from "./pages/Exercise/ExerciseCreate"
import WorkoutIndex from "./pages/Workout/WorkoutIndex"
import NoPage from "./pages/Misc/NoPage"
import WorkoutCreate from "./pages/Workout/WorkoutCreate"
import "./index.css"
import "./components/Activity/activity.css"
import "./components/Plan/PlanList.css"
import Login from "./pages/Login/Login"
import React, { useEffect, useState } from "react"
import Admin from "./pages/Admin/Admin"
import About from "./pages/About/About"
import WorkoutView from "./pages/Workout/WorkoutView/WorkoutView"
import WorkoutEdit from "./pages/Workout/WorkoutEdit"
import TechniqueIndex from "./pages/Technique/TechniqueIndex/TechniqueIndex"
import ExerciseIndex from "./pages/Exercise/ExerciseIndex"
import ExerciseEdit from "./pages/Exercise/ExerciseEdit"
import { AccountContext } from "./context"
import { decodeToken } from "react-jwt"
import ImageForm from "./components/Forms/ImageForm"
import ExerciseDetailsPage from "./pages/Exercise/ExerciseDetailsPage"
import TechniqueDetail from "./pages/Technique/TechniqueDetail/TechniqueDetail"
import Profile from "./pages/Profile/Profile"
import PlanCreate from "./pages/Plan/PlanCreate.jsx"
import SessionCreate from "./pages/Plan/SessionCreate"
import SessionEdit from "./pages/Plan/SessionEdit"
import PlanIndex from "./pages/Plan/PlanIndex"
import BaseLayout from "./components/Common/BaseLayout/BaseLayout"
import "react-toastify/dist/ReactToastify.css"
import { logOut } from "./utils"
import { ToastContainer, toast } from "react-toastify"

const exerciseURI = "https://jsonplaceholder.typicode.com/users"
const workoutURI = "https://jsonplaceholder.typicode.com/users"
const planURI = "https://jsonplaceholder.typicode.com/users"

/**
 *
 * @version 1.0
 */
export default function App() {
	const cookie = new Cookies().get("token")
	const [token, setToken] = useState(cookie)

	/**
	 * The decoded JWT token containing the user's information
	 */
	let decodedToken

	/**
	 * Time until the session expires in milliseconds
	 */
	let sessionExpiration = 0

	if (cookie) {
		try {
			decodedToken = decodeToken(cookie)
			sessionExpiration = decodedToken.exp * 1000 - Date.now()
			if (sessionExpiration <= 0) {
				throw new Error("Session has expired")
			}
		} catch (ex) {
			logOut()
		}
	}

	useEffect(() => {
		if (sessionExpiration > 0) {
			console.log(`Session will expire in ${(sessionExpiration / 1000 / 60).toFixed(2)} minutes`)
			const delta = sessionExpiration - 1000 * 60 * 2
			const warning = setTimeout(() => {
				toast.warn("Du kommer snart loggas ut")
			}, Math.max(delta, 1000))
			const timeout = setTimeout(() => {
				logOut()
			}, sessionExpiration)
			return () => {
				clearTimeout(timeout)
				clearTimeout(warning)
			}
		}
	}, [sessionExpiration])

	return (
		<>
			<ToastContainer />
			<AccountContext.Provider value={{ token, role: decodedToken?.role, userId: decodedToken?.userId, setToken }}>
				<BrowserRouter>
					<Routes>
						{
							// eslint-disable-next-line no-undef
							cookie || import.meta.env.VITE_APP_LOGIN_ENABLED === "false" ? (
								<>
									<Route path="/" element={<BaseLayout />}>
										<Route path="about" element={<About />} />
										<Route path="admin" element={<Admin />} />
										<Route path="profile" element={<Profile />} />
										<Route path="exercise" element={<ExerciseIndex uri={exerciseURI} />} />
										<Route path="exercise/create" element={<ExerciseCreate />} />
										<Route path="exercise/edit/:editID" element={<ExerciseEdit />} />
										<Route path="technique" element={<TechniqueIndex />} />
										<Route path="upload-image" element={<ImageForm />} />
										<Route path="workout" element={<WorkoutIndex uri={workoutURI} />} />
										<Route path="exercise/exercise_page/:ex_id" element={<ExerciseDetailsPage />} />
										<Route path="technique/technique_page/:techniqueId" element={<TechniqueDetail />} />
										<Route path="workout/create" element={<WorkoutCreate />} />
										<Route path="workout/:workoutId" element={<WorkoutView />} />
										<Route path="workout/edit" element={<WorkoutEdit />} />
										<Route path="plan" element={<PlanIndex uri={planURI} />} />
										<Route path="plan/create" element={<PlanCreate />} />
										<Route path="session/create" element={<SessionCreate />} />
										<Route path="session/edit/:session_id" element={<SessionEdit />} />
										<Route path="" element={<PlanIndex uri={planURI} />} />
										<Route path="*" element={<NoPage />} />
									</Route>
								</>
							) : (
								<Route path="*" element={<Login />} />
							)
						}
					</Routes>
				</BrowserRouter>
			</AccountContext.Provider>
		</>
	)
}

const container = document.getElementById("root")
const root = createRoot(container)
root.render(<CookiesProvider><App /></CookiesProvider>)
