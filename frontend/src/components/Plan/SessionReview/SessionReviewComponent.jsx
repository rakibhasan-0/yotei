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
    const[rating, setRating] = useState(0)
    const[comment, setComment] = useState("")



    function handleChangeComment(event){
		setComment(event.target.value)
	}

    async function saveReview() {

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
					<TextArea  type="text" text={comment} onChange={handleChangeComment} className="col-md-6 col-md-offset-3" style={{marginTop: "30px", marginBottom: "20px", height: "80px", borderRadius: "5px", minHeight: "80px"}} placeholder="Hur gick passet?"/>
				</div>
                <div className="col-md-6 p-0">
					<Button width={"100%"} onClick={() => saveReview()}>Spara</Button>
				</div>
			</div>
		</Popup>
    )
}