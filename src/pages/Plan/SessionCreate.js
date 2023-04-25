import { React, useState, useContext } from 'react';
import { AccountContext } from "../../context";
import GoBackButton from '../../components/Common/GoBackButton';
import SessionForm from '../../components/Forms/SessionForm';
import RoundButton from '../../components/Common/RoundButton/RoundButton';
import { Check } from 'react-bootstrap-icons';

/**
 * A component for creating a session.
 * 
 * Consists of a list of plans, a field for entering a date and a
 * field for entering a time.
 * 
 * @author Calzone (2022-05-13), Hawaii (2022-05-13)
 */
function SessionCreate() {

    /**
     * A state for storing the chosen plan, start-date and time
     */
    const [sessionData, setSessionData] = useState({
        plan: "",
        name: "",
        date: "",
        time: ""
    })

    /**
     * Booleans associated with whether or not
     * the fields in the form have correct input.
     */
    const [fieldCheck, setFieldCheck] = useState({
        plan: false,
        date: false,
        buttonClicked: false
    })

    /**
     * The state of the alert,
     * notifying the user whether or not
     * a Session was sucessfully added.
     */
    const [displayAlert, setDisplayAlert] = useState()

    /**
     * Gets the token for the user
     */
    const { token } = useContext(AccountContext)

    /**
     * Is called when the data is modified by the form.
     * Updates the local data.
     * 
     * @param variableName  The name of the variable being updated.
     * @param value         The updated value.
     */
    function onClickData(variableName, value) {
        setSessionData({ ...sessionData, [variableName]: value })
    }

    /**
     * Is called when the data is modified by the form.
     * Updates the local data.
     */
    function onClickPlan(plan, planValue, name, nameValue) {
        setSessionData({ ...sessionData, [plan]: planValue, [name]: nameValue })
    }


    /**
     * A function that checks that a given field in the form is not empty.
     * Updates the fieldCheck useState.
     * 
     * @param fieldName     The name of the field being checked
     * @returns             If the field is not empty.
     */
    function checkNotEmpty(fieldName) {

        if (!fieldCheck[fieldName]) {
            if (sessionData[fieldName] !== "" && sessionData[fieldName] !== undefined)
                setFieldCheck({ ...fieldCheck, [fieldName]: true })
        }
        else {
            if (sessionData[fieldName] === "" || sessionData[fieldName] === undefined)
                setFieldCheck({ ...fieldCheck, [fieldName]: false })
        }

        return fieldCheck[fieldName]
    }


    /**
     * A function that will validate the users input.
     * If the input is invalid it will send a signal to the form and change
     * the input style.
     *
     * @returns Boolean 
     */
    function validateForm() {

        var res

        checkNotEmpty("plan")
        checkNotEmpty("date")

        if (sessionData.plan !== "" && sessionData.date !== "")
            res = successAlert()
        else if (sessionData.plan === "" && sessionData.date !== "")
            res = failureAlert("Vänligen välj en planering.")
        else if (sessionData.plan !== "" && sessionData.date === "")
            res = failureAlert("Vänligen välj ett datum.")
        else
            res = failureAlert("Vänligen fyll i alla fält.")

        return res
    }


    /**
     * A function that updates the displayAlert useState with a success message.
     * 
     * @returns     True
     */
    function successAlert() {
        setDisplayAlert(
            <div className="alert alert-success" role="alert">
                Tillfället lades till.
            </div>
        )
        return true
    }

    /**
     * A function that updates the displayAlert useState with a fail message.
     * The message is appended by a given body.
     * 
     * @param body  The string to append the message
     * 
     * @returns     False
     */
    function failureAlert(body) {
        setDisplayAlert(
            <div className="alert alert-danger"
                role="alert">
                Tillfället kunde inte läggas till. {body}
            </div>
        )
        return false
    }


    /**
     * Function for api call when adding a session
     */
    async function addSession() {
        let x = new Date(sessionData.date);
        let hoursDiff = x.getHours() - x.getTimezoneOffset() / 60;
        let minutesDiff = (x.getHours() - x.getTimezoneOffset()) % 60;
        x.setHours(hoursDiff);
        x.setMinutes(minutesDiff);
        sessionData.date = x
        const requestOptions = {
            method: "POST",
            headers: { 'Content-type': 'application/json', 'token': token },
            body: JSON.stringify({
                plan: sessionData.plan,
                date: sessionData.date,
                time: sessionData.time
            })
        };

        if (validateForm()) {
            try {
                const response = await fetch(`/api/session/add`, requestOptions);
                const res = await response.json();

                if (res.ok)
                    successAlert()

            } catch (error) {
                failureAlert("Generellt fel.")
            }
        }
    }

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <h2 className="display-4 text-center"><strong>Skapa tillfälle</strong></h2>

                    {/*Form to get input from user*/}
                    <SessionForm
                        data={sessionData}
                        buttonClicked={fieldCheck.buttonClicked}
                        dateOk={checkNotEmpty("date")}
                        onClickData={onClickData}
                        onClickPlan={onClickPlan}
                    />

                    {/*Button for the form. Calls the function addPlan. Retrieve the users input*/}
                    <RoundButton onClick={ () => addSession().then(() => {setFieldCheck({ ...fieldCheck, buttonClicked: true })})}>
                        <Check />
                    </RoundButton>

                    <GoBackButton returnPath={'/plan'} confirmationNeeded={
                        !((sessionData.plan === undefined || sessionData.plan === '')
                            && (sessionData.name === undefined || sessionData.name === '')
                            && (sessionData.date === undefined || sessionData.date === '')
                            && (sessionData.time === undefined || sessionData.time === ''))} />
                    {fieldCheck.buttonClicked ? displayAlert : ''}
                </div>
            </div>
        </div>
    )
}

export default SessionCreate