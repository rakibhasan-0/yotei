import React, {useContext, useEffect, useState} from "react";
import "./ExerciseDetailsPage.css"
import TagList from "../../components/TagDisplay/TagList";
import ExerciseCommentSection from "./ExerciseCommentSection"
import {AccountContext} from "../../context";
import {useParams} from "react-router";
import {Link} from "react-router-dom"
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import GoBackButton from "../../components/Common/GoBackButton";
import AlertWindow from "../../components/Common/AlertWindow";

/**
 * The details page for exercises. Displays all the information about an exercise with the given exercise id.
 * @author Team 3 Hawaii, Team 6 Calskrove (2022-05-05)
 */
const ExerciseDetailsPage = () => {
    const [data, setData] = useState({
        name: '',
        desc: '',
        duration: ''
    })

    let {ex_id} = useParams()

    const [tagList, setTagList] = useState(false)

    const {token} = useContext(
        AccountContext
    )

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    /**
     * Fetches the data from the API and sets the states.
     */
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/exercises/${ex_id}`, {headers: {token}});
                const json = await response.json();
                setData({name: json.name, desc: json.description, duration: json.duration})
            } catch (error) {
                alert("Could not find details about the exercise")
                console.log("error", error);
            }

            try {
                const tagsResponse = await fetch('/api/tags/all', {headers: {token}});
                const allTagsJson = await tagsResponse.json();

                const tagIdResponse = await fetch(`/api/tags/get/tag/by-exercise?exerciseId=${ex_id}`, {headers: {token}});
                const tagIdJson = await tagIdResponse.json();

                const filteredTags = allTagsJson.filter((tag) => tagIdJson.map(obj => obj.tagId).includes(tag.id))

                setTagList(filteredTags)

            } catch (error) {
                alert("Could not find tags for the exercise")
                console.log("error", error);
            }
        };
        fetchData()
    }, []);

    /**
     * Function that deletes the exercise, returns to the list of exercises afterwards
     */
    const deleteExercise = (async () => {
        handleClose()
        try {
            const response = await fetch('/api/exercises/remove/' + ex_id, {headers: {token}, method: "DELETE"});
            
            if (!response.ok) {
                alert("Kunde inte ta bort övningen!");
            }

            window.location.href = "/exercise";
        } catch (error) {
            alert("Kunde inte ta bort övningen!")
            console.log("error", error);
        }

    });

    /**
     * The returned component.
     */
    return (
        <div className="main-div">
            <div className="title-header">
                <b className="header-form ex-page-header">{data.name}</b>

                <div className="btn btn-edit">
                    <Link to={{pathname: "/exercise/edit/" + ex_id}}>
                        <img src="/edit.svg" alt="edit icon"/>
                    </Link>

                    {/*An alert window that shows up when trying to delete*/}
                    <AlertWindow
                        title={"Ta bort övning"}
                        body={"Är du säker på att du vill ta bort övningen?"}
                        yesText={"Ta bort övning"}
                        noText={"Avbryt"}
                        show={show}
                        callback={()=>deleteExercise()}
                        hideFunc={()=>handleClose()}
                    />

                    {/*A delete button*/}
                    <img onClick={handleShow} src="/trashcan.svg" alt="trashcan icon"/>
                </div>
            </div>
            <div>
                <b>Tid: {data.duration} minuter</b>
            </div>
            <div>
                <p className="desc-form-ex-page">{data.desc}</p>
            </div>
            <div className="tags">
                <TagList tags={Object.values(tagList)}/>
            </div>
            <div>
                <ExerciseCommentSection ex_id={ex_id}/>
            </div>
            <div>
                <GoBackButton confirmationNeeded={false}/>
            </div>
        </div>
    );
}

export default ExerciseDetailsPage;