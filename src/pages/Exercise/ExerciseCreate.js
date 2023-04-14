import React from 'react';
import ExerciseForm from '../../components/Forms/ExerciseForm';
import "./ExerciseCreate.css";
import {AccountContext} from "../../context"
import GoBackButton from '../../components/Common/GoBackButton';

/**
 * The page for creating new exercises.
 *
 * @author Calskrove (2022-05-19), Hawaii (no date), Verona (2022-05-04)
 */
class ExerciseCreate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            name: '',
            desc: '',
            time: '',
            tags: [],
            allTags: '',
            exercise_id: '',
            insertFailed: false,
            tagfailed: false,
            storedName: '',
            storedDesc: '',
            storedTime: '',
            boxChecked: false,
            clickedButton: false,
            okName: true,
            okTime: true,
            isChanged: false, //isChanged and callBack values are used so we don't get an
                            //alert when not changing anything in the exercise

            callBack : false,    
            clearAlternative: false //true if alternative to automatically clear should show
        };
        this.addExercise = this.addExercise.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    /**
     * Method for API call when creating an exercise.
     *
     * @returns the id of the exercise that has been created
     */
    async addExercise() {
        let data = null;

        if (this.state.name !== undefined) {
            this.setState({storedName: this.state.name});
        } else {
            this.setState({storedName: ""});
        }

        if (this.state.desc !== undefined) {
            this.setState({storedDesc: this.state.desc});
        } else {
            this.setState({storedDesc: ""});
        }

        this.setState({storedTime: this.state.time});

        const requestOptions = {
            method: "POST",
            headers: {'Content-type': 'application/json', 'token': this.context.token},
            body: JSON.stringify({name: this.state.name, description: this.state.desc, duration: this.state.time})
        };

        try {
            const response = await fetch(`/api/exercises/add`, requestOptions);
            if (response.ok) {
                data = await response.json();
                this.state.setState({insertFailed: false});
                this.forceUpdate();
            } else {
                 if (response.status === 409) {
                    alert("Namnet '" + this.state.storedName + "' är upptaget.");
                }
                this.state.setState({insertFailed: true});
                this.setState({boxChecked: false})
            }
        } catch (error) {
            console.log("Error at exercise insert");
            this.state.setState({insertFailed: true});
            this.forceUpdate();
        }
        return data.id;
    }

    /**
     * Method for API call when creating a tag.
     *
     * @returns the id of the exercise that has been created
     */
    async addTag(id) {
        let tag_id = null;
        ;
        if (this.state.tags === undefined) {
            return this.state.tagfailed;
        }

        for (let i = 0; i < this.state.tags.length; i++) {
            if (this.state.tags[i].__isNew__) {
                const requestOptions = {
                    method: "POST",
                    headers: {'Content-type': 'application/json', 'token': this.context.token},
                    body: JSON.stringify({name: this.state.tags[i].label})
                };
                try {
                    const response = await fetch('/api/tags/add', requestOptions);
                    if (response.ok) {
                        const data = await response.json();
                        tag_id = data.id;
                        this.state.setState({tagfailed: false});
                        this.forceUpdate();
                    } else {
                        this.state.setState({tagfailed: true});
                        this.forceUpdate();
                    }
                } catch (error) {
                    console.log("Error at tag insert");
                    this.state.setState({tagfailed: true});
                    this.forceUpdate();
                }
            } else {
                tag_id = this.state.tags[i].value;
            }
            await this.linkExerciseTag(id, tag_id);
        }

        return this.state.tagfailed;
    }

    /**
     * Method for API call when creating a tag.
     *
     * @returns the id of the exercise that has been created
     */
    async linkExerciseTag(ex_id, tag_id) {
        const requestOptions = {
            method: "POST",
            headers: {'Content-type': 'application/json', 'token': this.context.token},
            body: JSON.stringify({"exerciseId": ex_id})
        };

        try {
            const response = await fetch('/api/tags/add/exercise?tag=' + tag_id, requestOptions);
            if (response.ok) {
                this.state.setState({tagfailed: false});
                this.forceUpdate();
            } else {
                this.state.setState({tagfailed: true});
                this.forceUpdate();
            }
        } catch (error) {
            console.log("Error at tag link");
            this.state.setState({tagfailed: true});
            this.forceUpdate();
        }
    }

    /**
     * Updates the states each time an input is changed.
     * @param changeObject
     */
    handleChange(changeObject) {
        this.setState(changeObject);
    }

    /**
     * Updates data sent from the ExerciseForm component.
     * @param formData Updated data.
     */
    handleCallback = (formData) => {
        //Will skip changing the boolean at load
        if (this.state.callBack) {
            this.state.setState({isChanged: true})
        }
        this.state.setState({callBack: true})
        this.setState(formData);
    }

    /**
     * Calls the API calls in the correct order by
     * first creating the exercise, then the required tags and last
     * linking the exercise with the tags required.
     */

    addExerciseAndTags = () => {
        this.setState({clickedButton: true});
        this.addExercise().then((id) => this.addTag(id)).then((tag) => this.exit_prodc(tag));
    }

    /**
     * Checks if insert worked, if so redirect back to exercise.
     * @param tagfailed
     */
    exit_prodc(tagfailed) {
        if (this.state.insertFailed === false && tagfailed === false) {
            if (document.getElementById("checkbox").checked === false) {
                window.location.href = "../exercise";
            } else {
                if (document.getElementById('clearbox').checked) {
                    this.setState({name: ''});
                    this.setState({desc: ''});
                    this.setState({time: ''});
                }
                this.state.setState({isChanged: false});

                this.setState({boxChecked: true});
                this.forceUpdate();
            }
        }
    }

    /**
     * A function that will validate the users input on name.
     * If the input is invalid it will send a signal to the form and change
     * the input style.
     *
     * @returns Boolean
     */
    checkName() {
        if (this.state.okName === false) {
            if (this.state.name !== "" && this.state.name !== undefined) {
                this.setState({okName: true});
            }
        }

        if (this.state.clickedButton === true) {
            if (this.state.storedName === "") {
                this.setState({okName: false});
            } else {
                this.setState({okName: true});
            }
            this.setState({clickedButton: false});
        }
        return this.state.okName;
    }

    /**
     * A function that will validate the users input on time.
     * If the input is invalid it will send a signal to the form and change
     * the input style.
     *
     * @returns Boolean
     */
    checkTime() {
        if (this.state.okTime === false) {
            if (this.state.time >= 0) {
                this.setState({okTime: true});
            }
        }


        if (this.state.clickedButton === true) {
            if (this.state.storedTime < 0) {
                this.setState({okTime: false});
            } else {
                this.setState({okTime: true});
            }
        }
        return this.state.okTime;
    }

    /**
     * Render - The main meat of the class, containing the general functionality.
     * The function is executed when going to or refreshing the page.
     * @returns A page for creating an exercise.
     */
    render() {
        let failedAlert;    //should be true if insert failed
        let successAlert;
        if (this.state.insertFailed | this.state.tagfailed) {
            failedAlert = <div className="alert alert-danger" role="alert">
                Övningen {this.state.storedName} kunde ej läggas till
            </div>;
        }

        if (this.state.boxChecked) {
            successAlert = <div className="alert alert-success" role="alert">
                Övningen {this.state.storedName} lades till
            </div>;
        } else {
            successAlert = '';
        }

        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <h2 className="display-4 text-center"><strong>Skapa övning</strong></h2>
                        {/*Form to get input from user*/}
                        <ExerciseForm
                            exerciseCallback={this.handleCallback}
                            name={this.state.name}
                            desc={this.state.desc}
                            time={this.state.time}
                            okName={this.checkName()}
                            okTime={this.checkTime()}
                            resetTitle={"Rensa allt"}
                        />
                        {/*Button for the form. Calls the function addExercise. Retrieve the users input*/}
                        <button className="btn btn-color btn-done" type='button'
                                onClick={() => this.addExerciseAndTags()}>
                            Lägg till
                        </button>

                        <GoBackButton confirmationNeeded={
                            !((this.state.name === undefined || this.state.name === '')
                                && (this.state.desc === undefined || this.state.desc === ''))
                            && this.state.isChanged}
                        />



                        <div> 
                            Lägg till fler övningar  
                            <input className='stay-box' type="checkbox" id="checkbox" onChange={(e) => this.setState({clearAlternative: !this.state.clearAlternative})}/>
                        </div>

                        {this.state.clearAlternative ? 
                                <div className={this.state.clearAlternative ? '' : 'grey'}> 
                                    Rensa text 
                                    <input className={this.state.clearAlternative ? 'stay-box' : 'stay-box grey-box'} type="checkbox" id="clearbox"/>
                                </div>
                            :
                                <div className={this.state.clearAlternative ? '' : 'grey'}> 
                                    Rensa text 
                                    <input className={this.state.clearAlternative ? 'stay-box' : 'stay-box grey-box'} type="checkbox" id="clearbox" checked={false}/>
                                </div>
                        }

                        {failedAlert}
                        {successAlert}
                    </div>
                </div>
            </div>
        );
    }
}

ExerciseCreate.contextType = AccountContext
export default ExerciseCreate;
