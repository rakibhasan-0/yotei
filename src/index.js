import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useRef } from "react"
import { Cookies } from "react-cookie"
import Home from "./pages/Home/Home"
import ExerciseCreate from "./pages/Exercise/ExerciseCreate"
import TechniqueCreate from "./pages/Technique/TechniqueCreate"
import WorkoutIndex from "./pages/Workout/WorkoutIndex"
import NoPage from "./pages/Misc/NoPage"
import WorkoutCreate from "./pages/Workout/WorkoutCreate"
import "./index.css"
import "./components/Activity/activity.css"
import "./components/Plan/PlanList.css"
import Login from "./pages/Login/Login"
import React, { useState } from "react"
import Admin from "./pages/Admin/Admin"
import About from "./pages/About/About"
import WorkoutView from "./pages/Workout/WorkoutView"
import WorkoutEdit from "./pages/Workout/WorkoutEdit"
import TechniqueEdit from "./pages/Technique/TechniqueEdit"
import TechniqueIndex from "./pages/Technique/TechniqueIndex"
import ExerciseIndex from "./pages/Exercise/ExerciseIndex"
import ExerciseEdit from "./pages/Exercise/ExerciseEdit"
import { AccountContext } from "./context"
import { decodeToken } from "react-jwt"
import ImageForm from "./components/Forms/ImageForm"
import ExerciseDetailsPage from "./pages/Exercise/ExerciseDetailsPage"
import TechniqueDetailsPage from "./pages/Technique/TechniqueDetailsPage"
import Profile from "./pages/Profile/Profile"
import PlanCreate from "./pages/Plan/PlanCreate"
import SessionCreate from "./pages/Plan/SessionCreate"
import PlanIndex from "./pages/Plan/PlanIndex"
import BaseLayout from "./components/Common/BaseLayout/BaseLayout"

import { useIdleTimer } from "react-idle-timer"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { logOut } from "./utils"

const exerciseURI = "https://jsonplaceholder.typicode.com/users"
const techniqueURI = "https://jsonplaceholder.typicode.com/users"
const workoutURI = "https://jsonplaceholder.typicode.com/users"
const planURI = "https://jsonplaceholder.typicode.com/users"

/**
 *
 * @version 1.0
 */
export default function App() {
	const cookie = new Cookies().get("token")
	const [token, setToken] = useState(cookie)

	const stateRef = useRef()
	stateRef.current = token

	let role
	let userId

	if (cookie) {
		try {
			const decoded = decodeToken(cookie)
			if (decoded.exp < Date.now() / 1000) {
				throw new Error("Token has expired")
			}
			role = decoded.role
			userId = decoded.userId
		} catch (ex) {
			console.log("Unable to decode token", ex)
			logOut()
		}
	}

	const onIdle = () => {
		if (!cookie) {
			logOut()
		}
	}

	const onPrompt = () => {
		if (!cookie) {
			toast.warn("Du kommer snart att loggas ut på grund av inaktivitet!", {
				autoClose: false,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "dark",
				position: "top-center"
			})
		}
	}

	const onAction = () => {
		toast.dismiss()
		idleTimer.reset()
	}

	const idleTimer = useIdleTimer({
		onIdle,
		onPrompt,
		onAction,
		promptTimeout: 1000 * 60 * 18,
		timeout: 1000 * 60 * 20
	})

	return (
		<>
			<ToastContainer />
			<AccountContext.Provider value={{ token, role, userId, setToken }}>
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
										<Route path="home" element={<Home />} />
										<Route path="technique" element={<TechniqueIndex uri={techniqueURI} />} />
										<Route path="technique/create" element={<TechniqueCreate />} />
										<Route path="technique/edit/:editID" element={<TechniqueEdit />} />
										<Route path="techniques/add" element={<TechniqueCreate />} />
										<Route path="upload-image" element={<ImageForm />} />
										<Route path="workout" element={<WorkoutIndex uri={workoutURI} />} />
										<Route path="exercise/exercise_page/:ex_id" element={<ExerciseDetailsPage />} />
										<Route path="technique/technique_page/:technique_id" element={<TechniqueDetailsPage />} />
										<Route path="workout/create" element={<WorkoutCreate />} />
										<Route path="workout/:workoutID" element={<WorkoutView />} />
										<Route path="workout/edit" element={<WorkoutEdit />} />
										<Route path="plan" element={<PlanIndex uri={planURI} />} />
										<Route path="plan/create" element={<PlanCreate />} />
										<Route path="session/create" element={<SessionCreate />} />
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
root.render(<App />)
