import React, {useContext, useEffect, useState} from "react";
import "../Exercise/ExerciseDetailsPage.css"
import TagList from "../../components/TagDisplay/TagList";
import {Link} from "react-router-dom";
import {useParams} from "react-router";
import {AccountContext} from "../../context";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import GoBackButton from "../../components/Common/GoBackButton";
import AlertWindow from "../../components/Common/AlertWindow";

/**
 * The details page for techniques. Displays all the information about a technique
 * with the given technique id.
 * 
 * @author Grupp 3 (Hawaii), Grupp 6 (Calskrove) (2022-05-05)
 */
const TechniqueDetailsPage = () => {
    const [data, setData] = useState({
        name: '',
        desc: '',
    })

    const {token} = useContext(
        AccountContext
    )

    let {technique_id} = useParams()
    const [tagList, setTagList] = useState(false)

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    /**
     * Fetches the data from the API and sets the states.
     */
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/techniques/${technique_id}`, {headers: {token}});
                const json = await response.json();
                setData({name: json.name, desc: json.description})
            } catch (error) {
                alert("Could not find details about the technique")
                console.log("error", error);
            }

            try {
                const tagsResponse = await fetch('/api/tags/all', {headers: {token}});
                const allTagsJson = await tagsResponse.json();

                const tagIdResponse = await fetch(`/api/tags/get/tag/by-technique?techId=${technique_id}`, {headers: {token}});
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
     * Function that deletes the technique, returns to the list of techniques afterwards
     */
    const deleteTechnique = (async () => {
        handleClose()
        try {
            const response = await fetch('/api/techniques/remove/' + technique_id, {
                headers: {token},
                method: "DELETE"
            });

            if (!response.ok) {
                alert("Kunde inte ta bort tekniken!");
            }
            window.location.href = "/technique";
        } catch (error) {
            alert("Kunde inte ta bort tekniken!")
            console.log("error", error);
        }

    });

    /**
     * The returned component.
     */
    return (
        <div className={"main-div"}>
            <div className="title-header">
                <b className="header-form ex-page-header">{data.name}</b>

                <div className="btn btn-edit">
                    <Link to={{pathname: "/technique/edit/" + technique_id}}>
                        <img src="/edit.svg" alt="edit icon"/>
                    </Link>

                    {/*An alert window that shows up when trying to delete*/}
                    <AlertWindow
                        title={"Ta bort teknik"}
                        body={"Är du säker på att du vill ta bort tekniken?"}
                        yesText={"Ta bort teknik"}
                        noText={"Avbryt"}
                        show={show}
                        callback={()=>deleteTechnique()}
                        hideFunc={()=>handleClose()}
                    />

                    {/*A delete button*/}
                    <img onClick={handleShow} src="/trashcan.svg" alt="trashcan icon"/>
                </div>
            </div>
            <div>
                <p className={"desc-form-ex-page"}>{data.desc}</p>
            </div>
            <div className={"tags"}>
                <TagList tags={Object.values(tagList)}/>
            </div>
            <div>
                {/*<TechniqueCommentSection technique_id={technique_id}/>*/}
            </div>
            <div>
                <GoBackButton confirmationNeeded={false}/>
            </div>
        </div>
    );
}

export default TechniqueDetailsPage;