import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useRef } from "react"
import { useCookies } from 'react-cookie';
import Nav from "./components/Nav/Nav";
import Home from "./pages/Home/Home";
import ExerciseCreate from "./pages/Exercise/ExerciseCreate";
import TechniqueCreate from "./pages/Technique/TechniqueCreate";
import WorkoutIndex from "./pages/Workout/WorkoutIndex";
import NoPage from "./pages/Misc/NoPage";
import WorkoutCreate from "./pages/Workout/WorkoutCreate";
import './index.css';
import './components/Activity/activity.css';
import './components/Plan/PlanList.css'
import Login from "./pages/Login/Login";
import React, { useEffect, useState } from "react";
import Admin from "./pages/Admin/Admin";
import About from "./pages/About/About";
import WorkoutView from "./pages/Workout/WorkoutView";
import WorkoutEdit from './pages/Workout/WorkoutEdit';
import TechniqueEdit from './pages/Technique/TechniqueEdit';
import TechniqueIndex from "./pages/Technique/TechniqueIndex";
import ExerciseIndex from "./pages/Exercise/ExerciseIndex";
import ExerciseEdit from "./pages/Exercise/ExerciseEdit";
import { AccountContext } from "./context"
import { decodeToken } from "react-jwt";
import ImageForm from './components/Forms/ImageForm';
import ExerciseDetailsPage from "./pages/Exercise/ExerciseDetailsPage";
import TechniqueDetailsPage from "./pages/Technique/TechniqueDetailsPage";
import Profile from './pages/Profile/Profile';
import PlanCreate from './pages/Plan/PlanCreate';
import SessionCreate from './pages/Plan/SessionCreate'
import PlanIndex from './pages/Plan/PlanIndex';

import { useIdleTimer } from 'react-idle-timer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const exerciseURI = "https://jsonplaceholder.typicode.com/users"
const techniqueURI = "https://jsonplaceholder.typicode.com/users"
const workoutURI = "https://jsonplaceholder.typicode.com/users"
const planURI = "https://jsonplaceholder.typicode.com/users"

/**
 *
 * @version 1.0
 */
export default function App() {
    const [cookies, setCookie, removeCookie] = useCookies(['token'])
    const [logoutTimer, setLogoutTimer] = useState(0)
    const [token, setToken] = useState(cookies.token)

    const stateRef = useRef()
    stateRef.current = token

    const role = cookies.token !== undefined ? decodeToken(cookies.token).role : ""
    const userId = cookies.token !== undefined ? decodeToken(cookies.token).userId : 0

    const updateCookie = (token) => {
        if(!token){
            return
        }

        fetch("/user/refresh", {body: token, method: 'POST', headers: {token}})
            .then(data => data.text())
            .then(data => {
                setToken(data)
                setCookie('token', data, {secure: false, maxAge: 1200, path: "/"})
            })
            .catch(error => console.error(error))
    }

    const logout = () => {
        const id = setInterval(() => {
            removeCookie("token")
            document.location.href = "/"
        }, 1000 * 60 * 2)

        toast.warn("Du kommer snart att loggas ut på grund av inaktivitet!",{
            autoClose: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            position: "top-center"
            });
        setLogoutTimer(id)
    }

    useIdleTimer({
        timeout: 1000 * 60* 20,
        onIdle: logout,
        onActive: () => {
            if(logoutTimer !== 0){
                toast.dismiss();
                clearInterval(logoutTimer);
            }
        },
        debounce: 500
    })

    useEffect(()=> {
        updateCookie(token)
        setInterval(() => {
            updateCookie(stateRef.current)
        }, 1000 * 60 * 10)
    }, [])

    return (
        <>
            <ToastContainer/>
            <AccountContext.Provider value={{token: token, role: role, userId: userId, setToken: setToken}}>
                <BrowserRouter>
                    <Routes>
                        {
                            cookies.token || process.env.REACT_APP_LOGIN_ENABLED === 'false' ? (
                                <>
                                    {process.env.REACT_APP_LOGIN_ENABLED !== 'false' ? <Route index element={<Login />} /> : null}
                                    <Route path="/" element={<Nav />}>
                                        <Route path="about" element={<About />} />
                                        <Route path="admin" element={<Admin />} />
                                        <Route path="profile" element={<Profile />} />
                                        <Route path="exercise" element={<ExerciseIndex uri={exerciseURI}/>} />
                                        <Route path="exercise/create" element={<ExerciseCreate />} />
                                        <Route path="exercise/edit/:editID" element={<ExerciseEdit />} />
                                        <Route path="home" element={<Home />} />
                                        <Route path="technique" element={<TechniqueIndex uri={techniqueURI}/>} />
                                        <Route path="technique/create" element={<TechniqueCreate />} />
                                        <Route path="technique/edit/:editID" element={<TechniqueEdit />} />
                                        <Route path="techniques/add" element={<TechniqueCreate />} />
                                        <Route path="upload-image" element = {<ImageForm/> }/>
                                        <Route path="workout" element={<WorkoutIndex uri={workoutURI}/>} />
                                        <Route path="exercise/exercise_page/:ex_id" element={<ExerciseDetailsPage/>} />
                                        <Route path="technique/technique_page/:technique_id" element={<TechniqueDetailsPage/>} />
                                        <Route path="workout/create" element={<WorkoutCreate />} />
                                        <Route path="workout/:workoutID" element={<WorkoutView/>}/>
                                        <Route path="workout/edit" element={<WorkoutEdit/>}/>
                                        <Route path="plan" element={<PlanIndex uri={planURI}/>} />
                                        <Route path="plan/create" element={<PlanCreate/>} />
                                        <Route path="session/create" element={<SessionCreate/>} />
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

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
