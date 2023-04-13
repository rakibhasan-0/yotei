import './GoBackButton.css';
import {useNavigate} from "react-router-dom";
import React, {useState} from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import AlertWindow from "./AlertWindow";

/**
 * Defines the button to go back to the previous page. Has a boolean value to show confirmation prompt, if the
 * boolean value is false then no message is presented to the user.
 *
 * @author Team Capricciosa (Group 2), Team Carlskrove (Group 6)
 * @version 1.0
 */
export function GoBackButton(props) {
    const navigate = useNavigate();
    const confirmationNeeded = props.confirmationNeeded;

    const confirm = () => {
        if (!confirmationNeeded) {
            navigate(-1);
        } else {
            handleShow()
        }
    }

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <AlertWindow
                title={"Lämna sida"}
                body={"Är du säker på att du vill lämna sidan? Osparade ändringar kommer gå förlorade."}
                yesText={"Lämna sida"}
                noText={"Avbryt"}
                callback={(e) => navigate(-1)}
                hideFunc={handleClose}
                show={show}
            />

            <button type='button' onClick={confirm} className="btn btn-color btn-back">Tillbaka</button>
        </>
    );
}

export default GoBackButton;