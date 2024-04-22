import React, { useEffect } from "react"
import { useState, useContext } from "react"
import Popup from "../../Common/Popup/Popup"
import Button from "../../Common/Button/Button"
import Ratings from "react-ratings-declarative"
import Star from "../../Common/StarButton/StarButton"
import TextArea from "../../Common/TextArea/TextArea"
import Divider from "../../Common/Divider/Divider"
import CheckBox from "../../Common/CheckBox/CheckBox"
import styles from "./SessionReviewComponent.module.css"
import {HTTP_STATUS_CODES, setError, setSuccess} from "../../../utils"

/**
 * Review component for an individual session. 
 * A session can have one review on it, filled in by the trainer
 * The review can be seen and edited through the plan window
 * Based on "ReviewFormComponent.jsx"
 * 
 * @author Hannes c21hhn (Group 1, pomegranate) (2024-04-22) 
 * @version 1.0
 */

export default function Review({isOpen, setIsOpen, session_id}) {
    const[initialRating, loadRating] = useState(0) //Loaded rating from the database
    const[initialDoneList, loadDone] = useState([]) //Loaded information about performed activities for this session
    const[initialPositiveComment, loadPositiveComment] = useState("") //Loaded comment for this session
    const[initialNegativeComment, loadNegativeComment] = useState("");

    const[rating, setRating] = useState(0)
    const[doneList, setDone] = useState([])
    const[positiveComment, setPositiveComment] = useState("")
    const[negativeComment, setNegativeComment] = useState("");



    function handleChangePositive(event){
		setPositiveComment(event.target.value)
	}

    function handleChangeNegative(event){
        setNegativeComment(event.target.value)
    }

    async function saveReview() {
        if(rating === 0) {
            setError("Kunde inte spara utvärdering, vänligen sätt ett betyg")
			return
		}

        let ts = getTodaysDate()
        const requestOptions = {
			method: "POST",
			headers: {"Content-type": "application/json", "token": token},
			body: JSON.stringify({
				"rating": rating,
				"userId": userId,
				"positiveComment": positiveComment,
				"negativeComment": negativeComment,
				"date": ts
			})
		}

        const postResponse = await fetch("/api/session/" + session_id + "/review", requestOptions).catch(() => {
			setError("Serverfel: Kunde ansluta till servern.")
			return
		})
		if(postResponse.status != HTTP_STATUS_CODES.OK) {
			setError("Serverfel: Något gick snett! Felkod: " + postResponse.status)
			return
		}


        setSuccess("Utvärdering sparad")
    }

    function getTodaysDate() {
		var today = new Date()
		var dd = String(today.getDate()).padStart(2, "0")
		var mm = String(today.getMonth() + 1).padStart(2, "0")
		var yyyy = today.getFullYear()

		return yyyy + "-" + mm + "-" + dd
	}

    async function fetchRating() {
		const response = await fetch("/api/sessions/" + session_id + "/review/all").catch(() => {
			setError("Serverfel: Kunde inte hämta betyg för det valda tillfället.")
			return
		})

		if(response.status != HTTP_STATUS_CODES.OK) {
			setError("Serverfel: Något gick snett! Felkod: " + response.status)
			return
		}

		const data = await response.json()
		loadRating(data)
	}

    async function fetchDoneList() {
        const response = await fetch("/api/sessions/" + session_id + "/review/all").catch(() => {
			setError("Serverfel: Kunde inte hämta information om aktiviteter för det valda tillfället.")
			return
		})

		if(response.status != HTTP_STATUS_CODES.OK) {
			setError("Serverfel: Något gick snett! Felkod: " + response.status)
			return
		}

		const data = await response.json()
		loadDone(data)
    }

    async function fetchComment() {
        const response = await fetch("/api/sessions/" + session_id + "/review/all").catch(() => {
            setError("Serverfel: Kunde inte hämta kommentar för det valda tillfället.")
			return
        })

        if(response.status != HTTP_STATUS_CODES.OK) {
			setError("Serverfel: Något gick snett! Felkod: " + response.status)
			return
		}

        const data = await response.json()
		loadComment(data)
    }

    return (
        <Popup title={"Utvärdering av tillfälle"} id={"review-popup"} isOpen={isOpen} setIsOpen={setIsOpen}>
            <div className="d-flex flex-column align-items-center">
				<div className="d-flex flex-row" style={{marginBottom: "20px"}}>
					<Ratings widgetDimensions="40px" rating={rating} widgetRatedColors="gold" changeRating={setRating}>
						<Ratings.Widget widgetHoverColor='gold'>
							<Star/>
						</Ratings.Widget>
						<Ratings.Widget widgetHoverColor='gold'>
							<Star/>
						</Ratings.Widget>
						<Ratings.Widget widgetHoverColor='gold'>
							<Star/>
						</Ratings.Widget>
						<Ratings.Widget widgetHoverColor='gold'>
							<Star/>
						</Ratings.Widget>
						<Ratings.Widget widgetHoverColor='gold'>
							<Star/>
						</Ratings.Widget>
					</Ratings>
				</div>

                <div className = {styles["activity_checker"]}>
                    <ul>
                        <li className={styles["check_box_li"]}>
                            {/* Check box */}
                            <CheckBox id={"CheckBox"} onClick={()=> {}} checked={true}/>
                        </li>
                        <li className={styles["activity_text_li"]}>
                            {"Aktivitet"}
                        </li>
                    </ul>
                </div>

                <div className="w-100">
					<TextArea  type="text" text={positiveComment} onChange={handleChangePositive} className="col-md-6 col-md-offset-3" style={{marginTop: "30px", marginBottom: "20px", height: "80px", borderRadius: "5px", minHeight: "80px"}} placeholder="Vad var bra med passet?"/>
				</div>
                <div className="w-100">
					<TextArea  type="text" text={negativeComment} onChange={handleChangeNegative} className="col-md-6 col-md-offset-3" style={{marginTop: "30px", marginBottom: "20px", height: "80px", borderRadius: "5px", minHeight: "80px"}} placeholder="Vad var dåligt med passet?"/>
				</div>
                <div className="col-md-6 p-0">
					<Button width={"100%"} onClick={() => saveReview()}>Spara</Button>
				</div>
			</div>
		</Popup>
    )
}